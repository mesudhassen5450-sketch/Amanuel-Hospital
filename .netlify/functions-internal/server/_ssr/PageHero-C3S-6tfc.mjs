import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as ChevronRight } from "../_libs/lucide-react.mjs";
import { T as useLanguage, _ as t, w as translations } from "./Reveal-B9bpCSTc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PageHero-C3S-6tfc.js
var import_jsx_runtime = require_jsx_runtime();
function PageHero({ title, subtitle, breadcrumb }) {
	const { lang } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "gradient-soft border-b border-border pb-14 pt-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Breadcrumb",
					className: "flex items-center gap-1.5 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "transition-colors hover:text-primary",
							children: t(translations.common.home, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: breadcrumb
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl font-bold text-foreground md:text-5xl animate-fade-up",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-base text-muted-foreground md:text-lg",
					children: subtitle
				})
			]
		})
	});
}
//#endregion
export { PageHero as t };
