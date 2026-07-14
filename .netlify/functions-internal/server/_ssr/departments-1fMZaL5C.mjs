import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { T as useLanguage, _ as t, c as Reveal, l as SiteLayout, p as departments, v as translatedDepartments, w as translations } from "./Reveal-B9bpCSTc.mjs";
import { t as PageHero } from "./PageHero-C3S-6tfc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/departments-1fMZaL5C.js
var import_jsx_runtime = require_jsx_runtime();
function DepartmentsPage() {
	const { lang } = useLanguage();
	const tr = translations.departments;
	const depts = translatedDepartments[lang].map((d, i) => ({
		...d,
		icon: departments[i].icon
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		breadcrumb: t(tr.breadcrumb, lang),
		title: t(tr.heroTitle, lang),
		subtitle: t(tr.heroSub, lang)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8",
			children: depts.map((dept, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i % 3 * 70,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group h-full rounded-2xl border border-border bg-card p-6 hover-lift",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(dept.icon, {
								className: "h-7 w-7 transition-transform duration-300 group-hover:animate-pulse-soft",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-display text-xl font-semibold",
							children: dept.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: dept.description
						})
					]
				})
			}, dept.name))
		})
	})] });
}
//#endregion
export { DepartmentsPage as component };
