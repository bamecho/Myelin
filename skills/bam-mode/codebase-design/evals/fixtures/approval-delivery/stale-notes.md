# Old proposal - not approved

Call the provider directly from both the HTTP handler and importer. Add a global
`ports` package containing Store, Notifier, Clock, Logger, and TransactionManager
interfaces. Split the worker into load, send, and mark-sent packages so every step
can be mocked independently. Generate a random delivery key for every retry.
