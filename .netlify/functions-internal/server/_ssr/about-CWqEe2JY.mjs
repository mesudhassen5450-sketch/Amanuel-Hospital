import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { L as Award, b as HeartHandshake, n as Target, w as Eye, z as ArrowRight } from "../_libs/lucide-react.mjs";
import { T as useLanguage, _ as t, c as Reveal, h as galleryImages, l as SiteLayout, n as Button, w as translations } from "./Reveal-B9bpCSTc.mjs";
import { t as PageHero } from "./PageHero-C3S-6tfc.mjs";
import { t as SectionHeading } from "./SectionHeading-CZslYzdP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-CWqEe2JY.js
var import_jsx_runtime = require_jsx_runtime();
var cash_default = "/assets/cash-CcP19r_Y.jpg";
function AboutPage() {
	const { lang } = useLanguage();
	const tr = translations.about;
	const values = [
		{
			icon: HeartHandshake,
			title: t(tr.values.compassionTitle, lang),
			text: t(tr.values.compassionText, lang)
		},
		{
			icon: Award,
			title: t(tr.values.excellenceTitle, lang),
			text: t(tr.values.excellenceText, lang)
		},
		{
			icon: Target,
			title: t(tr.values.integrityTitle, lang),
			text: t(tr.values.integrityText, lang)
		},
		{
			icon: Eye,
			title: t(tr.values.innovationTitle, lang),
			text: t(tr.values.innovationText, lang)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			breadcrumb: t(tr.breadcrumb, lang),
			title: t(tr.heroTitle, lang),
			subtitle: t(tr.heroSub, lang)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "img-zoom rounded-3xl card-shadow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: cash_default,
						alt: "Reception lobby of Dr. Amanuel Hospital",
						width: 1200,
						height: 900,
						loading: "lazy",
						className: "h-full w-full rounded-3xl object-cover"
					})
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 120,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
							align: "left",
							eyebrow: t(tr.whoWeAre, lang),
							title: t(tr.caring, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-muted-foreground",
							children: t(tr.introPara, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 hover-lift",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "flex items-center gap-2 font-display font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
											className: "h-5 w-5 text-primary",
											"aria-hidden": "true"
										}),
										" ",
										t(tr.ourMission, lang)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: t(tr.missionText, lang)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 hover-lift",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "flex items-center gap-2 font-display font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
											className: "h-5 w-5 text-primary",
											"aria-hidden": "true"
										}),
										" ",
										t(tr.ourVision, lang)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: t(tr.visionText, lang)
								})]
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "gradient-soft py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: t(tr.coreValues, lang),
					title: t(tr.guidesUs, lang)
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
					children: values.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 70,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group h-full rounded-2xl border border-border bg-card p-6 text-center hover-lift",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-auto grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(v.icon, {
										className: "h-6 w-6",
										"aria-hidden": "true"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-display font-semibold",
									children: v.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: v.text
								})
							]
						})
					}, v.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl px-4 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: t(tr.ourJourney, lang),
					title: t(tr.milestones, lang)
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "relative mt-12 space-y-8 border-l-2 border-primary/20 pl-8",
					children: [
						{
							year: "2010",
							event: {
								en: "Hospital founded as a small clinic serving the Bishoftu community.",
								am: "ሆስፒታሉ ቢሾፍቱ ማህበረሰቡን እያገለገለ እንደ ትንሽ ክሊኒክ ተቋቋመ።",
								or: "Hospitaalli hawaasa Bishooftuu tajaajilu akka kilinika xiqqaatti hundaa'e."
							}
						},
						{
							year: "2014",
							event: {
								en: "Expanded to a full general hospital with inpatient wards.",
								am: "ወደ ሙሉ ጠቅላላ ሆስፒታል ተስፋፍቶ ታካሚ ወርዶች ተጨመሩ።",
								or: "Hospitaala waliigalaa guutuu kutaalee dhukkubsataa waliin babal'ate."
							}
						},
						{
							year: "2017",
							event: {
								en: "Opened modern operating theaters and maternity wing.",
								am: "ዘመናዊ የቀዶ ጥገና ቤቶችና የወሊድ ክፍል ተከፈቱ።",
								or: "Kutaalee qoricha fi kutaa da'umsaa ammayyaa banaman."
							}
						},
						{
							year: "2020",
							event: {
								en: "Added CT imaging and upgraded the diagnostic laboratory.",
								am: "CT ምስፍፍ ተጨምሮ ምርምር ላቦራቶሪ ተዘምኗል።",
								or: "Fakkii CT dabalatee laboratoori qorannoo fooyya'e."
							}
						},
						{
							year: "2023",
							event: {
								en: "Launched 24/7 emergency department with ambulance service.",
								am: "24/7 የአደጋ ክፍል ከአምቡላንስ አገልግሎት ጋር ተጀምሯል።",
								or: "Kutaan ariifachiisaa 24/7 tajaajila ambulaansii waliin eegale."
							}
						},
						{
							year: "2025",
							event: {
								en: "Serving tens of thousands of patients every year.",
								am: "በዓመት ብዙ ሺ ታካሚዎችን እያገለገሉ ነው።",
								or: "Dhukkubsattoota kuma hedduuf tajaajila yeroo hunda kennaa jira."
							}
						}
					].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 60,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full bg-primary ring-4 ring-background",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg font-bold text-primary",
									children: item.year
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground md:text-base",
									children: t(item.event, lang)
								})
							]
						})
					}, item.year))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "gradient-soft py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						align: "left",
						eyebrow: t(tr.achievements, lang),
						title: t(tr.whyChooseUs, lang)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-3",
						children: [
							{
								en: "24/7 emergency and ambulance coordination",
								am: "24/7 አደጋ እና አምቡላንስ ቅንጅት",
								or: "Koordineeshiinii ariifachiisaa fi ambulaansii 24/7"
							},
							{
								en: "Modern surgical theaters with international safety protocols",
								am: "ዓለም አቀፍ የደህንነት ፕሮቶኮሎች ያሉ ዘመናዊ ቀዶ ቤቶች",
								or: "Kutaalee qoricha ammayyaa protokolii nageenya idil-addunyaa qaban"
							},
							{
								en: "Comprehensive maternal and child health services",
								am: "ሁሉን አቀፍ የእናቶችና ሕፃናት ጤና አገልግሎቶች",
								or: "Tajaajila fayyaa haadha fi daa'imaa guutuu"
							},
							{
								en: "Advanced imaging: digital X-ray, ultrasound and CT",
								am: "የላቀ ምስፍፍ ቴክኖሎጂ፡ ዲጂታል ኤክስሬይ፣ ኡልትራሳውንድ እና CT",
								or: "Fakkii olaanaa: X-ray dijitaalaa, ultrasound fi CT"
							},
							{
								en: "Automated laboratory with strict quality control",
								am: "ጥብቅ ጥራት ቁጥጥር ያለው አውቶማቲክ ላቦራቶሪ",
								or: "Laboratoori awtomeetii qabiyyee qulqulluu cimaaan to'atame"
							},
							{
								en: "Trusted by thousands of families across Oromia",
								am: "በኦሮሚያ ብዙ ሺ ቤተሰቦች የሚያምኑበት",
								or: "Maatii kuma hedduun Oromiyaa keessatti amanamaa ta'e"
							}
						].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 text-sm text-muted-foreground md:text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
								className: "mt-0.5 h-4 w-4 shrink-0 text-primary",
								"aria-hidden": "true"
							}), t(a, lang)]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-8 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/gallery",
							children: [
								t(tr.exploreGallery, lang),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "ml-1 h-4 w-4",
									"aria-hidden": "true"
								})
							]
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 120,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-4",
						children: galleryImages.slice(0, 4).map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "img-zoom rounded-2xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img.src,
								alt: img.alt,
								width: img.width,
								height: img.height,
								loading: "lazy",
								className: "aspect-square h-full w-full rounded-2xl object-cover"
							})
						}, img.src))
					})
				})]
			})
		})
	] });
}
//#endregion
export { AboutPage as component };
