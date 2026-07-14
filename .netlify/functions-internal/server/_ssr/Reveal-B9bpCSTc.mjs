import { r as __toESM } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-CbfQs2QY.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-DOyO7aZz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Slot, x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as ChevronRight, C as Facebook, D as Circle, F as Bone, H as Activity, I as Baby, M as Check, N as CalendarCheck, O as CircleCheck, P as Brain, R as ArrowUp, S as FlaskConical, T as Cookie, _ as Mail, c as Send, d as Pill, f as Phone, g as MapPin, h as Menu, i as Stethoscope, j as ChevronDown, k as ChevronUp, m as MessageCircle, o as Slice, p as Moon, r as Sun, s as Siren, t as X, u as ScanLine, v as LoaderCircle, w as Eye, x as Globe, y as HeartPulse } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-B9bpCSTc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Sheet = Dialog$1;
var SheetTrigger = DialogTrigger$1;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var doctors_default = "/assets/doctors-BHTRcwh2.jpg";
var doctors1_default = "/assets/doctors1-CW0afNPI.jpg";
var machine_default = "/assets/machine-GBzDYHh2.jpg";
var room_default = "/assets/room-DFjpchWl.jpg";
var baby_default = "/assets/baby-ops8Asde.jpg";
var aman_pharmacy_default = "/assets/aman%20pharmacy-DRWncj9w.jpg";
var bero_default = "/assets/bero-VROJUisw.jpg";
var services = [
	{
		id: "general-consultation",
		title: "General Consultation",
		description: "Comprehensive outpatient consultations with experienced general practitioners.",
		detail: "Our outpatient department offers same-day consultations, preventive check-ups, chronic disease follow-up and referrals to specialists — all in a comfortable, modern setting.",
		icon: Stethoscope
	},
	{
		id: "emergency-care",
		title: "Emergency Care",
		description: "24/7 emergency services with rapid triage and a dedicated resuscitation team.",
		detail: "Our emergency unit operates around the clock with trained emergency physicians, ambulance coordination and fully equipped resuscitation rooms.",
		icon: Siren
	},
	{
		id: "surgery",
		title: "Surgery",
		description: "Modern operating theaters for general, orthopedic and gynecologic surgery.",
		detail: "From minor procedures to major operations, our surgical team follows international safety protocols in fully equipped, sterile operating theaters.",
		icon: Slice
	},
	{
		id: "radiology",
		title: "Radiology",
		description: "Digital X-ray, ultrasound and CT imaging with expert interpretation.",
		detail: "Advanced imaging technology and experienced radiologists deliver accurate, timely diagnostic reports to guide your treatment.",
		icon: ScanLine
	},
	{
		id: "laboratory",
		title: "Laboratory",
		description: "Accurate diagnostic testing with modern automated laboratory equipment.",
		detail: "Hematology, chemistry, microbiology and serology testing with strict quality control and fast turnaround times.",
		icon: FlaskConical
	},
	{
		id: "pediatrics",
		title: "Pediatrics",
		description: "Compassionate care for infants, children and adolescents.",
		detail: "Child-friendly consultation rooms, immunization services, growth monitoring and inpatient pediatric care delivered with warmth.",
		icon: Baby
	},
	{
		id: "maternity",
		title: "Maternity",
		description: "Safe deliveries, antenatal care and postnatal support for mothers.",
		detail: "Comprehensive maternal care including antenatal follow-up, safe delivery services, caesarean sections and newborn care.",
		icon: HeartPulse
	},
	{
		id: "pharmacy",
		title: "Pharmacy",
		description: "Well-stocked pharmacy with quality medicines and expert guidance.",
		detail: "Our in-house pharmacy provides prescribed medications, counseling on proper use, and is open extended hours for your convenience.",
		icon: Pill
	}
];
var doctors = [
	{
		name: "Doctor Picture 1",
		specialty: "General Surgeon · Medical Director",
		experience: "18+ years experience",
		availableToday: true,
		photo: doctors_default
	},
	{
		name: "Doctor Picture 2",
		specialty: "Pediatrician",
		experience: "10+ years experience",
		availableToday: true,
		photo: doctors1_default
	},
	{
		name: "Doctor Picture 3",
		specialty: "Internal Medicine Specialist",
		experience: "22+ years experience",
		availableToday: false,
		photo: doctors_default
	},
	{
		name: "Doctor Picture 4",
		specialty: "Obstetrician & Gynecologist",
		experience: "14+ years experience",
		availableToday: true,
		photo: doctors1_default
	},
	{
		name: "Doctor Picture 5",
		specialty: "Radiologist",
		experience: "9+ years experience",
		availableToday: false,
		photo: doctors_default
	},
	{
		name: "Doctor Picture 6",
		specialty: "Emergency Medicine Physician",
		experience: "8+ years experience",
		availableToday: true,
		photo: doctors1_default
	}
];
var departments = [
	{
		name: "Internal Medicine",
		description: "Diagnosis and treatment of adult diseases, chronic condition management.",
		icon: Activity
	},
	{
		name: "Surgery",
		description: "General and specialized surgical procedures in modern theaters.",
		icon: Slice
	},
	{
		name: "Pediatrics",
		description: "Dedicated child healthcare from newborns to adolescents.",
		icon: Baby
	},
	{
		name: "Obstetrics & Gynecology",
		description: "Women's health, antenatal care and safe delivery services.",
		icon: HeartPulse
	},
	{
		name: "Emergency Medicine",
		description: "24/7 rapid response emergency and trauma care.",
		icon: Siren
	},
	{
		name: "Radiology & Imaging",
		description: "X-ray, ultrasound and CT diagnostics with expert reading.",
		icon: ScanLine
	},
	{
		name: "Neurology",
		description: "Care for disorders of the brain, spine and nervous system.",
		icon: Brain
	},
	{
		name: "Orthopedics",
		description: "Bone, joint and musculoskeletal treatment and rehabilitation.",
		icon: Bone
	},
	{
		name: "Ophthalmology",
		description: "Eye examinations, treatment and minor eye surgery.",
		icon: Eye
	}
];
var galleryImages = [
	{
		src: machine_default,
		alt: "Hospital laboratory with modern microscopes",
		width: 900,
		height: 1200
	},
	{
		src: room_default,
		alt: "Modern operating theater with surgical lights",
		width: 1200,
		height: 800
	},
	{
		src: baby_default,
		alt: "Nurse caring for a child in the pediatric ward",
		width: 1200,
		height: 900
	},
	{
		src: machine_default,
		alt: "CT scanner in the radiology department",
		width: 900,
		height: 1100
	},
	{
		src: aman_pharmacy_default,
		alt: "Hospital pharmacy with organized medicine shelves",
		width: 1200,
		height: 800
	},
	{
		src: room_default,
		alt: "Bright modern patient room",
		width: 900,
		height: 1200
	},
	{
		src: bero_default,
		alt: "Hospital reception lobby",
		width: 1200,
		height: 900
	}
];
var contactInfo = {
	phone: "+251 11 000 0000",
	emergency: "+251 90 000 0000",
	email: "dramanuelhospital@gmail.com",
	location: "Bishoftu (Debre Zeyit), Oromia, Ethiopia",
	hours: "Mon–Sat: 8:00 AM – 8:00 PM · Emergency: 24/7"
};
var LanguageContext = (0, import_react.createContext)({
	lang: "en",
	setLang: () => {}
});
function LanguageProvider({ children }) {
	const [lang, setLang] = (0, import_react.useState)(() => {
		try {
			const stored = localStorage.getItem("lang");
			if (stored === "en" || stored === "am" || stored === "or") return stored;
		} catch {}
		return "en";
	});
	const handleSetLang = (l) => {
		setLang(l);
		try {
			localStorage.setItem("lang", l);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageContext.Provider, {
		value: {
			lang,
			setLang: handleSetLang
		},
		children
	});
}
function useLanguage() {
	return (0, import_react.useContext)(LanguageContext);
}
var translations = {
	nav: {
		home: {
			en: "Home",
			am: "መነሻ",
			or: "Mana"
		},
		about: {
			en: "About",
			am: "ስለ እኛ",
			or: "Waa'ee Keenya"
		},
		services: {
			en: "Services",
			am: "አገልግሎቶች",
			or: "Tajaajilaa"
		},
		doctors: {
			en: "Doctors",
			am: "ዶክተሮች",
			or: "Doktarota"
		},
		departments: {
			en: "Departments",
			am: "ክፍሎች",
			or: "Kutaalee"
		},
		gallery: {
			en: "Gallery",
			am: "ምስሎች",
			or: "Galeriin"
		},
		contact: {
			en: "Contact",
			am: "አድራሻ",
			or: "Qunnamtii"
		},
		aiAssistant: {
			en: "AI Assistant",
			am: "AI ረዳት",
			or: "AI Gargaaraa"
		},
		bookAppt: {
			en: "Book Appointment",
			am: "ቀጠሮ ያዙ",
			or: "Beellama Qabadhu"
		},
		menu: {
			en: "Menu",
			am: "ምናሌ",
			or: "Sarara"
		}
	},
	hero: {
		badge: {
			en: "Portfolio demo — not the official hospital website",
			am: "የፖርትፎሊዮ ሙከራ — ይህ ኦፊሴላዊ የሆስፒታሉ ድረ-ገጽ አይደለም",
			or: "Mul'ata portfolio — marsariitii mana yaalaa miti"
		},
		title1: {
			en: "Quality Healthcare",
			am: "ጥራት ያለው ጤና አገልግሎት",
			or: "Tajaajila Fayyaa Qulqulluu"
		},
		title2: {
			en: "You Can Trust",
			am: "የሚታመን",
			or: "Amanamuudha"
		},
		subtitle: {
			en: "Providing compassionate healthcare with experienced professionals, modern medical technology, and patient-centered services.",
			am: "ልምድ ያላቸው ባለሙያዎች፣ ዘመናዊ የሕክምና ቴክኖሎጂ እና ታካሚን ያማከለ አገልግሎት ያቀርባሉ።",
			or: "Ogeessota muuxannoo qaban, teknolojii fayyaa ammayyaa fi tajaajila dhukkubsataa xiyyeeffate dhiyeessuu."
		},
		exploreServices: {
			en: "Explore Services",
			am: "አገልግሎቶችን ይመልከቱ",
			or: "Tajaajilaalee Ilaali"
		}
	},
	stats: {
		emergency: {
			en: "Emergency Service",
			am: "የአደጋ ጊዜ አገልግሎት",
			or: "Tajaajila Ariifachiisaa"
		},
		doctors: {
			en: "Experienced Doctors",
			am: "ልምድ ያላቸው ዶክተሮች",
			or: "Doktarota Muuxannoo Qaban"
		},
		equipment: {
			en: "Modern Equipment",
			am: "ዘመናዊ መሣሪያዎች",
			or: "Meeshaalee Ammayyaa"
		},
		patients: {
			en: "Patients Served",
			am: "የታከሙ ታካሚዎች",
			or: "Dhukkubsattootni Tajaajilaman"
		}
	},
	sections: {
		ourServices: {
			en: "Our Services",
			am: "አገልግሎቶቻችን",
			or: "Tajaajilaalee Keenya"
		},
		comprehensiveCare: {
			en: "Comprehensive Care Under One Roof",
			am: "ሁሉን አቀፍ ጤና አገልግሎት በአንድ ቦታ",
			or: "Kunuunsa Guutuu Bakka Tokkotti"
		},
		comprehensiveSub: {
			en: "From emergency care to specialized treatment, our departments work together for your health.",
			am: "ከአደጋ ጊዜ ህክምና እስከ ልዩ ልዩ ሕክምና፣ ክፍሎቻችን ለጤናዎ አብረው ይሰራሉ።",
			or: "Kunuunsa ariifachiisaa hanga yaalii addaatti, kutaaleen keenya fayyaa keessaniif waliin hojjetu."
		},
		learnMore: {
			en: "Learn more",
			am: "የበለጠ ይወቁ",
			or: "Dabalata Baradhu"
		},
		showLess: {
			en: "Show less",
			am: "ባነሰ ያሳዩ",
			or: "Xiqqeessi"
		},
		ourTeam: {
			en: "Our Team",
			am: "ቡድናችን",
			or: "Gaachana Keenya"
		},
		meetDoctors: {
			en: "Meet Our Experienced Doctors",
			am: "ልምድ ያላቸውን ዶክተሮቻችንን ይተዋወቁ",
			or: "Doktaroota Muuxannoo Qaban Keenya Beekaa"
		},
		meetDoctorsSub: {
			en: "Dedicated specialists committed to your health and wellbeing.",
			am: "ለጤናዎ እና ለጤንነቶ ቀናኢ ልዩ ልዩ ባለሙያዎች።",
			or: "Ogeessotni fayyaa fi fayya-qabeessummaa keessaniif of-kenne."
		},
		viewAllDoctors: {
			en: "View all doctors",
			am: "ሁሉም ዶክተሮችን ይመልከቱ",
			or: "Doktaroota Hunda Ilaali"
		},
		availableToday: {
			en: "Available Today",
			am: "ዛሬ ይገኛሉ",
			or: "Har'a Argama"
		},
		obnEyebrow: {
			en: "As Seen on OBN Television",
			am: "በ OBN ቴሌቪዥን ላይ የታየ",
			or: "OBN Televishinii Irratti Mul'ate"
		},
		obnTitle: {
			en: "OBN Television Coverage",
			am: "OBN ቴሌቪዥን ሽፋን",
			or: "Gabaasa OBN Televishinii"
		},
		obnSub: {
			en: "Watch our hospital as featured on OBN Television — bringing quality healthcare to the community.",
			am: "ሆስፒታላችን በ OBN ቴሌቪዥን ላይ እንደታየ ይመልከቱ — ለማህበረሰቡ ጥራት ያለው ጤና አገልግሎት ያቀርባሉ።",
			or: "Mana yaalaa keenya OBN Televishinii irratti agarsifame ilaali — tajaajila fayyaa qulqulluu hawaasaaf dhiyeessa."
		},
		obnCaption: {
			en: "Dr. Amanuel Hospital — as featured on OBN Television",
			am: "ዶ/ር አማኑኤል ሆስፒታል — በ OBN ቴሌቪዥን ላይ እንደታየ",
			or: "Hospitaala Dr. Amanuel — OBN Televishinii irratti agarsifame"
		},
		testimonials: {
			en: "Testimonials",
			am: "የታካሚ ምስክርነቶች",
			or: "Ragaalee Dhukkubsattootaa"
		},
		whatPatientsSay: {
			en: "What Our Patients Say",
			am: "ታካሚዎቻችን የሚሉት",
			or: "Dhukkubsattootni Keenya Maal Jedhu"
		},
		patientsSub: {
			en: "Real stories from the community we serve — patients who experienced our care firsthand.",
			am: "እናገለግለዋለን ከምንለው ማህበረሰብ ውስጥ እውነተኛ ታሪኮች — ህክምናችንን በቀጥታ የሄዱ ታካሚዎች።",
			or: "Seenaalee dhugaa hawaasa tajaajillu irraa — dhukkubsattootni kunuunsa keenya ofii isaaniitiin argatan."
		},
		faqEyebrow: {
			en: "FAQ",
			am: "ተደጋጋሚ ጥያቄዎች",
			or: "Gaafilee Yeroo Hedduu Gaafataman"
		},
		faqTitle: {
			en: "Frequently Asked Questions",
			am: "ተደጋጋሚ ጥያቄዎችና መልሶቻቸው",
			or: "Gaafilee Yeroo Hedduu Gaafataman"
		},
		faqSub: {
			en: "Answers to the questions we hear most often.",
			am: "በጣም ብዙ ጊዜ ለምንሰማቸው ጥያቄዎች መልሶች።",
			or: "Deebii gaafilee yeroo hedduu dhageenyu."
		},
		faqSearch: {
			en: "Search questions…",
			am: "ጥያቄዎችን ፈልጉ…",
			or: "Gaafilee Barbaadi…"
		},
		faqNoResults: {
			en: "No questions match",
			am: "ምንም ጥያቄ አልተገኘም",
			or: "Gaafiin hin argamne"
		},
		faqTry: {
			en: "Try a different search.",
			am: "ሌላ ፍለጋ ሞክሩ።",
			or: "Barbaada biraa yaalii."
		},
		ctaTitle: {
			en: "Your Health, Our Priority",
			am: "ጤናዎ፣ ቅድሚያ የምንሰጠው",
			or: "Fayyaa Keessan, Dursa Keenya"
		},
		ctaSub: {
			en: "Book an appointment today and experience compassionate, modern healthcare in Bishoftu.",
			am: "ዛሬ ቀጠሮ ይያዙ እና በቢሾፍቱ ሰብዓዊ ዘመናዊ ህክምናን ይሞክሩ።",
			or: "Har'a beellama qabadhu fi kunuunsa fayyaa ammayyaa Bishooftuu keessatti muuxi."
		},
		contactUs: {
			en: "Contact Us",
			am: "አግኙን",
			or: "Nu Qunnamaa"
		}
	},
	about: {
		breadcrumb: {
			en: "About",
			am: "ስለ እኛ",
			or: "Waa'ee Keenya"
		},
		heroTitle: {
			en: "About Dr. Amanuel Hospital",
			am: "ስለ ዶ/ር አማኑኤል ሆስፒታል",
			or: "Waa'ee Hospitaala Dr. Amanuel"
		},
		heroSub: {
			en: "A patient-centered general hospital serving Bishoftu and the surrounding communities with compassion and modern medicine.",
			am: "ቢሾፍቱን እና አካባቢዋን ማህበረሰቦች ሰብዓዊነትና ዘመናዊ ሕክምናን ባዋሃዱ የሚያገለግሉ ታካሚ ማዕከላዊ ሆስፒታል።",
			or: "Hospitaala waliigalaa Bishooftuu fi hawaasa naannoo isii compassion fi qorannoo ammayyaan tajaajilu."
		},
		whoWeAre: {
			en: "Who We Are",
			am: "እኛ ማን ነን",
			or: "Eenyu Akka Taane"
		},
		caring: {
			en: "Caring for Bishoftu Since 2010",
			am: "ቢሾፍቱን ከ2010 ጀምሮ እናክባሙ",
			or: "Bishooftuu 2010 Irraa Kaasee Kunuunsa"
		},
		introPara: {
			en: "Dr. Amanuel Hospital is a general hospital located in Bishoftu (Debre Zeyit), Ethiopia. Our team of experienced physicians, nurses and support staff work together to deliver quality healthcare that is accessible, affordable and centered on the patient.",
			am: "ዶ/ር አማኑኤል ሆስፒታል በቢሾፍቱ (ደብረ ዘይት)፣ ኢትዮጵያ የሚገኝ ጠቅላላ ሆስፒታል ነው። ልምድ ያላቸው ሐኪሞቻችን፣ ነርሶቻችን እና ረዳቶቻችን ተደራሽ፣ ተመጣጣኝ ዋጋ ያለው እና ታካሚ ማዕከላዊ ጥራት ያለው ጤና አገልግሎት ለማቅረብ አብረው ይሰራሉ።",
			or: "Hospitaalli Dr. Amanuel Bishooftuu (Debre Zeyit), Itoophiyaa keessa argama. Gaachanni keenya ogeessota qoricha, narsotaa fi hojjettootaa muuxannoo qaban ni hojjetu tajaajila fayyaa qulqulluu, kan argamuu fi kan dhukkubsataa xiyyeeffate dhiyeessuuf."
		},
		ourMission: {
			en: "Our Mission",
			am: "ተልዕኮአችን",
			or: "Kallattii Keenya"
		},
		missionText: {
			en: "To provide compassionate, high-quality and affordable healthcare to our community using modern medical technology and evidence-based practice.",
			am: "ዘመናዊ የሕክምና ቴክኖሎጂ እና ማስረጃ ላይ የተመሰረተ ልምምድ ተጠቅሞ ለማህበረሰባችን ሰብዓዊ፣ ጥራት ያለው እና ተመጣጣኝ ዋጋ ያለው ጤና አገልግሎት ማቅረብ።",
			or: "Teknolojii fayyaa ammayyaa fi hojii ragaa irratti hundaa'uun hawaasa keenya tajaajila fayyaa compassion, qulqulluu fi gatii madaalawaan dhiyeessu."
		},
		ourVision: {
			en: "Our Vision",
			am: "ራዕያችን",
			or: "Mul'ata Keenya"
		},
		visionText: {
			en: "To be the most trusted healthcare provider in central Ethiopia, recognized for clinical excellence and outstanding patient experience.",
			am: "ለሕሙማን ልቀት እና ልዩ ተሞክሮ እውቅና ያለው፣ በማዕከላዊ ኢትዮጵያ በጣም የሚታመን የጤና አገልግሎት ሰጪ መሆን።",
			or: "Olaantummaa clinikaa fi muuxannoo dhukkubsataa olaanaadhaan beekamee, dhiyeessaa tajaajila fayyaa amanamuudha caaluudha."
		},
		coreValues: {
			en: "Core Values",
			am: "መሠረታዊ እሴቶች",
			or: "Gatii Hundee"
		},
		guidesUs: {
			en: "What Guides Us Every Day",
			am: "በየቀኑ የሚመራን",
			or: "Guyyaa Guyyaan Nu Qajeelchu"
		},
		ourJourney: {
			en: "Our Journey",
			am: "ጉዞአችን",
			or: "Imala Keenya"
		},
		milestones: {
			en: "Milestones Along the Way",
			am: "በጉዞ ላይ ምልክት ነጥቦች",
			or: "Tarkaanfiiwwan Imala Keessa"
		},
		achievements: {
			en: "Achievements",
			am: "ስኬቶቻችን",
			or: "Milkaa'inoota Keenya"
		},
		whyChooseUs: {
			en: "Why Patients Choose Us",
			am: "ታካሚዎቹ ለምን እኛን ይመርጣሉ",
			or: "Maaliif Dhukkubsattootni Nu Filatu"
		},
		exploreGallery: {
			en: "Explore our gallery",
			am: "ምስሎቻችንን ይመልከቱ",
			or: "Galeriin Keenya Ilaali"
		},
		values: {
			compassionTitle: {
				en: "Compassion",
				am: "ሰብዓዊነት",
				or: "Compassion"
			},
			compassionText: {
				en: "We treat every patient with dignity, empathy and respect.",
				am: "እያንዳንዱን ታካሚ በክብር፣ ርህራሄ እና አክብሮት እናስተናግዳለን።",
				or: "Dhukkubsataa hundaa kabaja, gaddifachuu fi kabajaan ni yaalina."
			},
			excellenceTitle: {
				en: "Excellence",
				am: "ምርጥነት",
				or: "Ol'aantummaa"
			},
			excellenceText: {
				en: "We hold ourselves to the highest clinical and service standards.",
				am: "ለከፍተኛ ክሊኒካዊ እና አገልግሎት ደረጃዎች እናቆምናለን።",
				or: "Sadarkaa clinikaa fi tajaajilaa olaanaa dhaan of-qaba."
			},
			integrityTitle: {
				en: "Integrity",
				am: "ሐቀኝነት",
				or: "Amantummaa"
			},
			integrityText: {
				en: "We act honestly and transparently in everything we do.",
				am: "በምናደርገው ሁሉ በሐቀኝነት እና ግልፅነት እናደርጋለን።",
				or: "Waan hunda keessatti dhugummaan fi iftoominaan ni hojjenna."
			},
			innovationTitle: {
				en: "Innovation",
				am: "ፈጠራ",
				or: "Haaroomsa"
			},
			innovationText: {
				en: "We continually invest in modern equipment and training.",
				am: "ዘወትር በዘመናዊ መሣሪያዎችና ስልጠና ላይ ኢንቨስት እናደርጋለን።",
				or: "Meeshaalee ammayyaa fi leenjiitti ni inveestu."
			}
		}
	},
	services: {
		breadcrumb: {
			en: "Services",
			am: "አገልግሎቶች",
			or: "Tajaajilaa"
		},
		heroTitle: {
			en: "Our Medical Services",
			am: "የህክምና አገልግሎቶቻችን",
			or: "Tajaajila Fayyaa Keenya"
		},
		heroSub: {
			en: "A full range of outpatient, inpatient, diagnostic and emergency services — delivered with care and modern technology.",
			am: "ሙሉ የህክምና አገልግሎቶች — ውጪ፣ ወደ ሆስፒታል፣ ምርመራ እና አደጋ — ጥንቃቄ እና ዘመናዊ ቴክኖሎጂ ይቀርባሉ።",
			or: "Tajaajila fayyaa guutuu — alaa, keessa, qorannoo fi ariifachiisaa — kunuunsa fi teknolojii ammayyaan dhiyeessame."
		},
		bookAppt: {
			en: "Book an Appointment",
			am: "ቀጠሮ ያዙ",
			or: "Beellama Qabadhu"
		}
	},
	doctors: {
		breadcrumb: {
			en: "Doctors",
			am: "ዶክተሮች",
			or: "Doktarota"
		},
		heroTitle: {
			en: "Meet Our Doctors",
			am: "ዶክተሮቻችንን ይተዋወቁ",
			or: "Doktaroota Keenya Beekaa"
		},
		heroSub: {
			en: "Experienced, compassionate specialists dedicated to your health.",
			am: "ልምድ ያላቸው፣ ሰብዓዊ ልዩ ባለሙያዎች ለጤናዎ ቀናኢ።",
			or: "Ogeessotni muuxannoo qaban, compassion fi fayyaa keessaniif of-kennan."
		},
		bookAppt: {
			en: "Book Appointment",
			am: "ቀጠሮ ያዙ",
			or: "Beellama Qabadhu"
		},
		available: {
			en: "Available Today",
			am: "ዛሬ ይገኛሉ",
			or: "Har'a Argama"
		}
	},
	departments: {
		breadcrumb: {
			en: "Departments",
			am: "ክፍሎች",
			or: "Kutaalee"
		},
		heroTitle: {
			en: "Clinical Departments",
			am: "ክሊኒካዊ ክፍሎች",
			or: "Kutaalee Clinikaa"
		},
		heroSub: {
			en: "Specialized teams working together to provide complete, coordinated care.",
			am: "ሙሉ እና ቅንጅታዊ ጤና አገልግሎት ለማቅረብ አብረው የሚሰሩ ልዩ ቡድኖች።",
			or: "Gareen addaa kunuunsa guutuu fi walitti-hidhamaa dhiyeessuuf waliin hojjetu."
		}
	},
	gallery: {
		breadcrumb: {
			en: "Gallery",
			am: "ምስሎች",
			or: "Galeriin"
		},
		heroTitle: {
			en: "Inside Our Hospital",
			am: "ሆስፒታላችን ውስጥ",
			or: "Hospitaala Keenya Keessa"
		},
		heroSub: {
			en: "A glimpse of our facilities, technology and the care we provide every day.",
			am: "በየቀኑ የምናቀርበው የጤና አገልግሎት፣ ቴክኖሎጂ እና ተቋሙን አጠቃላይ እይታ።",
			or: "Ijaarsa keenya, teknolojii fi kunuunsa guyyaa guyyaa dhiyeessu hunda ijaan ilaaluu."
		}
	},
	contact: {
		breadcrumb: {
			en: "Contact",
			am: "አድራሻ",
			or: "Qunnamtii"
		},
		heroTitle: {
			en: "Get in Touch",
			am: "ይገናኙን",
			or: "Nu Qunnamaa"
		},
		heroSub: {
			en: "Questions, feedback or appointment requests — we'd love to hear from you.",
			am: "ጥያቄዎች፣ አስተያየቶች ወይም የቀጠሮ ጥያቄዎች — ከእርስዎ መስማት እንፈልጋለን።",
			or: "Gaafii, yaada ykn gaaffii beellamaa — isin dhagahuu barbaanna."
		},
		phone: {
			en: "Phone",
			am: "ስልክ",
			or: "Bilbila"
		},
		email: {
			en: "Email",
			am: "ኢሜይል",
			or: "Imeelii"
		},
		location: {
			en: "Location",
			am: "አካባቢ",
			or: "Bakka"
		},
		workingHours: {
			en: "Working Hours",
			am: "የሥራ ሰዓቶች",
			or: "Sa'aatii Hojii"
		},
		formName: {
			en: "Full name",
			am: "ሙሉ ስም",
			or: "Maqaa Guutuu"
		},
		formNamePh: {
			en: "Your name",
			am: "ስምዎን ያስገቡ",
			or: "Maqaa keessan"
		},
		formEmail: {
			en: "Email",
			am: "ኢሜይል",
			or: "Imeelii"
		},
		formSubject: {
			en: "Subject",
			am: "ርዕሰ ጉዳይ",
			or: "Mata-Duree"
		},
		formSubjectPh: {
			en: "How can we help?",
			am: "እንዴት ልንረዳ እንችላለን?",
			or: "Akkamitti gargaaruu dandeenyaa?"
		},
		formMessage: {
			en: "Message",
			am: "መልዕክት",
			or: "Ergaa"
		},
		formMessagePh: {
			en: "Write your message…",
			am: "መልዕክትዎን ይጻፉ…",
			or: "Ergaa keessan barreessaa…"
		},
		sendMessage: {
			en: "Send Message",
			am: "መልዕክት ላክ",
			or: "Ergaa Ergi"
		},
		messageSent: {
			en: "Message sent!",
			am: "መልዕክቱ ተልኳል!",
			or: "Ergaan Ergame!"
		},
		thankYou: {
			en: "Thank you for reaching out. Our team will respond within one business day.",
			am: "ስለተገናኙን አመሰግናለን። ቡድናችን በአንድ የሥራ ቀን ውስጥ ምላሽ ይሰጣል።",
			or: "Qunnamuuf galatoomi. Gareen keenya guyyaa hojii tokko keessatti deebii kenna."
		},
		errName: {
			en: "Please enter your name.",
			am: "ስምዎን ያስገቡ።",
			or: "Maqaa keessan galchaa."
		},
		errEmail: {
			en: "Please enter a valid email address.",
			am: "ትክክለኛ ኢሜይል አድራሻ ያስገቡ።",
			or: "Teessoo imeelii sirrii galchaa."
		},
		errMessage: {
			en: "Message should be at least 10 characters.",
			am: "መልዕክቱ ቢያንስ 10 ቁምፊዎች ሊኖሩት ይገባል።",
			or: "Ergaan xiqqaate mataduree 10 qabaachuu qaba."
		}
	},
	appt: {
		title: {
			en: "Book an Appointment",
			am: "ቀጠሮ ይያዙ",
			or: "Beellama Qabadhu"
		},
		description: {
			en: "Fill in your details and we'll confirm your appointment by phone.",
			am: "ዝርዝሮችዎን ይሙሉ እና ቀጠሮዎን በስልክ እናረጋግጣለን።",
			or: "Odeeffannoo keessan guutaa fi beellama keessan bilbilaan ni mirkaneessina."
		},
		fullName: {
			en: "Full name",
			am: "ሙሉ ስም",
			or: "Maqaa Guutuu"
		},
		fullNamePh: {
			en: "Your full name",
			am: "ሙሉ ስምዎን ያስገቡ",
			or: "Maqaa guutuu keessan"
		},
		phone: {
			en: "Phone number",
			am: "የስልክ ቁጥር",
			or: "Lakkoofsa Bilbilaa"
		},
		department: {
			en: "Department",
			am: "ክፍል",
			or: "Kutaa"
		},
		deptPh: {
			en: "Select",
			am: "ይምረጡ",
			or: "Filadhu"
		},
		preferredDate: {
			en: "Preferred date",
			am: "የሚፈልጉት ቀን",
			or: "Guyyaa Filatame"
		},
		note: {
			en: "Note (optional)",
			am: "ማስታወሻ (አማራጭ)",
			or: "Yaadannoo (dirqama miti)"
		},
		notePh: {
			en: "Briefly describe your concern",
			am: "ጉዳዩን በአጭሩ ይግለጹ",
			or: "Dhimmaa keessan gabaabsaa ibsaa"
		},
		submit: {
			en: "Request Appointment",
			am: "ቀጠሮ ይጠይቁ",
			or: "Beellama Gaafadhu"
		},
		received: {
			en: "Request received!",
			am: "ጥያቄ ተቀብሏል!",
			or: "Gaafatni Fudhatame!"
		},
		receivedDesc: {
			en: "Our reception team will confirm your appointment by phone shortly.",
			am: "የቀጠሮ ቡድናችን ቀጠሮዎን ብዙም ሳይቆይ በስልክ ያረጋግጣል።",
			or: "Gareen simichaa keenya beellama keessan yeroo gabaabaa keessatti bilbilaan ni mirkaneessa."
		},
		done: {
			en: "Done",
			am: "ተጠናቋል",
			or: "Xumurameera"
		},
		errName: {
			en: "Please enter your full name.",
			am: "ሙሉ ስምዎን ያስገቡ።",
			or: "Maqaa guutuu keessan galchaa."
		},
		errPhone: {
			en: "Please enter a valid phone number.",
			am: "ትክክለኛ የስልክ ቁጥር ያስገቡ።",
			or: "Lakkoofsa bilbilaa sirrii galchaa."
		},
		errDept: {
			en: "Please select a department.",
			am: "ክፍል ይምረጡ።",
			or: "Kutaa filadhu."
		},
		errDate: {
			en: "Please choose a preferred date.",
			am: "ቀን ይምረጡ።",
			or: "Guyyaa barbaaddu filadhu."
		}
	},
	footer: {
		tagline: {
			en: "Compassionate healthcare with experienced professionals and modern medical technology in Bishoftu, Ethiopia.",
			am: "ልምድ ያላቸው ባለሙያዎችና ዘመናዊ የሕክምና ቴክኖሎጂ ባዋሃዱ ሰብዓዊ ጤና አገልግሎት በቢሾፍቱ፣ ኢትዮጵያ።",
			or: "Kunuunsa fayyaa compassion, ogeessota muuxannoo qaban fi teknolojii fayyaa ammayyaa waliin Bishooftuu, Itoophiyaa keessatti."
		},
		quickLinks: {
			en: "Quick Links",
			am: "ፈጣን አገናኞች",
			or: "Hidhata Ariifataa"
		},
		aboutUs: {
			en: "About Us",
			am: "ስለ እኛ",
			or: "Waa'ee Keenya"
		},
		ourDoctors: {
			en: "Our Doctors",
			am: "ዶክተሮቻችን",
			or: "Doktaroota Keenya"
		},
		servicesLabel: {
			en: "Services",
			am: "አገልግሎቶች",
			or: "Tajaajilaa"
		},
		emergency: {
			en: "Emergency & Newsletter",
			am: "አደጋ & ዜና ደብዳቤ",
			or: "Ariifachiisaa & Oduu"
		},
		emergencyHotline: {
			en: "24/7 Emergency hotline",
			am: "24/7 አደጋ ስልክ",
			or: "Sarara Bilbilaa Ariifachiisaa 24/7"
		},
		emailPh: {
			en: "Your email",
			am: "ኢሜይልዎ",
			or: "Imeelii keessan"
		},
		join: {
			en: "Join",
			am: "ተቀላቀሉ",
			or: "Makamaa"
		},
		subscribed: {
			en: "Thanks for subscribing!",
			am: "ስለተቀላቀሉ አመሰግናለን!",
			or: "Galmaa'uuf galatoomi!"
		},
		copyright: {
			en: "Dr. Amanuel Hospital — Bishoftu, Ethiopia.",
			am: "ዶ/ር አማኑኤል ሆስፒታል — ቢሾፍቱ፣ ኢትዮጵያ።",
			or: "Hospitaala Dr. Amanuel — Bishooftuu, Itoophiyaa."
		}
	},
	common: {
		home: {
			en: "Home",
			am: "መነሻ",
			or: "Mana"
		},
		videoNoSupport: {
			en: "Your browser does not support the video tag.",
			am: "አሳሹ ቪዲዮ አይደግፍም።",
			or: "Browserri keessan viidiyoo hin deeggartu."
		}
	}
};
/** Picks the right string for the active language */
function t(entry, lang) {
	return entry[lang] ?? entry.en;
}
var translatedFaqs = {
	en: [
		{
			question: "What are the hospital's working hours?",
			answer: "Our outpatient departments operate Monday to Saturday from 8:00 AM to 8:00 PM. The emergency department is open 24 hours a day, 7 days a week."
		},
		{
			question: "Do I need an appointment to see a doctor?",
			answer: "Walk-ins are welcome for general consultations, but we recommend booking an appointment to reduce your waiting time, especially for specialist visits."
		},
		{
			question: "Does the hospital accept health insurance?",
			answer: "We work with several insurance providers and employer health schemes. Please contact our reception with your insurance details to confirm coverage."
		},
		{
			question: "Is there a 24/7 emergency service?",
			answer: "Yes. Our emergency department is staffed around the clock with emergency physicians, nurses and ambulance coordination."
		},
		{
			question: "Can I get laboratory tests without a referral?",
			answer: "Selected routine tests are available on request. For specialized tests we recommend a consultation first so results can be properly interpreted."
		},
		{
			question: "How do I get my medical records or test results?",
			answer: "Test results can be collected at the laboratory reception or sent to your doctor directly. Medical record requests are handled by our administration office."
		}
	],
	am: [
		{
			question: "የሆስፒታሉ የሥራ ሰዓቶች ምን ዓይነት ናቸው?",
			answer: "የሕክምና ክፍሎቻችን ከሰኞ እስከ ቅዳሜ ከ8:00 ጠዋት እስከ 8:00 ማታ ይሰራሉ። የአደጋ ክፍሉ በቀን 24 ሰዓት፣ በሳምንት 7 ቀን ክፍት ነው።"
		},
		{
			question: "ዶክተር ለማየት ቀጠሮ ያስፈልጋል?",
			answer: "ለጠቅላላ ምርመራ ያለቀጠሮ ሊመጡ ይችላሉ፣ ነገር ግን ቀጠሮ ቢያዙ የጥበቃ ጊዜዎን ይቀንሳሉ፤ በተለይ ልዩ ሐኪሞችን ለማየት።"
		},
		{
			question: "ሆስፒታሉ የጤና ኢንሹራንስ ይቀበላል?",
			answer: "ከተለያዩ የኢንሹራንስ አቅራቢዎችና የሰራተኛ ጤና ዕቅዶች ጋር እንሰራለን። ሽፋንዎን ለማረጋገጥ ካርዱን ይዘው ወደ ሪሴፕሽን ያቅርቡ።"
		},
		{
			question: "24/7 የአደጋ አገልግሎት አለ?",
			answer: "አዎ። የአደጋ ክፍሉ ሁልጊዜ የሕክምና ባለሙያዎች፣ ነርሶችና አምቡላንስ አስተባባሪዎች አሉ።"
		},
		{
			question: "ያለ ሐኪም ሪፈራ ቤተ ሙከራ ምርመራ ማደርግ ይቻላል?",
			answer: "የተወሰኑ ተራ ምርመራዎች ያለ ሪፈራ ይደረጋሉ። ለልዩ ምርመራዎች ቅድሚያ ምክክር ይደረጋል።"
		},
		{
			question: "የሕክምና ሪከርዴዬን ወይም ውጤቶቼን እንዴት አገኛለሁ?",
			answer: "ምርመራ ውጤቶች ከቤተ ሙከራ ሪሴፕሽን ሊወሰዱ ወይም ቀጥታ ለሐኪምዎ ሊላኩ ይችላሉ። የሕክምና ሪከርዴ ጥያቄዎች በአስተዳደር ቢሮ ይስተናገዳሉ።"
		}
	],
	or: [
		{
			question: "Sa'aatiin hojii hospitaalaa maal fa'i?",
			answer: "Kutaaleen keenya Wiixata hanga Sanbata sa'aatii 8:00 ganama hanga 8:00 halkan ni hojjetu. Kutaan ariifachiisaa guyyaa 24, torbee 7 cufaa hin jiru."
		},
		{
			question: "Dookitara argachuuf beellama qabaachu qaba?",
			answer: "Miseensota beellama malee gara mana yaalaa dhufuun ni danda'ama, garuu beellama qabaachuun yeroo eeggannaa ni hir'isa, addatti ogeessota argachuuf."
		},
		{
			question: "Hospitaalichi inshuraansii fayyaa fudhata?",
			answer: "Dhiyeessitota inshuraansii fi karoora fayyaa hojjettootaa hedduun ni hojjenna. Karoodha keessan fuudhaa gara simichaa dhufaa mirkaneessaa."
		},
		{
			question: "Tajaajilli ariifachiisaa 24/7 jiraa?",
			answer: "Eeyyee. Kutaan ariifachiisaa ogeessota qoricha, narsota fi koordineetara ambulaansii waliin yeroo hunda cufaa hin jiru."
		},
		{
			question: "Maree xiinxala malee qorannoo laboratooriif dhufuu ni danda'amaa?",
			answer: "Qorannoo herreega baay'ee gaafannaan ni argama. Qorannoo addaaf duursanii mari'achuun ni gorfama."
		},
		{
			question: "Galmee fayyaa koo ykn bu'aa qorannoo akkamiin argadha?",
			answer: "Bu'aan qorannoo simichaa laboratoorii irraa fudhatamuu ykn gara doktara keessanitti ergamuu danda'a. Gaaffii galmee dhukkumsaa waajjira bulchiinsaan ni furamti."
		}
	]
};
var translatedTestimonials = {
	en: [
		{
			name: "Tigist A.",
			role: "Maternity patient",
			quote: "The maternity team made my delivery safe and comfortable. The midwives were with me every step of the way — I felt truly cared for."
		},
		{
			name: "Getachew M.",
			role: "Surgery patient",
			quote: "From admission to discharge, everything was professional and clean. My operation went smoothly and the follow-up care was excellent."
		},
		{
			name: "Hiwot K.",
			role: "Parent of pediatric patient",
			quote: "My daughter was treated so gently in the pediatric ward. The doctors explained everything clearly and she recovered quickly."
		},
		{
			name: "Bekele T.",
			role: "Emergency patient",
			quote: "I arrived at midnight with severe pain and was seen within minutes. The 24/7 emergency service truly saved my life."
		}
	],
	am: [
		{
			name: "ትጊስት አ.",
			role: "የወሊድ ታካሚ",
			quote: "የወሊድ ቡድኑ ምጤን ደህና እና ምቹ አድርጓል። አዋላጆቹ ከጀምሮ እስከ መጨረሻ ድረስ ከጎኔ ነበሩ — እውነቱን ሲጠነቀቁ ተሰምቶኛል።"
		},
		{
			name: "ጌታቸው ም.",
			role: "የቀዶ ጥገና ታካሚ",
			quote: "ከመግቢያ እስከ መውጫ ሁሉ ሙያዊና ንጹህ ነበር። ቀዶ ጥገናዬ ያለ ችግር ሄደ፣ ድኅረ ህክምና እንክብካቤም እጅጉን ጥሩ ነበር።"
		},
		{
			name: "ህዋት ክ.",
			role: "የህፃናት ታካሚ ወላጅ",
			quote: "ሴት ልጄ በህፃናት ክፍሉ በጣም ጥንቃቄ ታከሟት። ዶክተሮቹ ሁሉን ነገር ግልጽ አድርገው አስረዱ፤ እርሷም ፈጥና ዳነች።"
		},
		{
			name: "በቀለ ተ.",
			role: "የአደጋ ጊዜ ታካሚ",
			quote: "እኩለ ሌሊት ከፍተኛ ህመም ይዞኝ ሄድኩ፤ ባጭር ደቂቃዎች ውስጥ ታየኝ። 24/7 አደጋ አገልግሎቱ ህይወቴን አዳናል።"
		}
	],
	or: [
		{
			name: "Tigist A.",
			role: "Dhukkubsattuu da'umsaa",
			quote: "Gareen da'umsaa da'uumsa koo nagaa fi miiraan guute. Hoosistuun hamma dhumatti biraa turte — dhugumaan kunuunfamuu nan dhaga'e."
		},
		{
			name: "Getachew M.",
			role: "Dhukkubsataa qoricha",
			quote: "Seenuu hanga bahuutti hundi ogummaa fi qulqulluu ture. Qoricha kootti ni milkaa'e, kunuunsi booda kennames baay'ee gaari ture."
		},
		{
			name: "Hiwot K.",
			role: "Maatii dhukkubsataa daa'imaa",
			quote: "Intala koo kutaa daa'immanii keessatti baayyee jajjabinaan yaalani. Doktarootni hunda ifatti ibsan, ishiinis dafee fayyite."
		},
		{
			name: "Bekele T.",
			role: "Dhukkubsataa ariifachiisaa",
			quote: "Halkan walakkaa dhukkuba hamaadhaan dhufe, daqiiqoota muraasa keessatti argame. Tajaajilli ariifachiisaa 24/7 lubbu koo baraare."
		}
	]
};
var translatedStats = {
	en: [
		{
			label: "Emergency Service",
			value: 24,
			suffix: "/7"
		},
		{
			label: "Experienced Doctors",
			value: 35,
			suffix: "+"
		},
		{
			label: "Modern Equipment Units",
			value: 120,
			suffix: "+"
		},
		{
			label: "Patients Served",
			value: 85e3,
			suffix: "+"
		}
	],
	am: [
		{
			label: "የአደጋ አገልግሎት",
			value: 24,
			suffix: "/7"
		},
		{
			label: "ልምድ ያላቸው ዶክተሮች",
			value: 35,
			suffix: "+"
		},
		{
			label: "ዘመናዊ መሣሪያዎች",
			value: 120,
			suffix: "+"
		},
		{
			label: "የታከሙ ታካሚዎች",
			value: 85e3,
			suffix: "+"
		}
	],
	or: [
		{
			label: "Tajaajila Ariifachiisaa",
			value: 24,
			suffix: "/7"
		},
		{
			label: "Doktarota Muuxannoo",
			value: 35,
			suffix: "+"
		},
		{
			label: "Meeshaalee Ammayyaa",
			value: 120,
			suffix: "+"
		},
		{
			label: "Dhukkubsattootni Yaalaman",
			value: 85e3,
			suffix: "+"
		}
	]
};
var translatedDepartments = {
	en: [
		{
			name: "Internal Medicine",
			description: "Diagnosis and treatment of adult diseases, chronic condition management."
		},
		{
			name: "Surgery",
			description: "General and specialized surgical procedures in modern theaters."
		},
		{
			name: "Pediatrics",
			description: "Dedicated child healthcare from newborns to adolescents."
		},
		{
			name: "Obstetrics & Gynecology",
			description: "Women's health, antenatal care and safe delivery services."
		},
		{
			name: "Emergency Medicine",
			description: "24/7 rapid response emergency and trauma care."
		},
		{
			name: "Radiology & Imaging",
			description: "X-ray, ultrasound and CT diagnostics with expert reading."
		},
		{
			name: "Neurology",
			description: "Care for disorders of the brain, spine and nervous system."
		},
		{
			name: "Orthopedics",
			description: "Bone, joint and musculoskeletal treatment and rehabilitation."
		},
		{
			name: "Ophthalmology",
			description: "Eye examinations, treatment and minor eye surgery."
		}
	],
	am: [
		{
			name: "የውስጥ ሕክምና",
			description: "የጎልማሳ ሕመሞችን ምርመራ እና ህክምና፣ የሥር ሰደድ ሕመሞችን አስተዳደር።"
		},
		{
			name: "ቀዶ ጥገና",
			description: "ዘመናዊ ቀዶ ጥገና ቤቶች ውስጥ አጠቃላይ እና ልዩ ቀዶ ጥገና አገልግሎቶች።"
		},
		{
			name: "ሕፃናት ሕክምና",
			description: "ከጨቅላ ሕፃናት እስከ ጉርምስና ዕድሜ ለሚደርሱ ሕፃናት ልዩ ጤና አገልግሎት።"
		},
		{
			name: "የሴቶች ጤና",
			description: "የሴቶች ጤና አገልግሎቶች፣ ቅድመ ወሊድ እንክብካቤ እና ደህና ወሊድ።"
		},
		{
			name: "አደጋ ጊዜ ሕክምና",
			description: "24/7 ፈጣን ምላሽ አደጋ ጊዜ እና የቁስለት ሕክምና።"
		},
		{
			name: "ራዲዮሎጂ እና ምስፍፍ",
			description: "ኤክስሬይ፣ ኡልትራሳውንድ እና CT ምርመራ ከባለሙያ ትንተና ጋር።"
		},
		{
			name: "የነርቭ ሕክምና",
			description: "የአዕምሮ፣ የጀርባ አጥንት እና የነርቭ ሥርዓት ሕመሞች ሕክምና።"
		},
		{
			name: "የአጥንት ሕክምና",
			description: "የአጥንት፣ ข้อ እና ጡንቻ አወቃቀር ሕክምና እና ማገገሚያ።"
		},
		{
			name: "የዐይን ሕክምና",
			description: "የዐይን ምርመራ፣ ሕክምና እና ጥቃቅን የዐይን ቀዶ ጥገና።"
		}
	],
	or: [
		{
			name: "Qoricha Keessaa",
			description: "Qorannoo fi yaalii dhukkuba gurguddaa, bulchiinsa dhukkuba ture."
		},
		{
			name: "Qoricha Mukkeen",
			description: "Hojii qoricha waliigalaa fi addaa manneen qoricha ammayyaa keessatti."
		},
		{
			name: "Fayyaa Daa'immanii",
			description: "Kunuunsa fayyaa daa'imaa addaa daa'ima haaraa hanga dargaggeessa."
		},
		{
			name: "Fayyaa Dubartii",
			description: "Tajaajila fayyaa dubartii, kunuunsa ulfaa fi da'uumsa nagaa."
		},
		{
			name: "Qoricha Ariifachiisaa",
			description: "Deebii ariifachiisaa 24/7 fi kunuunsa madaa."
		},
		{
			name: "Radiyoolojii fi Fakkii",
			description: "X-ray, ultrasound fi qorannoo CT xiinxala ogeessotaan."
		},
		{
			name: "Qoricha Sammuu",
			description: "Kunuunsa dhukkuba sammuu, dugda lafee fi narvii."
		},
		{
			name: "Qoricha Lafee",
			description: "Yaalii fi deebi'uu fayyaa lafee, maqaa fi harka-miilaa."
		},
		{
			name: "Qoricha Ija",
			description: "Qorannoo ija, yaalii fi qoricha xiqqoo ija."
		}
	]
};
var translatedServices = {
	en: [
		{
			id: "general-consultation",
			title: "General Consultation",
			description: "Comprehensive outpatient consultations with experienced general practitioners.",
			detail: "Our outpatient department offers same-day consultations, preventive check-ups, chronic disease follow-up and referrals to specialists — all in a comfortable, modern setting."
		},
		{
			id: "emergency-care",
			title: "Emergency Care",
			description: "24/7 emergency services with rapid triage and a dedicated resuscitation team.",
			detail: "Our emergency unit operates around the clock with trained emergency physicians, ambulance coordination and fully equipped resuscitation rooms."
		},
		{
			id: "surgery",
			title: "Surgery",
			description: "Modern operating theaters for general, orthopedic and gynecologic surgery.",
			detail: "From minor procedures to major operations, our surgical team follows international safety protocols in fully equipped, sterile operating theaters."
		},
		{
			id: "radiology",
			title: "Radiology",
			description: "Digital X-ray, ultrasound and CT imaging with expert interpretation.",
			detail: "Advanced imaging technology and experienced radiologists deliver accurate, timely diagnostic reports to guide your treatment."
		},
		{
			id: "laboratory",
			title: "Laboratory",
			description: "Accurate diagnostic testing with modern automated laboratory equipment.",
			detail: "Hematology, chemistry, microbiology and serology testing with strict quality control and fast turnaround times."
		},
		{
			id: "pediatrics",
			title: "Pediatrics",
			description: "Compassionate care for infants, children and adolescents.",
			detail: "Child-friendly consultation rooms, immunization services, growth monitoring and inpatient pediatric care delivered with warmth."
		},
		{
			id: "maternity",
			title: "Maternity",
			description: "Safe deliveries, antenatal care and postnatal support for mothers.",
			detail: "Comprehensive maternal care including antenatal follow-up, safe delivery services, caesarean sections and newborn care."
		},
		{
			id: "pharmacy",
			title: "Pharmacy",
			description: "Well-stocked pharmacy with quality medicines and expert guidance.",
			detail: "Our in-house pharmacy provides prescribed medications, counseling on proper use, and is open extended hours for your convenience."
		}
	],
	am: [
		{
			id: "general-consultation",
			title: "አጠቃላይ ምርመራ",
			description: "ልምድ ባላቸው አጠቃላይ ሐኪሞች ሙሉ የህክምና ምርመራ።",
			detail: "የሕክምና ክፍሉ የዕለቱ ምርምራ፣ ቅድመ ጥንቃቄ ምርምራ፣ የሥር ሰደድ ሕመም ክትትልና ወደ ልዩ ሐኪሞች ሪፈራ ያቀርባል።"
		},
		{
			id: "emergency-care",
			title: "አደጋ ጊዜ ህክምና",
			description: "24/7 ፈጣን ምርመራና ልዩ ድጋፍ ያለው የአደጋ ጊዜ አገልግሎት።",
			detail: "የአደጋ ጊዜ ክፍሉ ሙሉ ቀን ሙሉ ሌሊት ሰልጥነው ያሉ ሐኪሞች፣ አምቡላንስ ቅንጅት እና ሙሉ ዕቃ ያላቸው ሕክምና ክፍሎች አሉ።"
		},
		{
			id: "surgery",
			title: "ቀዶ ጥገና",
			description: "አጠቃላይ፣ የአጥንትና የሴቶች ቀዶ ጥገና ዘመናዊ ቀዶ ቤቶች።",
			detail: "ከጥቃቅን ሂደቶች እስከ ትልቅ ቀዶ ጥገናዎች ድረስ ቡድናችን ዓለም አቀፍ ደህንነት ፕሮቶኮሎችን ተከትሎ ሙሉ ዕቃ ባለቸው ንጹህ ቀዶ ቤቶች ውስጥ ይሰራሉ።"
		},
		{
			id: "radiology",
			title: "ራዲዮሎጂ",
			description: "ዲጂታል ኤክስሬይ፣ ኡልትራሳውንድ እና CT ምርመራ ከባለሙያ ትንተና ጋር።",
			detail: "የላቀ ምስፍፍ ቴክኖሎጂ እና ልምድ ያላቸው ራዲዮሎጂስቶች ትክክለኛ እና ሰዓቱን የጠበቀ ምርምር ሪፖርት ያቀርባሉ።"
		},
		{
			id: "laboratory",
			title: "ቤተ ሙከራ",
			description: "ዘመናዊ አውቶማቲክ ቤተ ሙከራ ዕቃዎች ያሉ ትክክለኛ ምርምር ምርምሮች።",
			detail: "ሂማቶሎጂ፣ ኬሚስትሪ፣ ማይክሮባዮሎጂ እና ሴሮሎጂ ምርምሮች ጥብቅ ጥራት ቁጥጥር እና ፈጣን ምላሽ ጊዜ ያሉ።"
		},
		{
			id: "pediatrics",
			title: "ሕፃናት ሕክምና",
			description: "ሕፃናት፣ ልጆችና ወጣቶች ሰብዓዊ ጤና አገልግሎት።",
			detail: "ሕፃናት ወዳጅ ምርምር ክፍሎች፣ ክትባት አገልግሎቶች፣ እድገት ክትትልና የሕፃናት ሆስፒታላዊ ጤና አገልግሎት።"
		},
		{
			id: "maternity",
			title: "ወሊድ",
			description: "ደህና ወሊድ፣ ቅድመ ወሊድ እንክብካቤና ድኅረ ወሊድ ድጋፍ።",
			detail: "ሙሉ የወሊድ ጤና አገልግሎት፡ ቅድመ ወሊድ ክትትል፣ ደህና ወሊድ፣ ሲዛርያን ቀዶ ጥገና እና ሕፃናት ጤና አገልግሎት።"
		},
		{
			id: "pharmacy",
			title: "ፋርማሲ",
			description: "ጥራት ያላቸው ዕፅዋቶች ያሉ ሙሉ ፋርማሲ ከባለሙያ ምክር ጋር።",
			detail: "ቤት ውስጥ ፋርማሲ ታዛዥ ዕፅዋቶች፣ ትክክለኛ አጠቃቀም ምክር ያቀርባል፣ ለእርስዎ ምቾት ተራዘሙ ሰዓቶች ክፍት ነው።"
		}
	],
	or: [
		{
			id: "general-consultation",
			title: "Marii Waliigalaa",
			description: "Marii waliin-ga'umsa guutuu ogeessota muuxannoo qaban waliin.",
			detail: "Kutaan keenya guyyaa sanaatii qorannoo, hordoffii dhukkuba ture fi gara ogeessaatti erguu dhiyeessa."
		},
		{
			id: "emergency-care",
			title: "Yaalii Ariifachiisaa",
			description: "Tajaajila ariifachiisaa 24/7 qorannoo ariifataa fi gareen deebii cimaana.",
			detail: "Kutaan ariifachiisaa guyyaa halkan doktarota leenjifaman, koordineeshiinii ambulaansii fi kutaa deebii meeshaa guutuu waliin hojjeta."
		},
		{
			id: "surgery",
			title: "Qoricha Mukkeen",
			description: "Manneen qoricha ammayyaa qoricha waliigalaa, lafee fi dubartii.",
			detail: "Hojii xiqqaa hanga qoricha gurguddaatti, gareen keenya protokolii nageenya idil-addunyaa hordofee manneen qoricha qulqulluu keessatti hojjeta."
		},
		{
			id: "radiology",
			title: "Radiyoolojii",
			description: "X-ray dijitaalaa, ultrasound fi CT xiinxala ogeessotaan.",
			detail: "Teknolojii fakkii olaanaa fi radiyolojistootni muuxannoo qaban gabaasa qorannoo sirrii yeroon dhiyeessu."
		},
		{
			id: "laboratory",
			title: "Laboratoori",
			description: "Qorannoo diagnostics sirrii meeshaa laboratoori awtomeetii ammayyaa waliin.",
			detail: "Qorannoo hematoolojii, keemistrii, maakiroobaayolojii fi seroolojii to'annoo qulqulluu cimaaa fi deebii ariifataaan."
		},
		{
			id: "pediatrics",
			title: "Fayyaa Daa'immanii",
			description: "Kunuunsa compassion daa'imman, ijoollee fi dargaggoota.",
			detail: "Kutaalee marii daa'imman-mijaawoo, tajaajila talaalii, hordoffii guddinaa fi kunuunsa daa'imman hospitaalaa."
		},
		{
			id: "maternity",
			title: "Da'uumsa",
			description: "Da'uumsa nagaa, kunuunsa ulfaa fi deeggarsa booda da'umsaa.",
			detail: "Kunuunsa haadummaa guutuu: hordoffii ulfaa, tajaajila da'umsaa nagaa, mukkeen siizariyaanii fi kunuunsa daa'ima haaraa."
		},
		{
			id: "pharmacy",
			title: "Farmaasiitti",
			description: "Farmaasiitti guutuu qorichoota qulqulluu fi gorsa ogeessaa waliin.",
			detail: "Farmaasiitti keessaa qorichota godhame, gorsa fayyadama sirrii dhiyeessa, sa'aatii dheeraa banaa."
		}
	]
};
var translatedDoctors = {
	en: [
		{
			specialty: "General Surgeon · Medical Director",
			experience: "18+ years experience"
		},
		{
			specialty: "Pediatrician",
			experience: "10+ years experience"
		},
		{
			specialty: "Internal Medicine Specialist",
			experience: "22+ years experience"
		},
		{
			specialty: "Obstetrician & Gynecologist",
			experience: "14+ years experience"
		},
		{
			specialty: "Radiologist",
			experience: "9+ years experience"
		},
		{
			specialty: "Emergency Medicine Physician",
			experience: "8+ years experience"
		}
	],
	am: [
		{
			specialty: "አጠቃላይ ቀዶ ሐኪም · የህክምና ዳይሬክተር",
			experience: "18+ ዓመት ልምድ"
		},
		{
			specialty: "የሕፃናት ሐኪም",
			experience: "10+ ዓመት ልምድ"
		},
		{
			specialty: "የውስጥ ሕክምና ስፔሻሊስት",
			experience: "22+ ዓመት ልምድ"
		},
		{
			specialty: "የወሊድ ሐኪምና የሴቶች ሕክምና ባለሙያ",
			experience: "14+ ዓመት ልምድ"
		},
		{
			specialty: "ራዲዮሎጂስት",
			experience: "9+ ዓመት ልምድ"
		},
		{
			specialty: "አደጋ ጊዜ ሕክምና ሐኪም",
			experience: "8+ ዓመት ልምድ"
		}
	],
	or: [
		{
			specialty: "Ogeessa Qoricha Mukkeen · Daarektara Fayyaa",
			experience: "Muuxannoo 18+ waggaa"
		},
		{
			specialty: "Ogeessa Daa'immanii",
			experience: "Muuxannoo 10+ waggaa"
		},
		{
			specialty: "Ogeessa Qoricha Keessaa",
			experience: "Muuxannoo 22+ waggaa"
		},
		{
			specialty: "Ogeessa Ulfaa fi Fayyaa Dubartii",
			experience: "Muuxannoo 14+ waggaa"
		},
		{
			specialty: "Radiyolojistii",
			experience: "Muuxannoo 9+ waggaa"
		},
		{
			specialty: "Ogeessa Qoricha Ariifachiisaa",
			experience: "Muuxannoo 8+ waggaa"
		}
	]
};
function AppointmentDialog({ children }) {
	const { lang } = useLanguage();
	const tr = translations.appt;
	const [open, setOpen] = (0, import_react.useState)(false);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		department: "",
		date: "",
		note: ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		const errs = {};
		if (form.name.trim().length < 2) errs.name = t(tr.errName, lang);
		if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) errs.phone = t(tr.errPhone, lang);
		if (!form.department) errs.department = t(tr.errDept, lang);
		if (!form.date) errs.date = t(tr.errDate, lang);
		setErrors(errs);
		if (Object.keys(errs).length === 0) {
			setSubmitted(true);
			const subject = encodeURIComponent(`Appointment Request - ${form.name}`);
			const body = encodeURIComponent(`Appointment Details:\nName: ${form.name}\nPhone: ${form.phone}\nDepartment: ${form.department}\nPreferred Date: ${form.date}\n\nNote:\n${form.note || "No notes provided"}`);
			window.location.href = `mailto:dramanuelhospital@gmail.com?subject=${subject}&body=${body}`;
		}
	};
	const reset = (o) => {
		setOpen(o);
		if (!o) {
			setSubmitted(false);
			setErrors({});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: reset,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "rounded-2xl sm:max-w-md",
			children: submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
						className: "h-14 w-14 text-success",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-xl font-semibold",
						children: t(tr.received, lang)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: t(tr.receivedDesc, lang)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6 rounded-xl",
						onClick: () => reset(false),
						children: t(tr.done, lang)
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2 font-display",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, {
					className: "h-5 w-5 text-primary",
					"aria-hidden": "true"
				}), t(tr.title, lang)]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t(tr.description, lang) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				noValidate: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "apt-name",
								children: t(tr.fullName, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "apt-name",
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								placeholder: t(tr.fullNamePh, lang),
								"aria-invalid": !!errors.name
							}),
							errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: errors.name
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "apt-phone",
								children: t(tr.phone, lang)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "apt-phone",
								type: "tel",
								value: form.phone,
								onChange: (e) => setForm({
									...form,
									phone: e.target.value
								}),
								placeholder: "+251 9X XXX XXXX",
								"aria-invalid": !!errors.phone
							}),
							errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: errors.phone
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "apt-dept",
									children: t(tr.department, lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.department,
									onValueChange: (v) => setForm({
										...form,
										department: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "apt-dept",
										"aria-invalid": !!errors.department,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: t(tr.deptPh, lang) })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s.title,
										children: s.title
									}, s.id)) })]
								}),
								errors.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-destructive",
									children: errors.department
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "apt-date",
									children: t(tr.preferredDate, lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "apt-date",
									type: "date",
									value: form.date,
									onChange: (e) => setForm({
										...form,
										date: e.target.value
									}),
									"aria-invalid": !!errors.date
								}),
								errors.date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-destructive",
									children: errors.date
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "apt-note",
							children: t(tr.note, lang)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "apt-note",
							value: form.note,
							onChange: (e) => setForm({
								...form,
								note: e.target.value
							}),
							placeholder: t(tr.notePh, lang),
							rows: 3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full rounded-xl",
						children: t(tr.submit, lang)
					})
				]
			})] })
		})]
	});
}
var logo_default = "/assets/logo-BJJ2QpY0.jpg";
var langOptions = [
	{
		code: "en",
		label: "English",
		flag: "🇬🇧"
	},
	{
		code: "am",
		label: "አማርኛ",
		flag: "🇪🇹"
	},
	{
		code: "or",
		label: "Afaan Oromoo",
		flag: "🇪🇹"
	}
];
function Navbar({ onOpenChat }) {
	const { lang, setLang } = useLanguage();
	const tr = translations;
	const navLinks = [
		{
			to: "/",
			label: t(tr.nav.home, lang)
		},
		{
			to: "/about",
			label: t(tr.nav.about, lang)
		},
		{
			to: "/services",
			label: t(tr.nav.services, lang)
		},
		{
			to: "/doctors",
			label: t(tr.nav.doctors, lang)
		},
		{
			to: "/departments",
			label: t(tr.nav.departments, lang)
		},
		{
			to: "/gallery",
			label: t(tr.nav.gallery, lang)
		},
		{
			to: "/contact",
			label: t(tr.nav.contact, lang)
		}
	];
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [dark, setDark] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDark(document.documentElement.classList.contains("dark"));
		const onScroll = () => setScrolled(window.scrollY > 16);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const toggleTheme = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		try {
			localStorage.setItem("theme", next ? "dark" : "light");
		} catch {}
	};
	const currentLangLabel = langOptions.find((l) => l.code === lang)?.label ?? "English";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "glass shadow-sm" : "bg-transparent"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-w-0 items-center gap-2",
					"aria-label": "Dr. Amanuel Hospital home",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo_default,
						alt: "Dr. Amanuel Hospital logo",
						className: "h-9 w-9 shrink-0 rounded-xl object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-display text-base font-bold leading-tight text-foreground sm:text-lg",
						children: "Dr. Amanuel Hospital"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 xl:flex",
					"aria-label": "Main navigation",
					children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						activeOptions: { exact: link.to === "/" },
						activeProps: { className: "text-primary font-semibold" },
						inactiveProps: { className: "text-foreground/75" },
						className: "rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary hover:text-secondary-foreground",
						children: link.label
					}, link.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": `Language: ${currentLangLabel}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
							align: "end",
							children: langOptions.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: () => setLang(l.code),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("flex items-center gap-2", l.code === lang && "font-semibold text-primary"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.flag }), l.label]
								})
							}, l.code))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: toggleTheme,
							"aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
							children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: onOpenChat,
							"aria-label": "Open AI assistant",
							className: "hidden items-center gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10 hover:border-primary md:inline-flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-success" })]
								}),
								t(tr.nav.aiAssistant, lang),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "hidden rounded-xl md:inline-flex",
							children: t(tr.nav.bookAppt, lang)
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "xl:hidden",
									"aria-label": "Open menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "right",
								className: "w-72",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "font-display",
									children: t(tr.nav.menu, lang)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
									className: "mt-6 flex flex-col gap-1",
									"aria-label": "Mobile navigation",
									children: [
										navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: link.to,
											onClick: () => setOpen(false),
											activeOptions: { exact: link.to === "/" },
											activeProps: { className: "bg-secondary text-primary font-semibold" },
											className: "rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary",
											children: link.label
										}, link.to)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 flex gap-1.5 px-1",
											children: langOptions.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setLang(l.code),
												className: cn("flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors", l.code === lang ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-secondary"),
												children: [
													l.flag,
													" ",
													l.code.toUpperCase()
												]
											}, l.code))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setOpen(false);
												onOpenChat();
											},
											className: "mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-primary font-medium transition-colors hover:bg-secondary text-left",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "relative flex h-2 w-2 shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-success" })]
												}),
												t(tr.nav.aiAssistant, lang),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4 ml-auto" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "mt-4 rounded-xl",
											children: t(tr.nav.bookAppt, lang)
										}) })
									]
								})]
							})]
						})
					]
				})
			]
		})
	});
}
function Footer() {
	const { lang } = useLanguage();
	const tr = translations.footer;
	const nav = translations.nav;
	const [email, setEmail] = (0, import_react.useState)("");
	const [subscribed, setSubscribed] = (0, import_react.useState)(false);
	const quickLinks = [
		{
			to: "/about",
			label: t(nav.about, lang)
		},
		{
			to: "/doctors",
			label: t(tr.ourDoctors, lang)
		},
		{
			to: "/departments",
			label: t(nav.departments, lang)
		},
		{
			to: "/gallery",
			label: t(nav.gallery, lang)
		},
		{
			to: "/contact",
			label: t(nav.contact, lang)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-14 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logo_default,
								alt: "Dr. Amanuel Hospital logo",
								className: "h-9 w-9 rounded-xl object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg font-bold",
								children: "Dr. Amanuel Hospital"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: t(tr.tagline, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
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
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://www.google.com/maps?q=Bishoftu,Ethiopia",
									target: "_blank",
									rel: "noopener noreferrer",
									"aria-label": "Find us on Google Maps",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "icon",
										className: "rounded-xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" })
									})
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-sm font-semibold uppercase tracking-wide text-foreground",
						children: t(tr.quickLinks, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: quickLinks.map(({ to, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to,
							className: "text-muted-foreground transition-colors hover:text-primary",
							children: label
						}) }, to))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-sm font-semibold uppercase tracking-wide text-foreground",
						children: t(tr.servicesLabel, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: services.slice(0, 6).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/services",
							className: "text-muted-foreground transition-colors hover:text-primary",
							children: s.title
						}) }, s.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold uppercase tracking-wide text-foreground",
							children: t(tr.emergency, lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 flex items-center gap-2 text-sm font-semibold text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}),
								" ",
								contactInfo.emergency
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: t(tr.emergencyHotline, lang)
						}),
						subscribed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground",
							children: t(tr.subscribed, lang)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-5 flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								if (/.+@.+\..+/.test(email)) setSubscribed(true);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "newsletter-email",
									className: "sr-only",
									children: "Email address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "newsletter-email",
									type: "email",
									required: true,
									placeholder: t(tr.emailPh, lang),
									value: email,
									onChange: (e) => setEmail(e.target.value),
									className: "rounded-xl"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-xl",
									children: t(tr.join, lang)
								})
							]
						})
					] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					t(tr.copyright, lang)
				] })
			})]
		})
	});
}
function ScrollProgress() {
	const [progress, setProgress] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			const total = document.documentElement.scrollHeight - window.innerHeight;
			setProgress(total > 0 ? window.scrollY / total * 100 : 0);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": "true",
		className: "fixed inset-x-0 top-0 z-[60] h-1 bg-transparent",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-gradient-to-r from-primary to-primary-glow transition-[width] duration-150",
			style: { width: `${progress}%` }
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var chatWithAi = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("515cc8d5c1202eeecf2d74757e16bcf1d38bf8b1262aeb3b844f63653c9b5503"));
function MessageContent({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "space-y-1 block",
		children: text.split("\n").map((line, li) => {
			const trimmed = line.trim();
			if (trimmed === "") return null;
			const isBullet = trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed);
			const content = renderInline(trimmed);
			return isBullet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 mt-0.5 text-primary",
					children: "›"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: content })]
			}, li) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block",
				children: content
			}, li);
		})
	});
}
function renderInline(text) {
	const tokenRegex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
	const nodes = [];
	let lastIndex = 0;
	let match;
	while ((match = tokenRegex.exec(text)) !== null) {
		if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
		if (match[1] !== void 0) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: match[1] }, match.index));
		else if (match[2] !== void 0 && match[3] !== void 0) {
			const label = match[2];
			const href = match[3];
			if (href.startsWith("/")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: href,
				className: "font-semibold text-primary underline underline-offset-2 hover:opacity-80",
				children: label
			}, match.index));
			else nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "font-semibold text-primary underline underline-offset-2 hover:opacity-80",
				children: label
			}, match.index));
		}
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
	return nodes;
}
function FloatingActions({ chatOpen, setChatOpen }) {
	const [showTop, setShowTop] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "assistant",
		content: "Hello! 👋 I'm the Dr. Amanuel Hospital AI Assistant. Ask me about our services, doctors, working hours, appointments, or careers — I'm here to help!"
	}]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const messagesEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setShowTop(window.scrollY > 500);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		if (chatOpen) scrollToBottom();
	}, [messages, chatOpen]);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	const sendMessage = async (text) => {
		if (!text.trim() || loading) return;
		const userMessageContent = text.trim();
		setInput("");
		const updatedMessages = [...messages, {
			role: "user",
			content: userMessageContent
		}];
		setMessages(updatedMessages);
		setLoading(true);
		try {
			const firstUserIndex = updatedMessages.findIndex((m) => m.role === "user");
			const response = await chatWithAi({ data: { messages: (firstUserIndex >= 0 ? updatedMessages.slice(firstUserIndex) : updatedMessages).map((msg) => ({
				role: msg.role === "user" ? "user" : "assistant",
				content: msg.content
			})) } });
			setMessages((prev) => [...prev, {
				role: "assistant",
				content: response.content
			}]);
		} catch (error) {
			console.error("Failed to get AI response:", error);
			const errMsg = error instanceof Error ? error.message : "Unknown error";
			setMessages((prev) => [...prev, {
				role: "assistant",
				content: "Sorry, I'm having trouble connecting right now. Please try again, or contact us directly at " + contactInfo.phone + ` (Error: ${errMsg})`
			}]);
		} finally {
			setLoading(false);
		}
	};
	const handleSend = async (e) => {
		e.preventDefault();
		await sendMessage(input);
	};
	const suggestions = [
		"What are your working hours?",
		"How do I book an appointment?",
		"What services do you offer?",
		"Are there job vacancies?"
	];
	const hasUserSpoken = messages.some((m) => m.role === "user");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		chatOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed bottom-24 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-scale-in flex flex-col h-[520px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between bg-primary px-4 py-3.5 text-primary-foreground shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-full bg-primary-foreground/20 text-xs font-semibold",
								children: "AH"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-primary animate-pulse" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm font-semibold",
							children: "Hospital Assistant"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] opacity-90",
							children: "AI · Online · Powered by Gemini"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
						onClick: () => setChatOpen(false),
						"aria-label": "Close chat",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-3",
					children: [
						messages.map((msg, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex flex-col max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", msg.role === "user" ? "ml-auto bg-primary text-primary-foreground rounded-tr-none" : "bg-secondary text-secondary-foreground rounded-tl-none"),
							children: msg.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageContent, { text: msg.content }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: msg.content })
						}, index)),
						!hasUserSpoken && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 pt-1",
							children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => sendMessage(s),
								className: "rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-secondary transition-colors",
								children: s
							}, s))
						}),
						loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground bg-secondary/40 rounded-2xl rounded-tl-none max-w-[85%] px-3.5 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dr. Amanuel AI is thinking…" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-2 border-t border-border/60 bg-secondary/20 flex items-center justify-between gap-2 text-[11px] text-muted-foreground shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								className: "h-3.5 w-3.5 text-primary",
								"aria-hidden": "true"
							}),
							"Emergency: ",
							contactInfo.emergency,
							" (24/7)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "link",
						className: "p-0 h-auto text-[11px] font-semibold text-primary hover:text-primary",
						onClick: () => window.open(`tel:${contactInfo.emergency}`),
						children: "Call now"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					id: "chat-form",
					className: "flex gap-2 border-t border-border p-3 shrink-0",
					onSubmit: handleSend,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "chat-input",
							className: "sr-only",
							children: "Type a message"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "chat-input",
							value: input,
							onChange: (e) => setInput(e.target.value),
							placeholder: "Ask about doctors, services, hours…",
							className: "rounded-xl flex-1 bg-background",
							disabled: loading,
							autoComplete: "off"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							className: "rounded-xl shrink-0",
							disabled: loading || !input.trim(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setChatOpen((v) => !v),
			"aria-label": chatOpen ? "Close AI assistant" : "Open AI assistant",
			className: "fixed bottom-6 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground shadow-lg transition-transform hover:scale-110 animate-pulse-soft",
			children: chatOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				className: "h-6 w-6",
				"aria-hidden": "true"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
				className: "h-6 w-6",
				"aria-hidden": "true"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => window.scrollTo({
				top: 0,
				behavior: "smooth"
			}),
			"aria-label": "Back to top",
			className: cn("fixed bottom-6 right-20 z-50 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110", showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
				className: "h-5 w-5",
				"aria-hidden": "true"
			})
		})
	] });
}
function CookieConsent() {
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			if (!localStorage.getItem("cookie-consent")) setVisible(true);
		} catch {}
	}, []);
	const accept = (value) => {
		try {
			localStorage.setItem("cookie-consent", value);
		} catch {}
		setVisible(false);
	};
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-4 left-4 z-50 max-w-sm rounded-2xl border border-border bg-card p-4 card-shadow animate-fade-up",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cookie, {
					className: "h-5 w-5",
					"aria-hidden": "true"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foreground",
					children: "We use cookies to improve your browsing experience. (Demo notice)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						className: "rounded-lg",
						onClick: () => accept("all"),
						children: "Accept"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "rounded-lg",
						onClick: () => accept("essential"),
						children: "Essential only"
					})]
				})]
			})]
		})
	});
}
function SiteLayout({ children }) {
	const [chatOpen, setChatOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollProgress, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, { onOpenChat: () => setChatOpen(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 animate-fade-in",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingActions, {
				chatOpen,
				setChatOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieConsent, {})
		]
	}) });
}
function Reveal({ children, className, delay = 0 }) {
	const ref = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setVisible(true);
				obs.disconnect();
			}
		}, { threshold: .12 });
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		style: { transitionDelay: `${delay}ms` },
		className: cn("transition-all duration-700 ease-out", visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0", className),
		children
	});
}
//#endregion
export { translatedTestimonials as C, translatedStats as S, useLanguage as T, t as _, DialogTitle as a, translatedFaqs as b, Reveal as c, cn as d, contactInfo as f, services as g, galleryImages as h, DialogContent as i, SiteLayout as l, doctors as m, Button as n, Input as o, departments as p, Dialog as r, Label as s, AppointmentDialog as t, Textarea as u, translatedDepartments as v, translations as w, translatedServices as x, translatedDoctors as y };
