// https://vike.dev/Head

import appleTouchIcon from "../assets/apple-touch-icon.png";
import favicon96x96 from "../assets/favicon-96x96.png";
import faviconIco from "../assets/favicon.ico";
import faviconSvg from "../assets/favicon.svg";
import siteWebmanifest from "../assets/site.webmanifest";

// https://realfavicongenerator.net/
export default function HeadDefault() {
	return (
		<>
			<link rel="icon" type="image/png" href={favicon96x96} sizes="96x96" />
			<link rel="icon" type="image/svg+xml" href={faviconSvg} />
			<link rel="shortcut icon" href={faviconIco} />
			<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
			<meta name="apple-mobile-web-app-title" content="dowhile.uz" />
			<link rel="manifest" href={siteWebmanifest} />
		</>
	);
}
