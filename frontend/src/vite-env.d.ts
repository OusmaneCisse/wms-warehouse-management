/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // plus d'autres variables d'environnement...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
