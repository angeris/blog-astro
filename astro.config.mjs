// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from "remark-math";
import rehypeMathML from "@daiji256/rehype-mathml";

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeMathML],
		shikiConfig: {
			themes: {
				light: 'rose-pine-dawn',
				dark: 'rose-pine',
			}
		}
	},
});
