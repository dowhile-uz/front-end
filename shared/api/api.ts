import { QueryClient } from "@tanstack/react-query";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./openapi";

export const fetchClient = createFetchClient<paths>({
	baseUrl: "/api",
});

export const queryClient = new QueryClient();

export const $api = createClient(fetchClient);
