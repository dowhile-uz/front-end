import { $api } from "@shared/api";

export const useUser = () => {
	return $api.useQuery(
		"get",
		"/v1/profile",
		{},
		{
			retry: false,
		},
	);
};
