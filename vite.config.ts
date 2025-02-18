import { URL, fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import json5Plugin from "vite-plugin-json5";

const isStorybook = process.env.IS_STORYBOOK === "true";

export default defineConfig({
	plugins: [
		!isStorybook &&
			vike({
				prerender: true,
			}),
		react({}),
		json5Plugin({}),
	],
	server: {
		allowedHosts: [".dowhile.uz"],
	},
	preview: {
		allowedHosts: [".dowhile.uz"],
	},
	resolve: {
		alias: {
			"@app": fileURLToPath(new URL("./app", import.meta.url)),
			"@widgets": fileURLToPath(new URL("./widgets", import.meta.url)),
			"@features": fileURLToPath(new URL("./features", import.meta.url)),
			"@entities": fileURLToPath(new URL("./entities", import.meta.url)),
			"@shared": fileURLToPath(new URL("./shared", import.meta.url)),
		},
	},
});
