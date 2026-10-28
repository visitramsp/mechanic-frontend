import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useSafeReturn from "../../../hooks/useSafeReturn";
import {
  BtnBlue,
  BtnGhost,
  FormPageShell,
  FormSection,
  LineItemsTable,
  LoadingState,
  Select,
  Textarea,
  TotalsBox,
} from "../../../components/ui/UI";
import { CustomInput } from "../../../components/ui/CustomInput";
import {
  createEstimates,
  fetchEstimateById,
  updateEstimate,
} from "../../../services/apiServices/estimateService";
import { fetchCustomers } from "../../../services/apiServices/customers";
import { fetchByIdCustomerBasedVehicle } from "../../../services/apiServices/vehicleService";
import { fetchSetting } from "../../../services/apiServices/settingService";
import { toLineItemPayload } from "../../../utils/apiPayloads";

const schema = Yup.object({
  customerId: Yup.number().required("Customer is required"),
  vehicleId: Yup.number().required("Vehicle is required"),
  estimateDate: Yup.date().required("Estimate date is required"),
  estimateNumber: Yup.string().required("Estimate number is required"),
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required("Description is required"),
        quantity: Yup.number().moreThan(
          0,
          "Quantity must be greater than zero",
        ),
        unitPrice: Yup.number().min(0),
      }),
    )
    .min(1),
});
const toDate = (value) => (value ? String(value).split("T")[0] : "");
const calculate = (values) => {
  const subtotal = values.items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0,
  );
  const vatAmount = values.items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.unitPrice || 0) *
        (Number(item.vat ?? values.vatPercentage ?? 0) / 100),
    0,
  );
  return {
    subtotal,
    vatAmount,
    total: Math.max(
      0,
      subtotal +
        vatAmount +
        Number(values.labourRate || 0) -
        Number(values.defaultDiscount || 0),
    ),
  };
};
const baseItem = (vat = 20) => ({
  itemType: "Part",
  description: "",
  quantity: 1,
  unitPrice: 0,
  vat,
  totalPrice: 0,
});

