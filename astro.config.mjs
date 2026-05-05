// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from "remark-math";
import temml from "temml"
import rehypeMathML from "@daiji256/rehype-mathml";

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [[rehypeMathML, {
			macros: temml.definePreamble(`
				\\renewcommand{\\reals}{\\mathbf{R}}
				\\renewcommand{\\to}{\\rightarrow}
				\\newcommand{\\diag}{\\mathbf{diag}}
				\\newcommand{\\E}{\\mathbf{E}}
				\\newcommand{\\conv}{\\operatorname{conv}}
				\\newcommand{\\span}{\\operatorname{span}}
			`)
		}]],
		shikiConfig: {
			themes: {
				light: 'rose-pine-dawn',
				dark: 'rose-pine',
			}
		}
	},
});
