import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    plugins: [
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/**/*',
                    dest: 'src'
                }
            ]
        })
    ],
    base: "/shopping-list/",
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                liste: resolve(__dirname, 'liste.html'),
            }
        }
    }
})
