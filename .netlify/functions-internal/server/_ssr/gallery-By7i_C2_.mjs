import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { T as useLanguage, _ as t, a as DialogTitle, c as Reveal, h as galleryImages, i as DialogContent, l as SiteLayout, r as Dialog, w as translations } from "./Reveal-B9bpCSTc.mjs";
import { t as PageHero } from "./PageHero-C3S-6tfc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gallery-By7i_C2_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GalleryPage() {
	const { lang } = useLanguage();
	const tr = translations.gallery;
	const [selected, setSelected] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			breadcrumb: t(tr.breadcrumb, lang),
			title: t(tr.heroTitle, lang),
			subtitle: t(tr.heroSub, lang)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-7xl columns-1 gap-5 px-4 sm:columns-2 lg:columns-3 lg:px-8 [&>div]:mb-5",
				children: galleryImages.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i % 3 * 60,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSelected(img),
						className: "img-zoom block w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-ring",
						"aria-label": `View larger: ${img.alt}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img.src,
							alt: img.alt,
							width: img.width,
							height: img.height,
							loading: "lazy",
							className: "w-full rounded-2xl object-cover"
						})
					})
				}, img.src))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!selected,
			onOpenChange: (o) => !o && setSelected(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-w-4xl overflow-hidden rounded-2xl border-none bg-transparent p-0 shadow-none",
				children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: selected.alt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: selected.src,
					alt: selected.alt,
					width: selected.width,
					height: selected.height,
					className: "max-h-[80vh] w-full rounded-2xl object-contain animate-scale-in"
				})] })
			})
		})
	] });
}
//#endregion
export { GalleryPage as component };
