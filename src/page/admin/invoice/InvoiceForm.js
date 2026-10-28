import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useSafeReturn from "../../../hooks/useSafeReturn";
import { BtnBlue, BtnGhost, FormPageShell, FormSection, LineItemsTable, LoadingState, Select, Textarea, TotalsBox } from "../../../components/ui/UI";
import { CustomInput } from "../../../components/ui/CustomInput";
import { fetchCustomers } from "../../../services/apiServices/customers";
import { fetchByIdCustomerBasedVehicle } from "../../../services/apiServices/vehicleService";
import { fetchSetting } from "../../../services/apiServices/settingService";
import { toLineItemPayload } from "../../../utils/apiPayloads";
import { createInvoice, fetchInvoiceById, updateInvoice } from "../../../services/apiServices/invoiceService";

const today = () => new Date().toISOString().slice(0, 10);
const inSevenDays = () => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
const dateOnly = (value) => value ? String(value).split("T")[0] : "";
const schema = Yup.object({ invoiceNumber: Yup.string().required("Invoice number is required"), customerId: Yup.number().required("Customer is required"), vehicleId: Yup.number().required("Vehicle is required"), invoiceDate: Yup.date().required("Invoice date is required"), items: Yup.array().of(Yup.object({ description: Yup.string().required("Description is required"), quantity: Yup.number().moreThan(0), unitPrice: Yup.number().min(0) })).min(1) });
const blankItem = (vat = 20) => ({ itemType: "Part", description: "", quantity: 1, unitPrice: 0, vat, totalPrice: 0 });

