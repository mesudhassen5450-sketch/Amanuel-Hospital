import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as Root, o as CollapsibleContent$1, s as CollapsibleTrigger$1, x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { j as ChevronDown } from "../_libs/lucide-react.mjs";
import { T as useLanguage, _ as t, c as Reveal, d as cn, g as services, l as SiteLayout, n as Button, t as AppointmentDialog, w as translations, x as translatedServices } from "./Reveal-B9bpCSTc.mjs";
import { t as PageHero } from "./PageHero-C3S-6tfc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-CqrgtDq5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Collapsible = Root;
var CollapsibleTrigger = CollapsibleTrigger$1;
var CollapsibleContent = CollapsibleContent$1;
function ServicesPage() {
	const { lang } = useLanguage();
	const tr = translations.services;
	const translatedList = translatedServices[lang].map((s, i) => ({
		...s,
		icon: services[i].icon
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		breadcrumb: t(tr.breadcrumb, lang),
		title: t(tr.heroTitle, lang),
		subtitle: t(tr.heroSub, lang)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8",
			children: translatedList.map((service, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i % 3 * 70,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, { service })
			}, service.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mt-14 max-w-7xl px-4 text-center lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "rounded-xl px-8",
				children: t(tr.bookAppt, lang)
			}) })
		})]
	})] });
}
function ServiceCard({ service }) {
	const { lang } = useLanguage();
	const tr = translations.sections;
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group h-full rounded-2xl border border-border bg-card p-6 hover-lift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-13 w-13 place-items-center rounded-xl bg-secondary p-3 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(service.icon, {
					className: "h-7 w-7",
					"aria-hidden": "true"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-xl font-semibold",
				children: service.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: service.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Collapsible, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, {
					className: "overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-xl bg-secondary/60 p-4 text-sm text-foreground/80",
						children: service.detail
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "mt-3 rounded-xl px-3 text-primary hover:text-primary",
						children: [open ? t(tr.showLess, lang) : t(tr.learnMore, lang), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
							className: cn("ml-1 h-4 w-4 transition-transform", open && "rotate-180"),
							"aria-hidden": "true"
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { ServicesPage as component };
