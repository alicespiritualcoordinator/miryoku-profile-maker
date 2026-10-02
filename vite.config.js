import { defineConfig } from 'vite';

// GitHub Pages のリポジトリ配下でも静的ファイルを読み込めるようにする。
export default defineConfig({ base: './' });
