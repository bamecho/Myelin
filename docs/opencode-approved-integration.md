对，URL 是公司内网地址，只说明上游在内网，不说明“不能截”。

  你现在有两条路，按成功率排序：

  1. 先试普通 mitmproxy 代理截取
  内网地址照样可以经过代理，只要这个魔改版 Cline 没有主动绕过代理。

  2. 如果它确实绕过代理，就做“本地劫持 + 反向代理”
  也就是把这个内网域名指到你本机，再由你本机转发到真实内网地址。

  后者更稳，我直接给你 PowerShell 方案。

  ———

  方案 A：先试普通代理截取

  先起 mitmdump：

  rtk mitmdump -p 8080 -s .\dump_cline.py

  dump_cline.py：

  import json
  from datetime import datetime
  from mitmproxy import http

  TARGET_HOST = "你的内网域名"
  OUT_FILE = "cline_requests.jsonl"

  def request(flow: http.HTTPFlow) -> None:
      if TARGET_HOST not in flow.request.pretty_host:
          return

      record = {
          "time": datetime.utcnow().isoformat() + "Z",
          "method": flow.request.method,
          "url": flow.request.pretty_url,
          "headers": dict(flow.request.headers),
          "body": flow.request.get_text(strict=False),
      }

      with open(OUT_FILE, "a", encoding="utf-8") as f:
          f.write(json.dumps(record, ensure_ascii=False) + "\n")

      print(f"[captured] {flow.request.method} {flow.request.pretty_url}")

  VS Code / Cursor settings.json：

  {
    "http.proxy": "http://127.0.0.1:8080",
    "http.proxyStrictSSL": false
  }

  导入 mitm 根证书：

  rtk powershell -Command "Import-Certificate -FilePath $env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.cer -CertStoreLocation
  Cert:\CurrentUser\Root"

  如果这样就能抓到，事情结束。

  ———

  方案 B：如果它绕过代理，就本地劫持这个内网域名

  这个方法不依赖 VS Code 代理设置。

  ### 1. 先解析出真实内网 IP

  假设你已经拿到 URL：

  $url = "https://llm-gateway.corp.local/v1/chat/completions"
  $uri = [uri]$url
  $hostName = $uri.Host
  $port = if ($uri.IsDefaultPort) { 443 } else { $uri.Port }

  Resolve-DnsName $hostName

  记下真实 IP，比如 10.20.30.40。

  ———

  ### 2. 安装 mitm 证书

  rtk powershell -Command "Import-Certificate -FilePath $env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.cer -CertStoreLocation
  Cert:\CurrentUser\Root"

  ———

  ### 3. 把这个域名指到本机

  需要管理员 PowerShell：

  $hostsPath = "$env:WINDIR\System32\drivers\etc\hosts"
  Add-Content -Path $hostsPath -Value "`n127.0.0.1 $hostName"
  ipconfig /flushdns

  这样 Cline 访问 llm-gateway.corp.local 时，会先打到你本机。

  ———

  ### 4. 用反向 MITM 转发到真实内网地址

  继续用刚才那个 dump_cline.py，然后启动：

  rtk mitmdump --mode reverse:https://10.20.30.40:443 -p 443 --set keep_host_header=true --ssl-insecure -s .\dump_cline.py

  参数含义：

  - --mode reverse:https://10.20.30.40:443：转发到真实内网地址
  - -p 443：本机监听 443
  - --set keep_host_header=true：保留原始 Host
  - --ssl-insecure：忽略上游证书校验，内网环境常用


  你就能拿到完整：

  - URL
  - headers
  - body
  - auth token
  - model
  - messages / tools

  ———

  一个现实问题

  如果这个内网服务依赖 SNI 或 mTLS：

  - SNI：有时用 IP 转发也能过，有时不行
  - mTLS：如果服务要求客户端证书，单纯 MITM 可能失败

  如果你遇到：

  - 连接失败
  - TLS 握手失败
  - 上游 4xx/5xx 明显异常

  那就说明它可能不是普通 OpenAI/Anthropic 风格 HTTP，需要再做定向适配。

  ———

  抓完后怎么判断能不能给 OpenCode 用

  看你抓到的路径：

  - /v1/chat/completions -> 按 OpenAI-compatible
  - /v1/messages -> 按 Anthropic
  - 公司自定义路径 -> OpenCode 不能直接打，要再写一层转发适配

  ———

  恢复 hosts

  抓完别忘了删掉那条 hosts：

  notepad $env:WINDIR\System32\drivers\etc\hosts

  把：

  127.0.0.1 llm-gateway.corp.local
  ``对，**内网地址** 只说明它在公司网络里，不说明你没法截。
  真正要看的是：`Cline` 这次请求是不是**绕过了代理直接连**。如果是，最稳的办法就是：

  **把这个内网域名劫到你本机，然后本机起一个反向 MITM，完整记录请求，再转发回真实内网服务。**

  这条路不需要改扩展源码。

  **做法**

  先假设你拿到的 URL 是：

  ```text
  https://llm-gateway.corp.local/v1/chat/completions

  ———

  1. 先解析出真实 IP，记下来

  先不要改 hosts。

  $u = [uri]"https://llm-gateway.corp.local/v1/chat/completions"
  $hostName = $u.Host
  $port = if ($u.IsDefaultPort) { 443 } else { $u.Port }

  Resolve-DnsName $hostName | Format-Table -AutoSize

  把解析出来的真实 IP 记下来，比如：

  10.20.30.40

  ———

  2. 准备一个 mitm 脚本，只落你关心的请求

  建一个文件 dump_cline.py：

  import json
  from datetime import datetime
  from mitmproxy import http

  OUT_FILE = "cline_requests.jsonl"

  def request(flow: http.HTTPFlow) -> None:
      try:
          body_text = flow.request.get_text(strict=False)
      except Exception:
          body_text = None

      record = {
          "time": datetime.utcnow().isoformat() + "Z",
          "method": flow.request.method,
          "url": flow.request.pretty_url,
          "host": flow.request.pretty_host,
          "path": flow.request.path,
          "headers": dict(flow.request.headers),
          "body": body_text,
      }

      with open(OUT_FILE, "a", encoding="utf-8") as f:
          f.write(json.dumps(record, ensure_ascii=False) + "\n")

      print(f"[captured] {flow.request.method} {flow.request.pretty_url}")

  ———

  3. 安装并信任 mitm 根证书

  先启动一次 mitm，让它生成证书目录：

  rtk mitmdump --version

  然后导入证书：

  Import-Certificate -FilePath "$env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.cer" -CertStoreLocation Cert:\CurrentUser\Root

  如果 PowerShell 没权限，就用“当前用户”足够；如果策略卡住，再开管理员 PowerShell。

  ———

  4. 起本地反向 MITM，转发到真实内网服务

  这里不要再用域名做上游，直接用你刚才记下来的真实 IP，避免 hosts 改完以后自己转自己。

  rtk mitmdump --mode reverse:https://10.20.30.40:443 -p 443 --set keep_host_header=true --ssl-insecure -s .\dump_cline.py

  说明：

  - --mode reverse:https://10.20.30.40:443：把请求转发回真实内网服务
  - -p 443：本机监听 443
  - --set keep_host_header=true：保留原始 Host，很多内网网关靠这个路由
  - --ssl-insecure：如果上游证书和 IP 不匹配，忽略校验
  - -s .\dump_cline.py：把完整请求落盘

  这一步通常需要管理员权限，因为要监听 443。

  ———

  5. 把内网域名指到本机

  管理员 PowerShell：

  $hostsPath = "$env:WINDIR\System32\drivers\etc\hosts"
  Copy-Item $hostsPath "$hostsPath.bak"
  Add-Content -Path $hostsPath -Value "`n127.0.0.1 llm-gateway.corp.local"
  ipconfig /flushdns

  现在 VS Code / Cline 再访问这个内网域名时，就会先打到你本机的 mitmdump。

  ———

  6. 重启 VS Code / Cursor，然后发一次请求

  成功后，你会在当前目录得到：

  里面会有完整：

  - URL
  - headers
  - Authorization
  - body
  - model
  - messages
  - tools

  ———

  7. 用完后恢复

  $hostsPath = "$env:WINDIR\System32\drivers\etc\hosts"
  Copy-Item "$hostsPath.bak" $hostsPath -Force
  ipconfig /flushdns

  ———

  几个关键判断

  如果这套方法失败，通常是下面几种情况：

  1. TLS pinning
     扩展校验证书指纹，不信任 mitm CA。这样 MITM 会失败。

  2. mTLS
     内网 API 要求客户端证书。你中间插一层后，上游认证可能过不去。

  3. 不是标准 HTTPS 请求
     比如它走别的进程、别的协议、或者 Electron/Node 的特殊网络路径。

  ———

  最现实的建议

  先别直接上 443 劫持。先验证一件事：

  - 这个扩展到底是不是真的绕过代理

  因为很多“内网地址”其实也照样能走代理。
  如果它能走代理，你前面的 mitmproxy + VS Code proxy 方案更简单，不用改 hosts，也更容易回滚。

  如果你把那个内网域名贴成示例格式（可以打码，比如 llm-xxx.corp.local）和端口告诉我，我可以直接把上面的命令替你改成可执行版本。