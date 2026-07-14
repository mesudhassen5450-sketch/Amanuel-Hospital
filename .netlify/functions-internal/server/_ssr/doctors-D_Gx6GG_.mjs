import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { T as useLanguage, _ as t, c as Reveal, d as cn, l as SiteLayout, m as doctors, n as Button, t as AppointmentDialog, w as translations, y as translatedDoctors } from "./Reveal-B9bpCSTc.mjs";
import { t as PageHero } from "./PageHero-C3S-6tfc.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function DoctorsPage() {
	const { lang } = useLanguage();
	const tr = translations.doctors;
	const translatedList = translatedDoctors[lang].map((d, i) => ({
		...d,
		name: doctors[i].name,
		photo: doctors[i].photo,
		availableToday: doctors[i].availableToday
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		breadcrumb: t(tr.breadcrumb, lang),
		title: t(tr.heroTitle, lang),
		subtitle: t(tr.heroSub, lang)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8",
			children: translatedList.map((doc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i % 3 * 70,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group h-full overflow-hidden rounded-2xl border border-border bg-card hover-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "img-zoom aspect-[4/3]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: doc.photo,
							alt: `Portrait of ${doc.name}`,
							width: 640,
							height: 800,
							loading: "lazy",
							className: "h-full w-full object-cover object-top"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "truncate font-display text-lg font-semibold",
										children: doc.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm text-muted-foreground",
										children: doc.specialty
									})]
								}), doc.availableToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "shrink-0 rounded-full bg-success/15 text-success hover:bg-success/15",
									children: t(tr.available, lang)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: doc.experience
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-5 w-full rounded-xl",
								children: t(tr.bookAppt, lang)
							}) })
						]
					})]
				})
			}, doc.name))
		})
	})] });
}
//#endregion
export { DoctorsPage as component };
