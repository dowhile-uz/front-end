import React from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
	const { is404 } = usePageContext();
	if (is404) {
		return (
			<>
				<h1>404 Sahifa topilmadi</h1>
				<p>Siz izlagan sahifani topa olmadik :(</p>
			</>
		);
	}
	return (
		<>
			<h1>500 Bizning xatoyimiz</h1>
			<p>Bu yerda hozircha yordam bera olmaymiz :(</p>
		</>
	);
}
