import { LayoutDefault } from "@widgets/layouts";
import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
	// https://vike.dev/Layout
	Layout: LayoutDefault,

	// https://vike.dev/head-tags
	title: "dowhile.uz - dasturchilar hamjamiyati",
	description: "dowhile.uz - dasturchilar hamjamiyati",
	lang: "uz",
	ssr: false,
	stream: true,

	extends: vikeReact,
} satisfies Config;
