import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useSafeReturn from "../../../hooks/useSafeReturn";
import {
  BtnBlue,
  BtnGhost,
  FormPageShell,
  FormSection,
  LoadingState,
  Select,
} from "../../../components/ui/UI";
import { CustomInput } from "../../../components/ui/CustomInput";
import { fetchCustomers } from "../../../services/apiServices/customers";
import {
  createVehicles,
  fetchVehicleById,
  lookupVehicle,
  updateVehicles,
} from "../../../services/apiServices/vehicleService";
import { toVehiclePayload } from "../../../utils/apiPayloads";

const schema = Yup.object({
  // registrationNumber: Yup.string().required("Registration is required").min(2),
  make: Yup.string().required("Make is required"),
  model: Yup.string().required("Model is required"),
  customerId: Yup.number().required("Select an owner"),
});
const dateOnly = (value) => (value ? String(value).split("T")[0] : "");
const empty = {
  registrationNumber: "",
  make: "",
  model: "",
  year: "",
  vinNumber: "",
  mileage: "",
  engineNumber: "",
  fuelType: "",
  colour: "",
  cc: "",
  grossWeight: "",
  taxDueDate: "",
  motDueDate: "",
  nextServiceDate: "",
  lastMileage: "",
  customerId: "",
};
const mapRecord = (record = {}) => ({
  ...empty,
  ...record,
  taxDueDate: dateOnly(record.taxDueDate),
  motDueDate: dateOnly(record.motDueDate),
  nextServiceDate: dateOnly(record.nextServiceDate),
  customerId: record.customer?.id || record.customerId || "",
});

export default function VehicleForm() {
  const navigate = useNavigate();
  const returnToList = useSafeReturn("/vehicles");
  const location = useLocation();
  const { id } = useParams();
  const editing = Boolean(id);
  const [record, setRecord] = useState(location.state?.record || null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(editing && !location.state?.record);
  const [lookingUp, setLookingUp] = useState(false);

  useEffect(() => {
    fetchCustomers({ page: 1, limit: 100 }).then((res) =>
      setCustomers(res?.success ? res.data || [] : []),
    );
  }, []);
  useEffect(() => {
    if (!editing || record) return;
    (async () => {
      const response = await fetchVehicleById(id);
      if (response?.success) setRecord(response.data);
      else {
        toast.error(response?.message || "Vehicle not found");
        navigate("/vehicles", { replace: true });
      }
      setLoading(false);
    })();
  }, [editing, id, navigate, record]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: mapRecord(record || {}),
    validationSchema: schema,
    onSubmit: async (values) => {
      const payload = toVehiclePayload(values);
      const response = editing
        ? await updateVehicles(payload, id)
        : await createVehicles(payload);
      if (response?.success) {
        toast.success(
          response.message || `Vehicle ${editing ? "updated" : "created"}`,
        );
        navigate("/vehicles");
      } else toast.error(response?.message || "Unable to save vehicle");
    },
  });

  const lookup = async () => {
    const registrationNumber = formik.values.registrationNumber.trim();
    if (!registrationNumber)
      return toast.error("Enter a registration number first");
    setLookingUp(true);
    const response = await lookupVehicle(registrationNumber);
    if (response?.success === false)
      toast.error(response.message || "Vehicle lookup failed");
    else {
      const data = response || {};
      formik.setValues({
        ...formik.values,
        registrationNumber: data.registrationNumber || registrationNumber,
        make: data.make || formik.values.make,
        model: data.model || data.typeApproval || formik.values.model,
        year: data.yearOfManufacture || formik.values.year,
        fuelType: data.fuelType || formik.values.fuelType,
        colour: data.colour || formik.values.colour,
        cc: data.engineCapacity || formik.values.cc,
        grossWeight: data.revenueWeight || formik.values.grossWeight,
        taxDueDate: dateOnly(data.taxDueDate) || formik.values.taxDueDate,
        motDueDate: dateOnly(data.motExpiryDate) || formik.values.motDueDate,
      });
      toast.success("DVLA details imported");
    }
    setLookingUp(false);
  };

  if (loading) return <LoadingState label="Loading vehicle…" />;
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormPageShell
        title={editing ? "Edit vehicle" : "Add vehicle"}
        sub="Create a complete UK vehicle record with ownership and compliance dates."
        backTo="/vehicles"
        backLabel="Back to vehicles"
        actions={
          <>
            <BtnGhost type="button" onClick={returnToList}>
              Cancel
            </BtnGhost>
            <BtnBlue type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting
                ? "Saving…"
                : editing
                  ? "Save changes"
                  : "Create vehicle"}
            </BtnBlue>
          </>
        }
      >
        <FormSection
          title="Registration and ownership"
          description="Start with the registration; DVLA lookup can pre-fill available specifications."
        >
          <div className="pw-form-grid">
            <div className="pw-field">
              <label className="pw-field-label">Registration number *</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  name="registrationNumber"
                  value={formik.values.registrationNumber}
                  onChange={formik.handleChange}
                  className="pw-control uppercase"
                  placeholder="AB12 CDE"
                />
                <BtnGhost type="button" className="!text-nowrap" onClick={lookup} disabled={lookingUp}>
                  {lookingUp ? "Checking…" : "DVLA lookup"}
                </BtnGhost>
              </div>
              {formik.touched.registrationNumber &&
                formik.errors.registrationNumber && (
                  <p className="pw-field-error">
                    {formik.errors.registrationNumber}
                  </p>
                )}
            </div>
            <Select
              label="Registered owner *"
              value={formik.values.customerId}
              onChange={(e) =>
                formik.setFieldValue("customerId", e.target.value)
              }
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
          </div>
        </FormSection>
        <FormSection title="Vehicle specification">
          <div className="pw-form-grid pw-form-grid--three">
            <CustomInput
              formik={formik}
              label="Make *"
              name="make"
              placeholder="BMW"
            />
            <CustomInput
              formik={formik}
              label="Model *"
              name="model"
              placeholder="320d M Sport"
            />
            <CustomInput
              formik={formik}
              label="Year"
              name="year"
              type="number"
            />
            <CustomInput formik={formik} label="Colour" name="colour" />
            <CustomInput formik={formik} label="Fuel type" name="fuelType" />
            <CustomInput
              formik={formik}
              label="Engine capacity (cc)"
              name="cc"
              type="number"
            />
            <CustomInput formik={formik} label="VIN" name="vinNumber" />
            <CustomInput
              formik={formik}
              label="Engine number"
              name="engineNumber"
            />
            <CustomInput
              formik={formik}
              label="Gross weight"
              name="grossWeight"
              type="number"
            />
            <CustomInput
              formik={formik}
              label="Current mileage"
              name="mileage"
              type="number"
            />
            <CustomInput
              formik={formik}
              label="Last recorded mileage"
              name="lastMileage"
              type="number"
            />
          </div>
        </FormSection>
        <FormSection
          title="Compliance and servicing"
          description="Keep MOT, tax and next service dates visible to the workshop team."
        >
          <div className="pw-form-grid pw-form-grid--three">
            <CustomInput
              formik={formik}
              label="Tax due date"
              name="taxDueDate"
              type="date"
            />
            <CustomInput
              formik={formik}
              label="MOT due date"
              name="motDueDate"
              type="date"
            />
            <CustomInput
              formik={formik}
              label="Next service date"
              name="nextServiceDate"
              type="date"
            />
          </div>
        </FormSection>
      </FormPageShell>
    </form>
  );
}
