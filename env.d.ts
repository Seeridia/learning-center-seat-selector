/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SEAT_API_BASE_URL?: string
  readonly VITE_TOKEN_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