export default function InvoiceForm() {
  const navigate = useNavigate();
  const returnToList = useSafeReturn("/invoices");
  const location = useLocation();
  const { id } = useParams();
  const editing = Boolean(id);
  const [record, setRecord] = useState(location.state?.record || null);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [settings, setSettings] = useState({ vatPercentage: 20, defaultDiscount: 0, labourCharge: 0 });
  const [loading, setLoading] = useState(editing && !location.state?.record);

  useEffect(() => {
    fetchCustomers({ page: 1, limit: 100 }).then((response) => setCustomers(response?.success ? response.data || [] : []));
    fetchSetting().then((response) => { if (response?.success) setSettings({ vatPercentage: Number(response.data?.vatPercentage || 20), defaultDiscount: Number(response.data?.defaultDiscount || 0), labourCharge: Number(response.data?.labourCharge || 0) }); });
  }, []);
  useEffect(() => {
    if (!editing || record) return;
    (async () => {
      const response = await fetchInvoiceById(id);
      if (response?.success) setRecord(response.data);
      else { toast.error(response?.message || "Invoice not found"); navigate("/invoices", { replace: true }); }
      setLoading(false);
    })();
  }, [editing, id, navigate, record]);

  const initialValues = useMemo(() => ({
    invoiceNumber: record?.invoiceNumber || record?.id || `INV-${Date.now()}`,
    customerId: record?.customerId || record?.customerRecord?.id || "",
    vehicleId: record?.vehicleId || record?.vehicleRecord?.id || "",
    estimateId: record?.estimateId || "",
    jobSheetId: record?.jobSheetId || "",
    invoiceDate: dateOnly(record?.invoiceDate || record?.date) || today(),
    dueDate: dateOnly(record?.dueDate || record?.due) || inSevenDays(),
    status: record?.status || "Draft",
    paidAmount: Number(record?.paidAmount ?? record?.paid ?? 0),
    paymentDate: dateOnly(record?.paymentDate || record?.payDate) || "",
    paymentMethod: record?.paymentMethod || record?.payMethod || "Card",
    vatPercentage: Number(record?.vatPercentage ?? record?.vatRate ?? settings.vatPercentage),
    discount: Number(record?.discount ?? settings.defaultDiscount),
    labourCharge: Number(record?.labourCharge ?? settings.labourCharge),
    notes: record?.notes || "",
    items: record?.items?.length ? record.items.map((item) => ({ ...item, itemType: item.itemType || item.type || "Part", description: item.description || item.desc || "", quantity: Number(item.quantity ?? item.qty ?? 1), unitPrice: Number(item.unitPrice ?? item.rate ?? 0), vat: Number(item.vat ?? record?.vatPercentage ?? settings.vatPercentage), totalPrice: Number(item.totalPrice || Number(item.quantity ?? item.qty) * Number(item.unitPrice ?? item.rate)) })) : [blankItem(settings.vatPercentage)],
  }), [record, settings]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      const customer = customers.find((item) => String(item.id) === String(values.customerId)) || record?.customerRecord;
      const vehicle = vehicles.find((item) => String(item.id) === String(values.vehicleId)) || record?.vehicleRecord;
      if (!customer || !vehicle) return toast.error("Select a valid customer and vehicle");
      const payload = {
        ...values,
        customerName: customer.name,
        vehicleRegistration: vehicle.registrationNumber,
        vehicleDescription: `${vehicle.make || ""} ${vehicle.model || ""}`.trim(),
        customerId: Number(values.customerId),
        vehicleId: Number(values.vehicleId),
        estimateId: values.estimateId ? Number(values.estimateId) : null,
        jobSheetId: values.jobSheetId ? Number(values.jobSheetId) : null,
        paidAmount: Number(values.paidAmount || 0),
        items: values.items.map((item) => toLineItemPayload(item, values.vatPercentage)),
      };
      const response = editing ? await updateInvoice(id, payload) : await createInvoice(payload);
      if (response?.success) { toast.success(response.message || `Invoice ${editing ? "updated" : "created"}`); navigate("/invoices"); }
      else toast.error(response?.message || "Unable to save invoice");
    },
  });

  useEffect(() => {
    if (!formik.values.customerId) { setVehicles([]); return; }
    fetchByIdCustomerBasedVehicle(formik.values.customerId).then((response) => setVehicles(response?.success ? response.data || [] : []));
  }, [formik.values.customerId]);

  const totals = useMemo(() => {
    const subtotal = formik.values.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
    const vatAmount = formik.values.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0) * Number(item.vat ?? formik.values.vatPercentage ?? 0) / 100, 0);
    const total = Math.max(0, subtotal + vatAmount + Number(formik.values.labourCharge || 0) - Number(formik.values.discount || 0));
    return { subtotal, vatAmount, total, balance: Math.max(0, total - Number(formik.values.paidAmount || 0)) };
  }, [formik.values]);

  if (loading) return <LoadingState label="Loading invoice…" />;
  const locked = record?.status === "Void";
  return <form onSubmit={formik.handleSubmit}><FormPageShell title={editing ? `Edit ${formik.values.invoiceNumber}` : "New invoice"} sub={locked ? "Void invoices are read-only." : "Prepare a database-backed VAT invoice with auditable payment records."} backTo="/invoices" backLabel="Back to invoices" actions={<><BtnGhost type="button" onClick={returnToList}>Cancel</BtnGhost><BtnBlue type="submit" disabled={formik.isSubmitting || locked}>{formik.isSubmitting ? "Saving…" : editing ? "Save invoice" : "Create invoice"}</BtnBlue></>} aside={<TotalsBox subtotal={totals.subtotal} vat={totals.vatAmount} discount={formik.values.discount} LabourCharge={formik.values.labourCharge} total={totals.total} paidAmount={formik.values.paidAmount} balance={totals.balance} vatPercentage={formik.values.vatPercentage} />}>
    <FormSection title="Invoice details"><div className="pw-form-grid pw-form-grid--three"><CustomInput formik={formik} label="Invoice number *" name="invoiceNumber" readOnly={editing} /><Select label="Customer *" disabled={locked} value={formik.values.customerId} onChange={(e) => { formik.setFieldValue("customerId", e.target.value); formik.setFieldValue("vehicleId", ""); }} touched={formik.touched.customerId} errors={formik.errors.customerId}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</Select><Select label="Vehicle *" disabled={locked} value={formik.values.vehicleId} onChange={(e) => formik.setFieldValue("vehicleId", e.target.value)} touched={formik.touched.vehicleId} errors={formik.errors.vehicleId}><option value="">Select vehicle</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registrationNumber} — {vehicle.make} {vehicle.model}</option>)}</Select><CustomInput formik={formik} label="Invoice date" name="invoiceDate" type="date" /><CustomInput formik={formik} label="Due date" name="dueDate" type="date" /><Select label="Status" disabled={locked} value={formik.values.status} onChange={(e) => formik.setFieldValue("status", e.target.value)}><option>Draft</option><option>Unpaid</option><option>Overdue</option>{record?.status === "Partial" && <option>Partial</option>}{record?.status === "Paid" && <option>Paid</option>}{locked && <option>Void</option>}</Select><CustomInput formik={formik} label="VAT rate (%)" name="vatPercentage" type="number" min="0" max="100" /><CustomInput formik={formik} label="Labour charge (£)" name="labourCharge" type="number" min="0" step="0.01" /><CustomInput formik={formik} label="Discount (£)" name="discount" type="number" min="0" step="0.01" /><CustomInput formik={formik} label="Amount paid" name="paidAmount" type="number" min="0" step="0.01" readOnly={editing} /><CustomInput formik={formik} label="Payment date" name="paymentDate" type="date" disabled={editing || Number(formik.values.paidAmount) <= 0} /><Select label="Opening payment method" disabled={editing || Number(formik.values.paidAmount) <= 0} value={formik.values.paymentMethod} onChange={(e) => formik.setFieldValue("paymentMethod", e.target.value)}><option>Card</option><option>Cash</option><option>Bank Transfer</option><option>Cheque</option><option>Other</option></Select></div></FormSection>
    <FormSection title="Invoice items" description="Use the invoice payment action after creation for partial or further payments."><div className={locked ? "pointer-events-none opacity-70" : ""}><LineItemsTable items={formik.values.items} setFieldValue={formik.setFieldValue} formik={formik} vatPercentage={formik.values.vatPercentage} /></div></FormSection>
    <FormSection title="Notes"><Textarea value={formik.values.notes} onChange={(e) => formik.setFieldValue("notes", e.target.value)} placeholder="Payment terms or customer notes" /></FormSection>
  </FormPageShell></form>;
}
