#!/usr/bin/env python3
"""Pull / push Multica issue descriptions without jq.

Cross-platform (Linux / macOS / Windows). Requires:
  - `multica` on PATH and authenticated
  - Python 3.8+ (stdlib only)

Examples:
  python issue_description.py pull BAM-2
  python issue_description.py pull BAM-2 -o ./bam-2.md
  python issue_description.py push BAM-2 -i ./bam-2.md
  python issue_description.py push BAM-2 --stdin < ./bam-2.md
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any, List, Optional


def die(msg: str, code: int = 1) -> None:
    print(msg, file=sys.stderr)
    raise SystemExit(code)


def run_multica(args: List[str], *, stdin_text: Optional[str] = None) -> str:
    cmd = ["multica", *args]
    try:
        proc = subprocess.run(
            cmd,
            input=stdin_text,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
        )
    except FileNotFoundError:
        die("multica not found on PATH. Install/authenticate the Multica CLI first.")

    if proc.returncode != 0:
        err = (proc.stderr or proc.stdout or "").strip()
        die(f"multica failed ({proc.returncode}): {err or 'no output'}")

    return proc.stdout


def issue_get(issue: str) -> dict:
    raw = run_multica(["issue", "get", issue, "--output", "json"])
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        die(f"issue get returned non-JSON: {e}")

    if not isinstance(data, dict):
        die(f"unexpected issue get payload type: {type(data).__name__}")

    # Tolerate rare wrappers without inventing fields.
    if "description" not in data and isinstance(data.get("issue"), dict):
        data = data["issue"]
    if "description" not in data and isinstance(data.get("data"), dict):
        data = data["data"]

    return data


def default_out_path(issue: str, payload: dict) -> Path:
    ident = payload.get("identifier") or payload.get("id") or issue
    # Safe filename for Windows: no path separators / reserved-ish chars.
    safe = "".join(c if c.isalnum() or c in "-_." else "-" for c in str(ident))
    return Path(f"issue-{safe}.md")


def cmd_pull(issue: str, out: Optional[Path], meta: bool) -> None:
    payload = issue_get(issue)
    desc = payload.get("description")
    if desc is None:
        die("issue has no 'description' field in JSON")
    if not isinstance(desc, str):
        die(f"description is not a string: {type(desc).__name__}")

    path = out or default_out_path(issue, payload)
    path = path.resolve()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(desc, encoding="utf-8", newline="\n")

    if meta:
        print(
            json.dumps(
                {
                    "id": payload.get("id"),
                    "identifier": payload.get("identifier"),
                    "title": payload.get("title"),
                    "status": payload.get("status"),
                    "path": str(path),
                    "bytes": path.stat().st_size,
                },
                ensure_ascii=False,
                indent=2,
            )
        )
    else:
        print(str(path))


def ensure_cwd_file(path: Path) -> Path:
    """Multica rejects description files outside cwd unless --allow-external-file."""
    path = path.resolve()
    cwd = Path.cwd().resolve()
    try:
        path.relative_to(cwd)
    except ValueError:
        die(
            f"description file must live under cwd ({cwd}) for multica, "
            f"got {path}. cd there or copy the file in."
        )
    if not path.is_file():
        die(f"not a file: {path}")
    return path


def cmd_push(issue: str, infile: Optional[Path], use_stdin: bool) -> None:
    if use_stdin and infile is not None:
        die("use either --stdin or -i/--input, not both")
    if not use_stdin and infile is None:
        die("push requires -i/--input PATH or --stdin")

    if use_stdin:
        text = sys.stdin.read()
        # Write a cwd-local temp so we always use --description-file (Windows-safe).
        tmp = Path.cwd() / f".multica-desc-{os.getpid()}.md"
        try:
            tmp.write_text(text, encoding="utf-8", newline="\n")
            rel = tmp.name
            out = run_multica(
                ["issue", "update", issue, "--description-file", rel, "--output", "json"]
            )
        finally:
            try:
                tmp.unlink(missing_ok=True)  # type: ignore[call-arg]
            except TypeError:
                if tmp.exists():
                    tmp.unlink()
    else:
        assert infile is not None
        path = ensure_cwd_file(infile)
        # Prefer path relative to cwd for multica's cwd check.
        rel = os.path.relpath(path, Path.cwd())
        out = run_multica(
            ["issue", "update", issue, "--description-file", rel, "--output", "json"]
        )

    # Echo updated identifier if present.
    try:
        data: Any = json.loads(out)
        ident = data.get("identifier") or data.get("id") or issue
        print(ident)
    except json.JSONDecodeError:
        sys.stdout.write(out)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Pull/push Multica issue descriptions (no jq; Windows-safe)."
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    pull = sub.add_parser("pull", help="Download description to a local markdown file")
    pull.add_argument("issue", help="Issue id or key (e.g. BAM-2 or uuid)")
    pull.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output path (default: ./issue-<identifier>.md under cwd)",
    )
    pull.add_argument(
        "--meta",
        action="store_true",
        help="Print JSON metadata (id, title, path) instead of path only",
    )

    push = sub.add_parser("push", help="Upload a local file as the full description")
    push.add_argument("issue", help="Issue id or key")
    push.add_argument(
        "-i",
        "--input",
        type=Path,
        default=None,
        help="Input markdown path (must be under cwd)",
    )
    push.add_argument(
        "--stdin",
        action="store_true",
        help="Read description from stdin (written to a cwd temp file for multica)",
    )

    return p


def main(argv: Optional[List[str]] = None) -> None:
    args = build_parser().parse_args(argv)
    if args.cmd == "pull":
        cmd_pull(args.issue, args.output, args.meta)
    elif args.cmd == "push":
        cmd_push(args.issue, args.input, args.stdin)
    else:
        die(f"unknown command: {args.cmd}")


if __name__ == "__main__":
    main()
