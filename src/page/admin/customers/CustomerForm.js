import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useSafeReturn from "../../../hooks/useSafeReturn";
import { BtnBlue, BtnGhost, FormPageShell, FormSection, LoadingState, Select } from "../../../components/ui/UI";
import { CustomInput } from "../../../components/ui/CustomInput";
import { createCustomers, fetchCustomerById, updateCustomers } from "../../../services/apiServices/customers";
import { toCustomerPayload } from "../../../utils/apiPayloads";

const schema = Yup.object({
  name: Yup.string().min(2).required("Full name is required"),
  phone: Yup.string().matches(/^(?:\+44|0)[\d\s()-]{9,14}$/, "Enter a valid UK phone number").required("Phone is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  address: Yup.string().required("Address is required"),
});
const defaults = { name: "", phone: "", email: "", telephone: "", address: "", alternativeAddress: "", creditTerms: "", gdprConsent: "false", customerCode: "" };
const mapRecord = (record = {}) => ({ ...defaults, ...record, gdprConsent: String(record.gdprConsent ?? false) });

export default function CustomerForm() {
  const navigate = useNavigate();
  const returnToList = useSafeReturn("/customers");
  const location = useLocation();
  const { id } = useParams();
  const editing = Boolean(id);
  const [record, setRecord] = useState(location.state?.record || null);
  const [loading, setLoading] = useState(editing && !location.state?.record);

  useEffect(() => {
    if (!editing || record) return;
    (async () => {
      const response = await fetchCustomerById(id);
      if (response?.success) setRecord(response.data);
      else { toast.error(response?.message || "Customer not found"); navigate("/customers", { replace: true }); }
      setLoading(false);
    })();
  }, [editing, id, navigate, record]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: mapRecord(record || {}),
    validationSchema: schema,
    onSubmit: async (values) => {
      const payload = toCustomerPayload(values);
      const response = editing ? await updateCustomers(payload, id) : await createCustomers(payload);
      if (response?.success) { toast.success(response.message || `Customer ${editing ? "updated" : "created"}`); navigate("/customers"); }
      else toast.error(response?.message || "Unable to save customer");
    },
  });

  if (loading) return <LoadingState label="Loading customer…" />;
  return <form onSubmit={formik.handleSubmit}>
    <FormPageShell title={editing ? "Edit customer" : "Add customer"} sub="Manage contact, billing and consent details in one place." backTo="/customers" backLabel="Back to customers" actions={<><BtnGhost type="button" onClick={returnToList}>Cancel</BtnGhost><BtnBlue type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? "Saving…" : editing ? "Save changes" : "Create customer"}</BtnBlue></>}>
      <FormSection title="Customer details" description="Primary contact information used across estimates, job sheets and invoices."><div className="pw-form-grid"><CustomInput formik={formik} label="Full name *" name="name" placeholder="John Smith" /><CustomInput formik={formik} label="Mobile phone *" name="phone" placeholder="07700 900123" /><CustomInput formik={formik} label="Email address *" name="email" type="email" placeholder="john@example.co.uk" /><CustomInput formik={formik} label="Telephone" name="telephone" placeholder="020 7946 0000" /></div></FormSection>
      <FormSection title="Address and account" description="Billing address, internal reference and credit arrangements."><div className="pw-form-grid"><CustomInput formik={formik} label="Primary address *" name="address" placeholder="12 Park Road, London" /><CustomInput formik={formik} label="Alternative address" name="alternativeAddress" placeholder="Optional secondary address" /><CustomInput formik={formik} label="Customer reference" name="customerCode" placeholder="CUST-001" /><CustomInput formik={formik} label="Credit terms" name="creditTerms" placeholder="30 days" /><Select label="GDPR consent" value={formik.values.gdprConsent} onChange={(e) => formik.setFieldValue("gdprConsent", e.target.value)}><option value="false">Not provided</option><option value="true">Consent provided</option></Select></div></FormSection>
    </FormPageShell>
  </form>;
}
