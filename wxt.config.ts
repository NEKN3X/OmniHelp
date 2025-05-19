import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'OmniHelp',
    permissions: [
      'storage',
      'unlimitedStorage',
      'search',
      'tabs',
      'scripting',
      'activeTab',
    ],
    omnibox: { keyword: '>' },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
});
