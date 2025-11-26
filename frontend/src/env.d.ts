interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_PORT?: string;
  readonly VITE_ENABLE_DEBUG?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
