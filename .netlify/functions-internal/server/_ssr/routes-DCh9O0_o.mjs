import { r as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as Trigger2, i as Root2, n as Header, r as Item, t as Content2, x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { B as ArrowLeft, V as Ambulance, a as Star, d as Pill, i as Stethoscope, j as ChevronDown, l as Search, y as HeartPulse, z as ArrowRight } from "../_libs/lucide-react.mjs";
import { C as translatedTestimonials, S as translatedStats, T as useLanguage, _ as t, b as translatedFaqs, c as Reveal, d as cn, g as services, l as SiteLayout, m as doctors, n as Button, o as Input, t as AppointmentDialog, w as translations } from "./Reveal-B9bpCSTc.mjs";
import { t as SectionHeading } from "./SectionHeading-CZslYzdP.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DCh9O0_o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StatCounter({ value, suffix = "", label }) {
	const ref = (0, import_react.useRef)(null);
	const [display, setDisplay] = (0, import_react.useState)(0);
	const [started, setStarted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setStarted(true);
				obs.disconnect();
			}
		}, { threshold: .4 });
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!started) return;
		const duration = 1600;
		const start = performance.now();
		let raf;
		const tick = (now) => {
			const p = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - p, 3);
			setDisplay(Math.round(eased * value));
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [started, value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "font-display text-3xl font-bold text-primary-foreground md:text-4xl",
			children: [display.toLocaleString(), suffix]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-sm text-primary-foreground/80",
			children: label
		})]
	});
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var CarouselContext = import_react.createContext(null);
function useCarousel() {
	const context = import_react.useContext(CarouselContext);
	if (!context) throw new Error("useCarousel must be used within a <Carousel />");
	return context;
}
var Carousel = import_react.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
	const [carouselRef, api] = useEmblaCarousel({
		...opts,
		axis: orientation === "horizontal" ? "x" : "y"
	}, plugins);
	const [canScrollPrev, setCanScrollPrev] = import_react.useState(false);
	const [canScrollNext, setCanScrollNext] = import_react.useState(false);
	const onSelect = import_react.useCallback((api) => {
		if (!api) return;
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	}, []);
	const scrollPrev = import_react.useCallback(() => {
		api?.scrollPrev();
	}, [api]);
	const scrollNext = import_react.useCallback(() => {
		api?.scrollNext();
	}, [api]);
	const handleKeyDown = import_react.useCallback((event) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			scrollPrev();
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			scrollNext();
		}
	}, [scrollPrev, scrollNext]);
	import_react.useEffect(() => {
		if (!api || !setApi) return;
		setApi(api);
	}, [api, setApi]);
	import_react.useEffect(() => {
		if (!api) return;
		onSelect(api);
		api.on("reInit", onSelect);
		api.on("select", onSelect);
		return () => {
			api?.off("select", onSelect);
		};
	}, [api, onSelect]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContext.Provider, {
		value: {
			carouselRef,
			api,
			opts,
			orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
			scrollPrev,
			scrollNext,
			canScrollPrev,
			canScrollNext
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			onKeyDownCapture: handleKeyDown,
			className: cn("relative", className),
			role: "region",
			"aria-roledescription": "carousel",
			...props,
			children
		})
	});
});
Carousel.displayName = "Carousel";
var CarouselContent = import_react.forwardRef(({ className, ...props }, ref) => {
	const { carouselRef, orientation } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: carouselRef,
		className: "overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className),
			...props
		})
	});
});
CarouselContent.displayName = "CarouselContent";
var CarouselItem = import_react.forwardRef(({ className, ...props }, ref) => {
	const { orientation } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		role: "group",
		"aria-roledescription": "slide",
		className: cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className),
		...props
	});
});
CarouselItem.displayName = "CarouselItem";
var CarouselPrevious = import_react.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		variant,
		size,
		className: cn("absolute  h-8 w-8 rounded-full", orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className),
		disabled: !canScrollPrev,
		onClick: scrollPrev,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Previous slide"
		})]
	});
});
CarouselPrevious.displayName = "CarouselPrevious";
var CarouselNext = import_react.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollNext, canScrollNext } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		variant,
		size,
		className: cn("absolute h-8 w-8 rounded-full", orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className),
		disabled: !canScrollNext,
		onClick: scrollNext,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Next slide"
		})]
	});
});
CarouselNext.displayName = "CarouselNext";
var building_default = "/assets/building-DMfrZRwS.jpg";
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicesPreview, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorsPreview, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObnTvSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialsSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, {})
	] });
}
function Hero() {
	const { lang } = useLanguage();
	const tr = translations.hero;
	const stats = translatedStats[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative flex min-h-[92vh] items-center overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: building_default,
				alt: "Dr. Amanuel Hospital modern building exterior",
				width: 1920,
				height: 1080,
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20 dark:from-background/90 dark:via-background/70 dark:to-background/30" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-0 hidden lg:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-[14%] top-[22%] grid h-14 w-14 place-items-center rounded-2xl glass text-primary-glow animate-float",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-[26%] top-[52%] grid h-12 w-12 place-items-center rounded-2xl glass text-primary-glow animate-float-slow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-[10%] top-[66%] grid h-12 w-12 place-items-center rounded-2xl glass text-primary-glow animate-float",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-[38%] top-[30%] grid h-11 w-11 place-items-center rounded-2xl glass text-primary-glow animate-float-slow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ambulance, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto w-full max-w-7xl px-4 py-32 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-6 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl animate-fade-up",
							children: [t(tr.title1, lang), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block bg-gradient-to-r from-primary-glow to-primary-foreground bg-clip-text text-transparent",
								children: t(tr.title2, lang)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-xl text-base text-primary-foreground/85 md:text-lg",
							children: t(tr.subtitle, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "rounded-xl px-8 shadow-lg transition-transform active:scale-95",
								children: t(translations.nav.bookAppt, lang)
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								className: "rounded-xl border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/services",
									children: [
										t(tr.exploreServices, lang),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
											className: "ml-1 h-4 w-4",
											"aria-hidden": "true"
										})
									]
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-16 grid grid-cols-2 gap-6 rounded-2xl glass p-6 md:grid-cols-4 md:p-8",
					children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCounter, {
						value: s.value,
						suffix: s.suffix,
						label: s.label
					}, s.label))
				})]
			})
		]
	});
}
function ServicesPreview() {
	const { lang } = useLanguage();
	const tr = translations.sections;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: t(tr.ourServices, lang),
				title: t(tr.comprehensiveCare, lang),
				subtitle: t(tr.comprehensiveSub, lang)
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
				children: services.map((service, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 60,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group h-full rounded-2xl border border-border bg-card p-6 hover-lift",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(service.icon, {
									className: "h-6 w-6",
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-lg font-semibold",
								children: service.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: service.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/services",
								className: "mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2",
								children: [
									t(tr.learnMore, lang),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
										className: "h-3.5 w-3.5",
										"aria-hidden": "true"
									})
								]
							})
						]
					})
				}, service.id))
			})]
		})
	});
}
function DoctorsPreview() {
	const { lang } = useLanguage();
	const tr = translations.sections;
	const docTr = translations.doctors;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "gradient-soft py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: t(tr.ourTeam, lang),
					title: t(tr.meetDoctors, lang),
					subtitle: t(tr.meetDoctorsSub, lang)
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
					children: doctors.slice(0, 3).map((doc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 80,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group overflow-hidden rounded-2xl border border-border bg-card hover-lift",
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "truncate font-display text-lg font-semibold",
												children: doc.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-sm text-muted-foreground",
												children: doc.specialty
											})]
										}), doc.availableToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "shrink-0 rounded-full bg-success/15 text-success hover:bg-success/15",
											children: t(tr.availableToday, lang)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: doc.experience
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "mt-4 w-full rounded-xl",
										children: t(docTr.bookAppt, lang)
									}) })
								]
							})]
						})
					}, doc.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						className: "rounded-xl text-primary hover:text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/doctors",
							children: [
								t(tr.viewAllDoctors, lang),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "ml-1 h-4 w-4",
									"aria-hidden": "true"
								})
							]
						})
					})
				})
			]
		})
	});
}
function ObnTvSection() {
	const { lang } = useLanguage();
	const tr = translations.sections;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "gradient-soft py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: t(tr.obnEyebrow, lang),
				title: t(tr.obnTitle, lang),
				subtitle: t(tr.obnSub, lang)
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-3xl border border-border bg-card card-shadow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
						controls: true,
						preload: "metadata",
						className: "w-full rounded-3xl",
						"aria-label": "Dr. Amanuel Hospital as featured on OBN Television",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
							src: "/amanvid.mp4",
							type: "video/mp4"
						}), t(translations.common.videoNoSupport, lang)]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-center text-sm text-muted-foreground",
					children: [
						t(tr.obnCaption, lang),
						" —",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: "OBN Television"
						})
					]
				})]
			})]
		})
	});
}
function TestimonialsSection() {
	const { lang } = useLanguage();
	const tr = translations.sections;
	const testimonials = translatedTestimonials[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: t(tr.testimonials, lang),
				title: t(tr.whatPatientsSay, lang),
				subtitle: t(tr.patientsSub, lang)
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Carousel, {
					opts: { loop: true },
					className: "mx-auto max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContent, { children: testimonials.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
							className: "mx-2 rounded-2xl border border-border bg-card p-8 text-center card-shadow md:p-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center gap-1",
									"aria-label": "5 out of 5 stars",
									children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
										className: "h-5 w-5 fill-primary text-primary",
										"aria-hidden": "true"
									}, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
									className: "mt-5 text-base text-foreground md:text-lg",
									children: [
										"\"",
										item.quote,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
									className: "mt-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display font-semibold",
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: item.role
									})]
								})
							]
						}) }, item.name)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselPrevious, { className: "hidden md:flex" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselNext, { className: "hidden md:flex" })
					]
				})
			})]
		})
	});
}
function FaqSection() {
	const { lang } = useLanguage();
	const tr = translations.sections;
	const [query, setQuery] = (0, import_react.useState)("");
	const filtered = translatedFaqs[lang].filter((f) => f.question.toLowerCase().includes(query.toLowerCase()) || f.answer.toLowerCase().includes(query.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "gradient-soft py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: t(tr.faqEyebrow, lang),
				title: t(tr.faqTitle, lang),
				subtitle: t(tr.faqSub, lang)
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "faq-search",
								className: "sr-only",
								children: t(tr.faqSearch, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "faq-search",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: t(tr.faqSearch, lang),
								className: "rounded-xl pl-10"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
						type: "single",
						collapsible: true,
						className: "mt-6",
						children: filtered.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
							value: `faq-${i}`,
							className: "border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
								className: "text-left font-display text-sm font-semibold md:text-base",
								children: f.question
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
								className: "text-sm text-muted-foreground md:text-base",
								children: f.answer
							})]
						}, i))
					}),
					filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							t(tr.faqNoResults, lang),
							" \"",
							query,
							"\". ",
							t(tr.faqTry, lang)
						]
					})
				]
			})]
		})
	});
}
function CtaBand() {
	const { lang } = useLanguage();
	const tr = translations.sections;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl px-4 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gradient-hero relative overflow-hidden rounded-3xl px-6 py-14 text-center md:px-12 md:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-hidden": "true",
						className: "absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10 blur-2xl"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-bold text-primary-foreground md:text-4xl",
						children: t(tr.ctaTitle, lang)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-xl text-primary-foreground/85 md:text-lg",
						children: t(tr.ctaSub, lang)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "secondary",
							className: "rounded-xl px-8 transition-transform active:scale-95",
							children: t(translations.nav.bookAppt, lang)
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "rounded-xl border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								children: t(tr.contactUs, lang)
							})
						})]
					})
				]
			}) })
		})
	});
}
//#endregion
export { HomePage as component };
