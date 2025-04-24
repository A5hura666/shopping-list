import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    base: "/shopping-list/",
    build: {
        outDir: 'dist',
    }
})