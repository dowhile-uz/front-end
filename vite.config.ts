// @ts-expect-error
import { URL, fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vike({}), react({})],
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
