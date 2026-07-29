/* eslint-disable */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// This file was manually updated for Phase 4 staff routes.

import { Route as rootRouteImport } from './routes/__root'
import { Route as SitemapDotxmlRouteImport } from './routes/sitemap[.]xml'
import { Route as ServicesRouteImport } from './routes/services'
import { Route as PaymentSummaryRouteImport } from './routes/payment-summary'
import { Route as PaymentSuccessRouteImport } from './routes/payment-success'
import { Route as GalleryRouteImport } from './routes/gallery'
import { Route as DoctorsRouteImport } from './routes/doctors'
import { Route as DepartmentsRouteImport } from './routes/departments'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as BookingRouteImport } from './routes/booking'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as AboutRouteImport } from './routes/about'
import { Route as IndexRouteImport } from './routes/index'
// Staff routes
import { Route as StaffLoginRouteImport } from './routes/staff/login'
import { Route as StaffDashboardRouteImport } from './routes/staff/dashboard'
import { Route as StaffPatientsIndexRouteImport } from './routes/staff/patients/index'
import { Route as StaffPatientsNewRouteImport } from './routes/staff/patients/new'
import { Route as StaffPatientsMrnRouteImport } from './routes/staff/patients/$mrn'
import { Route as StaffAppointmentsRouteImport } from './routes/staff/appointments'
import { Route as StaffPaymentsRouteImport } from './routes/staff/payments'