export default function EstimateForm() {
  const navigate = useNavigate();
  const returnToList = useSafeReturn("/estimates");
  const location = useLocation();
  const { id } = useParams();
  const editing = Boolean(id);
  const [record, setRecord] = useState(location.state?.record || null);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [settings, setSettings] = useState({
    vatPercentage: 20,
    defaultDiscount: 0,
    labourCharge: 0,
  });
  const [loading, setLoading] = useState(editing && !location.state?.record);

  useEffect(() => {
    fetchCustomers({ page: 1, limit: 100 }).then((r) =>
      setCustomers(r?.success ? r.data || [] : []),
    );
    fetchSetting().then((r) => {
      if (r?.success)
        setSettings({
          vatPercentage: Number(r.data?.vatPercentage || 20),
          defaultDiscount: Number(r.data?.defaultDiscount || 0),
          labourCharge: Number(r.data?.labourCharge || 0),
        });
    });
  }, []);
  useEffect(() => {
    if (!editing || record) return;
    (async () => {
      const response = await fetchEstimateById(id);
      if (response?.success) setRecord(response.data);
      else {
        toast.error(response?.message || "Estimate not found");
        navigate("/estimates", { replace: true });
      }
      setLoading(false);
    })();
  }, [editing, id, navigate, record]);

  const initialValues = useMemo(
    () => ({
      customerId: record?.customerId || record?.customer?.id || "",
      vehicleId: record?.vehicleId || record?.vehicle?.id || "",
      estimateDate:
        toDate(record?.estimateDate) || moment().format("YYYY-MM-DD"),
      estimateNumber: record?.estimateNumber || `EST-${Date.now()}`,
      documentType: record?.documentType || "Estimate",
      labourRate: Number(record?.labourRate ?? settings.labourCharge),
      creditTerms: String(
        record?.creditTerms || record?.customer?.creditTerms || "7 days",
      ),
      defaultDiscount: Number(
        record?.defaultDiscount ?? record?.discount ?? settings.defaultDiscount,
      ),
      customerOrderNumber: record?.customerOrderNumber || "",
      vehicleMileage: record?.vehicleMileage ?? "",
      serviceAdvisor: record?.serviceAdvisor || "",
      validUntil: toDate(record?.validUntil),
      notes: record?.notes || "",
      vatPercentage: Number(record?.vatPercentage ?? settings.vatPercentage),
      status: record?.status || "Draft",
      items: record?.items?.length
        ? record.items.map((item) => ({
            ...item,
            quantity: Number(item.quantity || 1),
            unitPrice: Number(item.unitPrice || 0),
            vat: Number(
              item.vat ?? record?.vatPercentage ?? settings.vatPercentage,
            ),
            totalPrice:
              Number(item.quantity || 0) * Number(item.unitPrice || 0),
          }))
        : [baseItem(settings.vatPercentage)],
    }),
    [record, settings],
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        status: values.status === "Approved" ? "Sent" : values.status,
        items: values.items.map((item) =>
          toLineItemPayload(item, values.vatPercentage),
        ),
      };
      const response = editing
        ? await updateEstimate(payload, id)
        : await createEstimates(payload);
      if (response?.success) {
        toast.success(
          response.message || `Estimate ${editing ? "updated" : "created"}`,
        );
        navigate("/estimates");
      } else toast.error(response?.message || "Unable to save estimate");
    },
  });

  useEffect(() => {
    const customerId = formik.values.customerId;
    if (!customerId) {
      setVehicles([]);
      return;
    }
    fetchByIdCustomerBasedVehicle(customerId).then((r) =>
      setVehicles(r?.success ? r.data || [] : []),
    );
  }, [formik.values.customerId]);

  const totals = calculate(formik.values);
  if (loading) return <LoadingState label="Loading estimate…" />;
  const locked = record?.status === "Approved";

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormPageShell
        title={editing ? "Edit estimate" : "New estimate"}
        sub={
          locked
            ? "Approved commercial details are locked because a job sheet has been created."
            : "Build a professional quotation with customer, vehicle and repair items."
        }
        backTo="/estimates"
        backLabel="Back to estimates"
        actions={
          <>
            <BtnGhost type="button" onClick={returnToList}>
              Cancel
            </BtnGhost>
            <BtnBlue type="submit" disabled={formik.isSubmitting || locked}>
              {formik.isSubmitting
                ? "Saving…"
                : editing
                  ? "Save estimate"
                  : "Create estimate"}
            </BtnBlue>
          </>
        }
        aside={
          <TotalsBox
            subtotal={totals.subtotal}
            vat={totals.vatAmount}
            discount={formik.values.defaultDiscount}
            LabourCharge={formik.values.labourRate}
            total={totals.total}
            vatPercentage={formik.values.vatPercentage}
          />
        }
      >
        <FormSection
          title="Customer and vehicle"
          description="Select the customer first to load their registered vehicles."
        >
          <div className="pw-form-grid pw-form-grid--three">
            <CustomInput
              formik={formik}
              label="Estimate number *"
              name="estimateNumber"
              readOnly={editing}
              disabled={locked}
            />
            <Select
              label="Customer *"
              disabled={locked}
              value={formik.values.customerId}
              onChange={(e) => {
                formik.setFieldValue("customerId", e.target.value);
                formik.setFieldValue("vehicleId", "");
              }}
              touched={formik.touched.customerId}
              errors={formik.errors.customerId}
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select
              label="Vehicle *"
              disabled={locked}
              value={formik.values.vehicleId}
              onChange={(e) =>
                formik.setFieldValue("vehicleId", e.target.value)
              }
              touched={formik.touched.vehicleId}
              errors={formik.errors.vehicleId}
            >
              <option value="">Select vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} — {v.make} {v.model}
                </option>
              ))}
            </Select>
          </div>
        </FormSection>
        <FormSection title="Estimate details">
          <div className="pw-form-grid pw-form-grid--three">
            <CustomInput
              formik={formik}
              label="Estimate date"
              name="estimateDate"
              type="date"
            />
            <CustomInput
              formik={formik}
              label="Valid until"
              name="validUntil"
              type="date"
            />
            <CustomInput
              formik={formik}
              label="Customer order number"
              name="customerOrderNumber"
            />
            <CustomInput
              formik={formik}
              label="Service advisor"
              name="serviceAdvisor"
            />
            <CustomInput
              formik={formik}
              label="Vehicle mileage"
              name="vehicleMileage"
              type="number"
              disabled={locked}
            />
            <CustomInput
              formik={formik}
              label="Credit terms"
              name="creditTerms"
            />
            <Select
              label="Status"
              value={formik.values.status}
              disabled={locked}
              onChange={(e) => formik.setFieldValue("status", e.target.value)}
            >
              <option>Draft</option>
              <option>Sent</option>
              <option>Rejected</option>
              {locked && <option>Approved</option>}
            </Select>
            <CustomInput
              formik={formik}
              label="VAT percentage"
              name="vatPercentage"
              type="number"
              disabled={locked}
            />
            <CustomInput
              formik={formik}
              label="Labour charge"
              name="labourRate"
              type="number"
              disabled={locked}
            />
            <CustomInput
              formik={formik}
              label="Discount"
              name="defaultDiscount"
              type="number"
              disabled={locked}
            />
          </div>
        </FormSection>
        <FormSection
          title="Repair items"
          description="Add parts, labour and service lines. Approve the estimate from the list to create a job sheet."
        >
          <div className={locked ? "pointer-events-none opacity-70" : ""}>
            <LineItemsTable
              items={formik.values.items}
              setFieldValue={formik.setFieldValue}
              formik={formik}
              vatPercentage={formik.values.vatPercentage}
            />
          </div>
        </FormSection>
        <FormSection title="Customer notes">
          <Textarea
            value={formik.values.notes}
            onChange={(e) => formik.setFieldValue("notes", e.target.value)}
            placeholder="Terms, exclusions or additional notes"
          />
        </FormSection>
      </FormPageShell>
    </form>
  );
}
