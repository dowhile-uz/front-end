import querystring from "node:querystring";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import proxy from "express-http-proxy";
import { createDevMiddleware, renderPage } from "vike/server";

// @ts-expect-error
import { root } from "./root.ts";

const isProduction = process.env.NODE_ENV === "production";

startServer();

function createCookie(options: {
	key: string;
	value: string;
	path: string;
	toDelete?: boolean;
	httpOnly?: boolean;
}): string {
	let cookie = `${options.key}=${options.value}; path=${options.path}`;

	if (options.toDelete) {
		cookie += "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}

	if (options.httpOnly) {
		cookie += "; HttpOnly";
	}

	return cookie;
}

async function startServer() {
	const app = express();

	app.use(compression());
	app.use(cookieParser());

	console.log(root);

	if (isProduction) {
		const sirv = (await import("sirv")).default;
		app.use(sirv(`${root}/dist/client`));
	} else {
		const { devMiddleware } = await createDevMiddleware({ root });
		app.use(devMiddleware);
	}

	app.get<
		unknown,
		unknown,
		unknown,
		{ access_token: string | undefined; back: string | undefined }
	>("/github-auth/complete", async (req, res) => {
		res
			.status(302)
			.set({
				"Set-Cookie": createCookie({
					key: "access-token",
					value: req.query.access_token ?? "1",
					path: "/",
					httpOnly: true,
				}),
				Location: `/?${querystring.stringify({ back: req.query.back })}`,
			})
			.send("");
	});

	app.get<unknown, unknown, unknown, { back: string | undefined }>(
		"/logout",
		async (req, res) => {
			res
				.status(302)
				.set({
					"Set-Cookie": createCookie({
						key: "access-token",
						value: "1",
						path: "/",
						toDelete: true,
						httpOnly: true,
					}),
					Location: `/?${querystring.stringify({ back: req.query.back })}`,
				})
				.send("");
		},
	);

	app.get(
		[/\/api\/.*/, "/openapi.yaml"],
		proxy(process.env.VITE_BACKEND_URL ?? "http://127.0.0.1:8000", {
			proxyReqOptDecorator(proxyReqOpts, srcReq) {
				if (!proxyReqOpts.headers) {
					proxyReqOpts.headers = {};
				}

				proxyReqOpts.headers["X-Real-IP"] = srcReq.ip;
				proxyReqOpts.headers["X-Forwarded-For"] = srcReq.ips;

				const accessToken = srcReq.cookies["access-token"];

				if (!accessToken) {
					return proxyReqOpts;
				}

				proxyReqOpts.headers.Authorization = `Bearer ${accessToken}`;

				return proxyReqOpts;
			},
			proxyReqPathResolver(req) {
				if (req.path === "/openapi.yaml") {
					return req.path;
				}

				return req.path.split("/api").slice(1).join("");
			},
			userResHeaderDecorator(headers, _, __, ___, proxyRes) {
				if (proxyRes.statusCode === 401) {
					headers["Set-Cookie"] = [
						...(headers["Set-Cookie"] ?? []),
						createCookie({
							key: "access-token",
							value: "1",
							path: "/",
							toDelete: true,
							httpOnly: true,
						}),
					];
				}

				return headers;
			},
		}),
	);

	app.get("*", async (req, res) => {
		const pageContextInit = {
			urlOriginal: req.originalUrl,
			headersOriginal: req.headers,
		};

		const pageContext = await renderPage(pageContextInit);

		if (pageContext.errorWhileRendering) {
			// Install error tracking here, see https://vike.dev/error-tracking
		}

		const { httpResponse } = pageContext;

		if (res.writeEarlyHints) {
			res.writeEarlyHints({
				link: httpResponse.earlyHints.map((e) => e.earlyHintLink),
			});
		}

		for (const [name, value] of httpResponse.headers) {
			res.setHeader(name, value);
		}

		res.status(httpResponse.statusCode);

		// For HTTP streams use pageContext.httpResponse.pipe() instead, see https://vike.dev/streaming
		res.send(httpResponse.body);
	});

	const port = process.env.PORT || 3000;
	app.listen(port);
	console.log(`Server running at http://127.0.0.1:${port}`);
}
