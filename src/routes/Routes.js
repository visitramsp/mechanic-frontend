import Customers from "../page/admin/customers/Customers";
import CustomerForm from "../page/admin/customers/CustomerForm";
import Dashboard from "../page/admin/dashboard/Dashboard";
import Estimates from "../page/admin/estimates/Estimates";
import EstimateForm from "../page/admin/estimates/EstimateForm";
import Invoice from "../page/admin/invoice/Invoice";
import InvoiceForm from "../page/admin/invoice/InvoiceForm";
import JobSheets from "../page/admin/jobSheets/JobSheets";
import JobSheetForm from "../page/admin/jobSheets/JobSheetForm";
import Settings from "../page/admin/settings/Settings";
import Vehicles from "../page/admin/vehicles/Vehicles";
import VehicleForm from "../page/admin/vehicles/VehicleForm";
import Users from "../page/admin/users/Users";
import ContactEnquiries from "../page/admin/contactEnquiries/ContactEnquiries";
import DvlaHistory from "../page/admin/dvlaHistory/DvlaHistory";

export const routes = [
  { id: 1, path: "dashboard", Component: Dashboard },
  { id: 2, path: "customers", Component: Customers },
  { id: 3, path: "customers/new", Component: CustomerForm },
  { id: 4, path: "customers/:id/edit", Component: CustomerForm },
  { id: 5, path: "vehicles", Component: Vehicles },
  { id: 6, path: "vehicles/new", Component: VehicleForm },
  { id: 7, path: "vehicles/:id/edit", Component: VehicleForm },
  { id: 8, path: "estimates", Component: Estimates },
  { id: 9, path: "estimates/new", Component: EstimateForm },
  { id: 10, path: "estimates/:id/edit", Component: EstimateForm },
  { id: 11, path: "jobSheets", Component: JobSheets },
  { id: 12, path: "jobSheets/new", Component: JobSheetForm },
  { id: 13, path: "jobSheets/:id/edit", Component: JobSheetForm },
  { id: 14, path: "invoices", Component: Invoice },
  { id: 15, path: "invoices/new", Component: InvoiceForm },
  { id: 16, path: "invoices/:id/edit", Component: InvoiceForm },
  { id: 17, path: "users", Component: Users, roles: ["Admin"] },
  { id: 18, path: "contact-enquiries", Component: ContactEnquiries, roles: ["Admin", "Manager"] },
  { id: 19, path: "dvla-history", Component: DvlaHistory, roles: ["Admin", "Manager"] },
  { id: 20, path: "settings", Component: Settings, roles: ["Admin", "Manager"] },
];
