import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useSafeReturn from "../../../hooks/useSafeReturn";
import { BtnBlue, BtnGhost, FormPageShell, FormSection, LineItemsTable, LoadingState, Select, Textarea, TotalsBox } from "../../../components/ui/UI";
import { CustomInput } from "../../../components/ui/CustomInput";
import { fetchEstimates } from "../../../services/apiServices/estimateService";
import { createJobSheets, fetchJobSheetById, updateJobSheets } from "../../../services/apiServices/jobSheetService";
import { toJobSheetPayload } from "../../../utils/apiPayloads";

const schema = Yup.object({ estimateId: Yup.number().required("Approved estimate is required"), technicianName: Yup.string().required("Technician is required"), startDate: Yup.date().required("Start date is required"), items: Yup.array().of(Yup.object({ description: Yup.string().required(), quantity: Yup.number().moreThan(0), unitPrice: Yup.number().min(0) })).min(1) });
const toDate = (value) => value ? String(value).split("T")[0] : "";
const today = () => new Date().toISOString().slice(0, 10);
const totalsFor = (values) => { const subtotal = values.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0); const vatAmount = values.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0) * (Number(item.vat ?? values.vatPercentage ?? 0) / 100), 0); return { subtotal, vatAmount, total: Math.max(0, subtotal + vatAmount + Number(values.labourRate || 0) - Number(values.discount || 0)) }; };
const blank = { jobNumber: `JOB-${Date.now()}`, estimateId: "", customerId: "", vehicleId: "", technicianName: "", serviceAdvisor: "", startDate: today(), completedDate: "", vehicleMileage: "", vatPercentage: 20, discount: 0, labourRate: 0, status: "Open", priority: "Medium", notes: "", items: [{ itemType: "Part", description: "", quantity: 1, unitPrice: 0, vat: 20, totalPrice: 0 }] };
const mapRecord = (record = {}) => ({ ...blank, ...record, startDate: toDate(record.startDate) || today(), completedDate: toDate(record.completedDate), estimateId: record.estimateId || record.estimate?.id || "", customerId: record.customerId || record.customer?.id || "", vehicleId: record.vehicleId || record.vehicle?.id || "", vatPercentage: Number(record.vatPercentage ?? 20), discount: Number(record.discount || 0), labourRate: Number(record.labourRate || 0), items: record.items?.length ? record.items.map((item) => ({ ...item, quantity: Number(item.quantity || 1), unitPrice: Number(item.unitPrice || 0), vat: Number(item.vat ?? record.vatPercentage ?? 20), totalPrice: Number(item.quantity || 0) * Number(item.unitPrice || 0) })) : blank.items });