const SitemapDotxmlRoute = SitemapDotxmlRouteImport.update({ id: '/sitemap.xml', path: '/sitemap.xml', getParentRoute: () => rootRouteImport } as any)
const ServicesRoute = ServicesRouteImport.update({ id: '/services', path: '/services', getParentRoute: () => rootRouteImport } as any)
const PaymentSummaryRoute = PaymentSummaryRouteImport.update({ id: '/payment-summary', path: '/payment-summary', getParentRoute: () => rootRouteImport } as any)
const PaymentSuccessRoute = PaymentSuccessRouteImport.update({ id: '/payment-success', path: '/payment-success', getParentRoute: () => rootRouteImport } as any)
const GalleryRoute = GalleryRouteImport.update({ id: '/gallery', path: '/gallery', getParentRoute: () => rootRouteImport } as any)
const DoctorsRoute = DoctorsRouteImport.update({ id: '/doctors', path: '/doctors', getParentRoute: () => rootRouteImport } as any)
const DepartmentsRoute = DepartmentsRouteImport.update({ id: '/departments', path: '/departments', getParentRoute: () => rootRouteImport } as any)
const ContactRoute = ContactRouteImport.update({ id: '/contact', path: '/contact', getParentRoute: () => rootRouteImport } as any)
const BookingRoute = BookingRouteImport.update({ id: '/booking', path: '/booking', getParentRoute: () => rootRouteImport } as any)
const AdminRoute = AdminRouteImport.update({ id: '/admin', path: '/admin', getParentRoute: () => rootRouteImport } as any)
const AboutRoute = AboutRouteImport.update({ id: '/about', path: '/about', getParentRoute: () => rootRouteImport } as any)
const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
// Staff
const StaffLoginRoute = StaffLoginRouteImport.update({ id: '/staff/login', path: '/staff/login', getParentRoute: () => rootRouteImport } as any)
const StaffDashboardRoute = StaffDashboardRouteImport.update({ id: '/staff/dashboard', path: '/staff/dashboard', getParentRoute: () => rootRouteImport } as any)
const StaffPatientsIndexRoute = StaffPatientsIndexRouteImport.update({ id: '/staff/patients/', path: '/staff/patients/', getParentRoute: () => rootRouteImport } as any)
const StaffPatientsNewRoute = StaffPatientsNewRouteImport.update({ id: '/staff/patients/new', path: '/staff/patients/new', getParentRoute: () => rootRouteImport } as any)
const StaffPatientsMrnRoute = StaffPatientsMrnRouteImport.update({ id: '/staff/patients/$mrn', path: '/staff/patients/$mrn', getParentRoute: () => rootRouteImport } as any)
const StaffAppointmentsRoute = StaffAppointmentsRouteImport.update({ id: '/staff/appointments', path: '/staff/appointments', getParentRoute: () => rootRouteImport } as any)
const StaffPaymentsRoute = StaffPaymentsRouteImport.update({ id: '/staff/payments', path: '/staff/payments', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/admin': typeof AdminRoute
  '/booking': typeof BookingRoute
  '/contact': typeof ContactRoute
  '/departments': typeof DepartmentsRoute
  '/doctors': typeof DoctorsRoute
  '/gallery': typeof GalleryRoute
  '/payment-success': typeof PaymentSuccessRoute
  '/payment-summary': typeof PaymentSummaryRoute
  '/services': typeof ServicesRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/staff/login': typeof StaffLoginRoute
  '/staff/dashboard': typeof StaffDashboardRoute
  '/staff/patients/': typeof StaffPatientsIndexRoute
  '/staff/patients/new': typeof StaffPatientsNewRoute
  '/staff/patients/$mrn': typeof StaffPatientsMrnRoute
  '/staff/appointments': typeof StaffAppointmentsRoute
  '/staff/payments': typeof StaffPaymentsRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/admin': typeof AdminRoute
  '/booking': typeof BookingRoute
  '/contact': typeof ContactRoute
  '/departments': typeof DepartmentsRoute
  '/doctors': typeof DoctorsRoute
  '/gallery': typeof GalleryRoute
  '/payment-success': typeof PaymentSuccessRoute
  '/payment-summary': typeof PaymentSummaryRoute
  '/services': typeof ServicesRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/staff/login': typeof StaffLoginRoute
  '/staff/dashboard': typeof StaffDashboardRoute
  '/staff/patients': typeof StaffPatientsIndexRoute
  '/staff/patients/new': typeof StaffPatientsNewRoute
  '/staff/patients/$mrn': typeof StaffPatientsMrnRoute
  '/staff/appointments': typeof StaffAppointmentsRoute
  '/staff/payments': typeof StaffPaymentsRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/admin': typeof AdminRoute
  '/booking': typeof BookingRoute
  '/contact': typeof ContactRoute
  '/departments': typeof DepartmentsRoute
  '/doctors': typeof DoctorsRoute
  '/gallery': typeof GalleryRoute
  '/payment-success': typeof PaymentSuccessRoute
  '/payment-summary': typeof PaymentSummaryRoute
  '/services': typeof ServicesRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/staff/login': typeof StaffLoginRoute
  '/staff/dashboard': typeof StaffDashboardRoute
  '/staff/patients/': typeof StaffPatientsIndexRoute
  '/staff/patients/new': typeof StaffPatientsNewRoute
  '/staff/patients/$mrn': typeof StaffPatientsMrnRoute
  '/staff/appointments': typeof StaffAppointmentsRoute
  '/staff/payments': typeof StaffPaymentsRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/' | '/about' | '/admin' | '/booking' | '/contact' | '/departments'
    | '/doctors' | '/gallery' | '/payment-success' | '/payment-summary'
    | '/services' | '/sitemap.xml'
    | '/staff/login' | '/staff/dashboard' | '/staff/patients/'
    | '/staff/patients/new' | '/staff/patients/$mrn'
    | '/staff/appointments' | '/staff/payments'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/' | '/about' | '/admin' | '/booking' | '/contact' | '/departments'
    | '/doctors' | '/gallery' | '/payment-success' | '/payment-summary'
    | '/services' | '/sitemap.xml'
    | '/staff/login' | '/staff/dashboard' | '/staff/patients'
    | '/staff/patients/new' | '/staff/patients/$mrn'
    | '/staff/appointments' | '/staff/payments'
  id:
    | '__root__' | '/' | '/about' | '/admin' | '/booking' | '/contact'
    | '/departments' | '/doctors' | '/gallery' | '/payment-success'
    | '/payment-summary' | '/services' | '/sitemap.xml'
    | '/staff/login' | '/staff/dashboard' | '/staff/patients/'
    | '/staff/patients/new' | '/staff/patients/$mrn'
    | '/staff/appointments' | '/staff/payments'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  AdminRoute: typeof AdminRoute
  BookingRoute: typeof BookingRoute
  ContactRoute: typeof ContactRoute
  DepartmentsRoute: typeof DepartmentsRoute
  DoctorsRoute: typeof DoctorsRoute
  GalleryRoute: typeof GalleryRoute
  PaymentSuccessRoute: typeof PaymentSuccessRoute
  PaymentSummaryRoute: typeof PaymentSummaryRoute
  ServicesRoute: typeof ServicesRoute
  SitemapDotxmlRoute: typeof SitemapDotxmlRoute
  StaffLoginRoute: typeof StaffLoginRoute
  StaffDashboardRoute: typeof StaffDashboardRoute
  StaffPatientsIndexRoute: typeof StaffPatientsIndexRoute
  StaffPatientsNewRoute: typeof StaffPatientsNewRoute
  StaffPatientsMrnRoute: typeof StaffPatientsMrnRoute
  StaffAppointmentsRoute: typeof StaffAppointmentsRoute
  StaffPaymentsRoute: typeof StaffPaymentsRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/sitemap.xml': { id: '/sitemap.xml'; path: '/sitemap.xml'; fullPath: '/sitemap.xml'; preLoaderRoute: typeof SitemapDotxmlRouteImport; parentRoute: typeof rootRouteImport }
    '/services': { id: '/services'; path: '/services'; fullPath: '/services'; preLoaderRoute: typeof ServicesRouteImport; parentRoute: typeof rootRouteImport }
    '/payment-summary': { id: '/payment-summary'; path: '/payment-summary'; fullPath: '/payment-summary'; preLoaderRoute: typeof PaymentSummaryRouteImport; parentRoute: typeof rootRouteImport }
    '/payment-success': { id: '/payment-success'; path: '/payment-success'; fullPath: '/payment-success'; preLoaderRoute: typeof PaymentSuccessRouteImport; parentRoute: typeof rootRouteImport }
    '/gallery': { id: '/gallery'; path: '/gallery'; fullPath: '/gallery'; preLoaderRoute: typeof GalleryRouteImport; parentRoute: typeof rootRouteImport }
    '/doctors': { id: '/doctors'; path: '/doctors'; fullPath: '/doctors'; preLoaderRoute: typeof DoctorsRouteImport; parentRoute: typeof rootRouteImport }
    '/departments': { id: '/departments'; path: '/departments'; fullPath: '/departments'; preLoaderRoute: typeof DepartmentsRouteImport; parentRoute: typeof rootRouteImport }
    '/contact': { id: '/contact'; path: '/contact'; fullPath: '/contact'; preLoaderRoute: typeof ContactRouteImport; parentRoute: typeof rootRouteImport }
    '/booking': { id: '/booking'; path: '/booking'; fullPath: '/booking'; preLoaderRoute: typeof BookingRouteImport; parentRoute: typeof rootRouteImport }
    '/admin': { id: '/admin'; path: '/admin'; fullPath: '/admin'; preLoaderRoute: typeof AdminRouteImport; parentRoute: typeof rootRouteImport }
    '/about': { id: '/about'; path: '/about'; fullPath: '/about'; preLoaderRoute: typeof AboutRouteImport; parentRoute: typeof rootRouteImport }
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/login': { id: '/staff/login'; path: '/staff/login'; fullPath: '/staff/login'; preLoaderRoute: typeof StaffLoginRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/dashboard': { id: '/staff/dashboard'; path: '/staff/dashboard'; fullPath: '/staff/dashboard'; preLoaderRoute: typeof StaffDashboardRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/patients/': { id: '/staff/patients/'; path: '/staff/patients/'; fullPath: '/staff/patients/'; preLoaderRoute: typeof StaffPatientsIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/patients/new': { id: '/staff/patients/new'; path: '/staff/patients/new'; fullPath: '/staff/patients/new'; preLoaderRoute: typeof StaffPatientsNewRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/patients/$mrn': { id: '/staff/patients/$mrn'; path: '/staff/patients/$mrn'; fullPath: '/staff/patients/$mrn'; preLoaderRoute: typeof StaffPatientsMrnRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/appointments': { id: '/staff/appointments'; path: '/staff/appointments'; fullPath: '/staff/appointments'; preLoaderRoute: typeof StaffAppointmentsRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/payments': { id: '/staff/payments'; path: '/staff/payments'; fullPath: '/staff/payments'; preLoaderRoute: typeof StaffPaymentsRouteImport; parentRoute: typeof rootRouteImport }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AdminRoute,
  BookingRoute,
  ContactRoute,
  DepartmentsRoute,
  DoctorsRoute,
  GalleryRoute,
  PaymentSuccessRoute,
  PaymentSummaryRoute,
  ServicesRoute,
  SitemapDotxmlRoute,
  StaffLoginRoute,
  StaffDashboardRoute,
  StaffPatientsIndexRoute,
  StaffPatientsNewRoute,
  StaffPatientsMrnRoute,
  StaffAppointmentsRoute,
  StaffPaymentsRoute,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
