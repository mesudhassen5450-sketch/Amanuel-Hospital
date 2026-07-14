import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as Facebook, E as Clock, O as CircleCheck, _ as Mail, c as Send, f as Phone, g as MapPin } from "../_libs/lucide-react.mjs";
import { T as useLanguage, _ as t, c as Reveal, f as contactInfo, l as SiteLayout, n as Button, o as Input, s as Label, u as Textarea, w as translations } from "./Reveal-B9bpCSTc.mjs";
import { t as PageHero } from "./PageHero-C3S-6tfc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-CBn81kUj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const { lang } = useLanguage();
	const tr = translations.contact;
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		subject: "",
		message: ""
	});
	const infoItems = [
		{
			icon: Phone,
			label: t(tr.phone, lang),
			value: contactInfo.phone
		},
		{
			icon: Mail,
			label: t(tr.email, lang),
			value: contactInfo.email
		},
		{
			icon: MapPin,
			label: t(tr.location, lang),
			value: contactInfo.location
		},
		{
			icon: Clock,
			label: t(tr.workingHours, lang),
			value: contactInfo.hours
		}
	];
	const handleSubmit = (e) => {
		e.preventDefault();
		const errs = {};
		if (form.name.trim().length < 2) errs.name = t(tr.errName, lang);
		if (!/.+@.+\..+/.test(form.email)) errs.email = t(tr.errEmail, lang);
		if (form.message.trim().length < 10) errs.message = t(tr.errMessage, lang);
		setErrors(errs);
		if (Object.keys(errs).length === 0) {
			setSubmitted(true);
			const subject = encodeURIComponent(form.subject || "Hospital Contact/Feedback");
			const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
			window.location.href = `mailto:dramanuelhospital@gmail.com?subject=${subject}&body=${body}`;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		breadcrumb: t(tr.breadcrumb, lang),
		title: t(tr.heroTitle, lang),
		subtitle: t(tr.heroSub, lang)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-5 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [infoItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover-lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "h-5 w-5",
								"aria-hidden": "true"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm font-semibold",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 break-words text-sm text-muted-foreground",
								children: item.value
							})]
						})]
					}, item.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://web.facebook.com/Amanuelhtufa",
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "Follow us on Facebook",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "icon",
									className: "rounded-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://t.me/amanuelbishoftu",
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "Join our Telegram channel",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "icon",
									className: "rounded-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${contactInfo.email}`,
								"aria-label": "Send us an email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "icon",
									className: "rounded-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
								})
							})
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 100,
				className: "lg:col-span-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-3xl border border-border bg-card p-6 card-shadow md:p-8",
					children: submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center py-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								className: "h-14 w-14 text-success",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-xl font-semibold",
								children: t(tr.messageSent, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-sm text-sm text-muted-foreground",
								children: t(tr.thankYou, lang)
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-5",
						noValidate: true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ct-name",
											children: t(tr.formName, lang)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ct-name",
											value: form.name,
											onChange: (e) => setForm({
												...form,
												name: e.target.value
											}),
											placeholder: t(tr.formNamePh, lang),
											"aria-invalid": !!errors.name
										}),
										errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: errors.name
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ct-email",
											children: t(tr.formEmail, lang)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ct-email",
											type: "email",
											value: form.email,
											onChange: (e) => setForm({
												...form,
												email: e.target.value
											}),
											placeholder: "you@example.com",
											"aria-invalid": !!errors.email
										}),
										errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: errors.email
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ct-subject",
									children: t(tr.formSubject, lang)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ct-subject",
									value: form.subject,
									onChange: (e) => setForm({
										...form,
										subject: e.target.value
									}),
									placeholder: t(tr.formSubjectPh, lang)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ct-message",
										children: t(tr.formMessage, lang)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "ct-message",
										rows: 5,
										value: form.message,
										onChange: (e) => setForm({
											...form,
											message: e.target.value
										}),
										placeholder: t(tr.formMessagePh, lang),
										"aria-invalid": !!errors.message
									}),
									errors.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive",
										children: errors.message
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "lg",
								className: "w-full rounded-xl",
								children: t(tr.sendMessage, lang)
							})
						]
					})
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			className: "mx-auto mt-14 max-w-7xl px-4 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-3xl border border-border card-shadow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "Map of Bishoftu, Ethiopia (Dr. Amanuel Hospital area)",
					src: "https://www.google.com/maps?q=Bishoftu,Ethiopia&output=embed",
					className: "h-96 w-full border-0",
					loading: "lazy",
					referrerPolicy: "no-referrer-when-downgrade",
					allowFullScreen: true
				})
			})
		})]
	})] });
}
//#endregion
export { ContactPage as component };
