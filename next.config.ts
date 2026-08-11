import type { NextConfig } from "next";

// GitHub Pages only serves static files, so the Pages build (STATIC_EXPORT=true)
// switches Next.js to `output: "export"`. Left unset, this stays a normal server
// build so the existing Cloudflare/OpenNext deploy pipeline is unaffected.
const nextConfig: NextConfig = process.env.STATIC_EXPORT
	? {
			output: "export",
		}
	: {
			/* config options here */
		};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
