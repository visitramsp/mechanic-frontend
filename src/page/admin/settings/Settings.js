import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { RiRefreshLine, RiSave3Line, RiSettings3Line } from "react-icons/ri";
import { BtnBlue, BtnGhost, Card, Input, PageHeader } from "../../../components/ui/UI";
import { fetchSetting, updateSetting } from "../../../services/apiServices/settingService";

const EMPTY_SETTINGS = {
  defaultDiscount: "",
  labourCharge: "",
  otherCharge: "",
  vatPercentage: "",
};

const FIELDS = [
  {
    key: "defaultDiscount",
    label: "Default discount",
    helper: "Applied automatically when a new estimate is prepared.",
    suffix: "£",
    min: 0,
  },
  {
    key: "labourCharge",
    label: "Labour rate",
    helper: "Standard hourly workshop labour charge.",
    suffix: "£ / hour",
    min: 0,
  },
  {
    key: "vatPercentage",
    label: "VAT percentage",
    helper: "Used for estimate and invoice tax calculations.",
    suffix: "%",
    min: 0,
    max: 100,
  },
  {
    key: "otherCharge",
    label: "Other charge",
    helper: "Optional fixed charge for sundries or administration.",
    suffix: "£",
    min: 0,
  },
];

const normalise = (data = {}) => ({
  defaultDiscount: String(data.defaultDiscount ?? ""),
  labourCharge: String(data.labourCharge ?? ""),
  otherCharge: String(data.otherCharge ?? ""),
  vatPercentage: String(data.vatPercentage ?? ""),
});

export default function Settings() {
  const [values, setValues] = useState(EMPTY_SETTINGS);
  const [savedValues, setSavedValues] = useState(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(
    () => FIELDS.some(({ key }) => values[key] !== savedValues[key]),
    [values, savedValues],
  );

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetchSetting();
      if (response?.success) {
        const next = normalise(response.data);
        setValues(next);
        setSavedValues(next);
      } else {
        toast.error(response?.message || "Unable to load workshop settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load workshop settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, Number(value) || 0]),
      );
      const response = await updateSetting(payload);
      if (response?.success) {
        setSavedValues({ ...values });
        toast.success(response.message || "Workshop settings saved");
      } else {
        toast.error(response?.message || "Unable to save workshop settings");
      }
    } catch (error) {
      toast.error(error?.message || "Unable to save workshop settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-5 fade-up">
      <PageHeader
        title="Workshop settings"
        sub="Set the default commercial values used throughout estimates, job sheets and invoices."
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <BtnGhost type="button" onClick={load} disabled={loading || saving}>
              <RiRefreshLine /> Refresh
            </BtnGhost>
            <BtnBlue type="submit" disabled={loading || saving || !dirty}>
              <RiSave3Line /> {saving ? "Saving…" : "Save changes"}
            </BtnBlue>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[#e5eaf2] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="pw-stat-icon"><RiSettings3Line /></span>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-[#111c34] sm:text-lg">Commercial defaults</h2>
              <p className="mt-1 text-sm leading-6 text-[#667085]">
                These values remain editable on individual records when a different rate is required.
              </p>
            </div>
          </div>
          <span className={`pw-save-state ${dirty ? "is-dirty" : "is-saved"}`}>
            <i /> {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
            {FIELDS.map(({ key }) => <div key={key} className="pw-settings-skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {FIELDS.map(({ key, label, helper, suffix, min, max }) => (
              <section key={key} className="pw-settings-field">
                <div className="min-w-0">
                  <h3>{label}</h3>
                  <p>{helper}</p>
                </div>
                <div className="pw-settings-input-row">
                  <Input
                    aria-label={label}
                    type="number"
                    min={min}
                    max={max}
                    step="0.01"
                    value={values[key]}
                    onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder="0.00"
                  />
                  <span>{suffix}</span>
                </div>
              </section>
            ))}
          </div>
        )}
      </Card>

      <div className="pw-form-actions">
        <BtnGhost type="button" disabled={!dirty || saving} onClick={() => setValues({ ...savedValues })}>
          Discard changes
        </BtnGhost>
        <BtnBlue type="submit" disabled={loading || saving || !dirty}>
          <RiSave3Line /> {saving ? "Saving…" : "Save workshop settings"}
        </BtnBlue>
      </div>
    </form>
  );
}
