// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  /* -----------------------------------------------------------
     Dev‑server settings
     ----------------------------------------------------------- */
  server: {
    port: 5173,        // change to 3000 if you prefer
    host: '0.0.0.0',   // allow LAN / Docker access
    open: true,        // auto‑opens browser
    strictPort: true,  // fail instead of picking another port

    // Proxy API calls to your Express backend
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