export default function JobSheetForm() {
  const navigate = useNavigate();
  const returnToList = useSafeReturn("/jobSheets");
  const location = useLocation();
  const { id } = useParams();
  const editing = Boolean(id);
  const [record, setRecord] = useState(location.state?.record || null);
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(editing && !location.state?.record);

  useEffect(() => {
    if (!editing) fetchEstimates({ status: "Approved", page: 1, limit: 100 }).then((r) => setEstimates(r?.success ? (r.data || []).filter((item) => !item.jobSheet) : []));
  }, [editing]);
  useEffect(() => {
    if (!editing || record) return;
    (async () => {
      const response = await fetchJobSheetById(id);
      if (response?.success) setRecord(response.data);
      else { toast.error(response?.message || "Job sheet not found"); navigate("/jobSheets", { replace: true }); }
      setLoading(false);
    })();
  }, [editing, id, navigate, record]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: mapRecord(record || {}),
    validationSchema: schema,
    onSubmit: async (values) => {
      const payload = toJobSheetPayload({ ...values, completedDate: values.status === "Completed" ? (values.completedDate || today()) : "" });
      const response = editing ? await updateJobSheets(payload, id) : await createJobSheets(payload);
      if (response?.success) { toast.success(response.message || `Job sheet ${editing ? "updated" : "created"}`); navigate("/jobSheets"); }
      else toast.error(response?.message || "Unable to save job sheet");
    },
  });

  const chooseEstimate = (estimateId) => {
    const estimate = estimates.find((item) => String(item.id) === String(estimateId));
    if (!estimate) { formik.setFieldValue("estimateId", ""); return; }
    formik.setValues({
      ...formik.values,
      estimateId: estimate.id,
      jobNumber: estimate.jobNumber || `JOB-${Date.now()}`,
      customerId: estimate.customerId || estimate.customer?.id,
      vehicleId: estimate.vehicleId || estimate.vehicle?.id,
      serviceAdvisor: estimate.serviceAdvisor || "",
      vehicleMileage: estimate.vehicleMileage || "",
      vatPercentage: Number(estimate.vatPercentage ?? 20),
      discount: Number(estimate.discount || estimate.defaultDiscount || 0),
      labourRate: Number(estimate.labourRate || 0),
      notes: estimate.notes || "",
      items: (estimate.items || []).map((item) => ({ itemType: item.itemType, description: item.description, quantity: Number(item.quantity), unitPrice: Number(item.unitPrice), vat: Number(item.vat ?? estimate.vatPercentage ?? 20), totalPrice: Number(item.totalPrice || Number(item.quantity) * Number(item.unitPrice)) })),
    });
  };

  const selectedEstimate = useMemo(() => editing ? record?.estimate : estimates.find((item) => String(item.id) === String(formik.values.estimateId)), [editing, estimates, formik.values.estimateId, record]);
  const customer = editing ? record?.customer : selectedEstimate?.customer;
  const vehicle = editing ? record?.vehicle : selectedEstimate?.vehicle;
  const totals = totalsFor(formik.values);
  if (loading) return <LoadingState label="Loading job sheet…" />;

  return <form onSubmit={formik.handleSubmit}><FormPageShell title={editing ? `Edit ${record?.jobNumber || "job sheet"}` : "Manual job sheet"} sub={editing ? "Update assignment, line items and workshop progress." : "Use an approved estimate that has not already generated a job sheet."} backTo="/jobSheets" backLabel="Back to job sheets" actions={<><BtnGhost type="button" onClick={returnToList}>Cancel</BtnGhost><BtnBlue type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? "Saving…" : editing ? "Save job sheet" : "Create job sheet"}</BtnBlue></>} aside={<TotalsBox subtotal={totals.subtotal} vat={totals.vatAmount} discount={formik.values.discount} LabourCharge={formik.values.labourRate} total={totals.total} vatPercentage={formik.values.vatPercentage} />}>
    <FormSection title="Estimate, customer and vehicle" description="Estimate, customer and vehicle relationships are locked after creation."><div className="pw-form-grid pw-form-grid--three">{!editing && <Select label="Approved estimate *" value={formik.values.estimateId} onChange={(e) => chooseEstimate(e.target.value)} touched={formik.touched.estimateId} errors={formik.errors.estimateId}><option value="">Select approved estimate</option>{estimates.map((estimate) => <option key={estimate.id} value={estimate.id}>{estimate.estimateNumber} — {estimate.customer?.name}</option>)}</Select>}<CustomInput formik={formik} label="Job number" name="jobNumber" readOnly /><div className="pw-field"><label className="pw-field-label">Customer</label><input className="pw-control" disabled value={customer?.name || "Select an estimate"} /></div><div className="pw-field"><label className="pw-field-label">Vehicle</label><input className="pw-control" disabled value={vehicle ? `${vehicle.registrationNumber} — ${vehicle.make} ${vehicle.model}` : "Select an estimate"} /></div></div></FormSection>
    <FormSection title="Workshop assignment"><div className="pw-form-grid pw-form-grid--three"><CustomInput formik={formik} label="Technician *" name="technicianName" /><CustomInput formik={formik} label="Service advisor" name="serviceAdvisor" /><CustomInput formik={formik} label="Start date *" name="startDate" type="date" /><CustomInput formik={formik} label="Completed date" name="completedDate" type="date" /><CustomInput formik={formik} label="Vehicle mileage" name="vehicleMileage" type="number" /><Select label="Status" value={formik.values.status} onChange={(e) => formik.setFieldValue("status", e.target.value)}><option>Open</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></Select><Select label="Priority" value={formik.values.priority} onChange={(e) => formik.setFieldValue("priority", e.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></Select><CustomInput formik={formik} label="VAT percentage" name="vatPercentage" type="number" /><CustomInput formik={formik} label="Labour charge" name="labourRate" type="number" /><CustomInput formik={formik} label="Discount" name="discount" type="number" /></div></FormSection>
    <FormSection title="Repair items"><LineItemsTable items={formik.values.items} setFieldValue={formik.setFieldValue} formik={formik} vatPercentage={formik.values.vatPercentage} /></FormSection>
    <FormSection title="Workshop notes"><Textarea value={formik.values.notes} onChange={(e) => formik.setFieldValue("notes", e.target.value)} placeholder="Internal notes, customer requests or completion details" /></FormSection>
  </FormPageShell></form>;
}
