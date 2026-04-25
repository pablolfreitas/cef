/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Permite importar arquivos .module.css com tipagem
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
