import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck2,
  CarFront,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  FileCheck2,
  Gauge,
  Info,
  LoaderCircle,
  LockKeyhole,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import "../publicPages.css";
import toast from "react-hot-toast";
import { lookupVehicle } from "../../services/apiServices/vehicleService";

const benefits = [
  {
    icon: FileCheck2,
    title: "MOT and tax overview",
    copy: "Review the available compliance status and relevant due dates in one organised summary.",
  },
  {
    icon: Gauge,
    title: "Core vehicle details",
    copy: "Confirm make, fuel type, engine capacity, colour, year and other available record information.",
  },
  {
    icon: ClipboardCheck,
    title: "Better booking information",
    copy: "Use the vehicle record to help the workshop prepare the right service or diagnostic appointment.",
  },
  {
    icon: ShieldCheck,
    title: "Clear status indicators",
    copy: "Important compliance information is separated into simple, easy-to-read status cards.",
  },
  {
    icon: LockKeyhole,
    title: "Registration-led search",
    copy: "Only the registration is required to request the available vehicle record from the connected service.",
  },
  {
    icon: Wrench,
    title: "Move directly to workshop support",
    copy: "After reviewing the details, contact the Mechanic for bike servicing, diagnostics or repair guidance.",
  },
];

function StatusPill({ value }) {
  if (!value) return <span>—</span>;
  const lower = String(value).toLowerCase();
  const state = lower.includes("valid") || lower.includes("taxed")
    ? "is-good"
    : lower.includes("expired") || lower.includes("sorn")
      ? "is-bad"
      : "is-warning";
  return <span className={`pw-status-pill ${state}`}>{value}</span>;
}

function VehicleField({ label, value, field, editing, editData, setEditData, status = false }) {
  return (
    <div className="pw-vehicle-field">
      <label>{label}</label>
      {editing ? (
        <input
          value={editData[field] || ""}
          onChange={(event) => setEditData((current) => ({ ...current, [field]: event.target.value }))}
        />
      ) : status ? <p><StatusPill value={value} /></p> : <p>{value || "—"}</p>}
    </div>
  );
}

export default function Vehicle() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const searchVehicle = async (event) => {
    event?.preventDefault?.();
    const registrationNumber = query.trim().toUpperCase().replace(/\s/g, "");
    if (!registrationNumber) return;

    setStatus("searching");
    setResult(null);
    setEditing(false);

    const data = await lookupVehicle(registrationNumber);
    if (data?.success === false) {
      if (Number(data.status) === 404 || data.code === "DVLA_NOT_FOUND") setStatus("notfound");
      else {
        setStatus("error");
        toast.error(data.message || "The vehicle service could not be reached.");
      }
      return;
    }

    const formatted = {
      regNo: data.registrationNumber || registrationNumber,
      make: data.make,
      model: data.typeApproval || data.model || "N/A",
      engineCC: data.engineCapacity ? `${data.engineCapacity} cc` : "N/A",
      fuelType: data.fuelType,
      colour: data.colour,
      taxStatus: data.taxStatus,
      taxExpiry: data.taxDueDate,
      motStatus: data.motStatus,
      motExpiry: data.motExpiryDate,
      yearOfManufacture: data.yearOfManufacture?.toString(),
      dateOfRegistration: data.monthOfFirstRegistration,
      revenueWeight: data.revenueWeight ? `${data.revenueWeight} kg` : "N/A",
      euroStatus: data.euroStatus || "N/A",
    };
    setResult(formatted);
    setEditData(formatted);
    setStatus("found");
  };

  const saveEdit = () => {
    setResult(editData);
    setEditing(false);
  };

  return (
    <div className="pw-public-page premium-public">
      <Header />
      <main className="pw-public-main">
        <section className="pw-public-hero">
          <div className="pw-public-shell pw-public-hero__inner">
            <motion.div
              className="pw-public-hero__copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="pw-public-eyebrow">UK vehicle record check</span>
              <h1>Start with the <span>right vehicle details.</span></h1>
              <p className="pw-public-hero__lead">
                Enter a UK registration to retrieve the available vehicle record. Review key details before booking servicing, diagnostics, MOT preparation or repairs.
              </p>
              <div className="pw-public-hero__chips">
                <span><ShieldCheck size={15} /> Registration-led lookup</span>
                <span><FileCheck2 size={15} /> MOT and tax overview</span>
                <span><CarFront size={15} /> Vehicle specification</span>
              </div>
            </motion.div>

            <motion.aside
              className="pw-public-hero__panel pw-vehicle-search-panel"
              initial={{ opacity: 0, x: 34 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2>Check a registration</h2>
              <p>Use the registration exactly as it appears on the vehicle. Spaces are optional.</p>
              <form className="pw-vehicle-search-form" onSubmit={searchVehicle}>
                <div className="pw-vehicle-reg-input">
                  <span className="pw-vehicle-reg-input__gb">UK</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value.toUpperCase())}
                    placeholder="YY59 UAD"
                    aria-label="Vehicle registration"
                  />
                </div>
                <button type="submit" className="pw-public-button pw-public-button--primary">
                  <Search size={18} /> Search
                </button>
              </form>
              <div className="pw-vehicle-search-note">
                <Info size={15} />
                <span>Vehicle data availability depends on the connected record service. Always verify important legal or compliance information using the appropriate official source.</span>
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="pw-vehicle-result-section">
          <div className="pw-public-shell">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div className="pw-vehicle-state" key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div>
                    <span className="pw-vehicle-state__icon"><Search size={24} /></span>
                    <h3>Your vehicle summary will appear here</h3>
                    <p>Enter a registration above to begin. The result is organised into compliance and technical information for easier review.</p>
                  </div>
                </motion.div>
              )}

              {status === "searching" && (
                <motion.div className="pw-vehicle-state" key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div>
                    <motion.div className="pw-vehicle-spinner" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .85, ease: "linear" }} />
                    <h3>Checking the vehicle record</h3>
                    <p>We are requesting the available details for {query || "this registration"}.</p>
                  </div>
                </motion.div>
              )}

              {status === "notfound" && (
                <motion.div className="pw-vehicle-state" key="notfound" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div>
                    <span className="pw-vehicle-state__icon"><Search size={24} /></span>
                    <h3>No matching record was found</h3>
                    <p>Check the registration and try again. Remove any punctuation and make sure letters and numbers are entered correctly.</p>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div className="pw-vehicle-state" key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div>
                    <span className="pw-vehicle-state__icon"><AlertTriangle size={24} /></span>
                    <h3>The vehicle service could not be reached</h3>
                    <p>Please try again shortly. If the issue continues, contact the workshop and quote the registration.</p>
                  </div>
                </motion.div>
              )}

              {status === "found" && result && (
                <motion.div className="pw-vehicle-result" key="found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .48 }}>
                  <div className="pw-vehicle-result__head">
                    <div className="pw-vehicle-result__identity">
                      <div className="pw-vehicle-plate"><span>UK</span><strong>{result.regNo}</strong></div>
                      <div><h2>{result.make || "Vehicle"}</h2><p>{result.colour || "Colour unavailable"} · {result.yearOfManufacture || "Year unavailable"}</p></div>
                    </div>
                    <button type="button" className="pw-public-button pw-public-button--secondary" onClick={() => editing ? saveEdit() : setEditing(true)}>
                      {editing ? <CheckCircle2 size={17} /> : <Edit3 size={17} />}
                      {editing ? "Save changes" : "Edit local record"}
                    </button>
                  </div>

                  <div className="pw-vehicle-result__grid">
                    <article className="pw-vehicle-result-card">
                      <div className="pw-vehicle-result-card__title"><ShieldCheck size={18} /> Compliance overview</div>
                      <div className="pw-vehicle-fields">
                        <VehicleField label="Tax status" value={result.taxStatus} field="taxStatus" status editing={editing} editData={editData} setEditData={setEditData} />
                        <VehicleField label="Tax due" value={result.taxExpiry} field="taxExpiry" editing={editing} editData={editData} setEditData={setEditData} />
                        <VehicleField label="MOT status" value={result.motStatus} field="motStatus" status editing={editing} editData={editData} setEditData={setEditData} />
                        <VehicleField label="MOT expiry" value={result.motExpiry} field="motExpiry" editing={editing} editData={editData} setEditData={setEditData} />
                      </div>
                    </article>

                    <article className="pw-vehicle-result-card">
                      <div className="pw-vehicle-result-card__title"><Gauge size={18} /> Technical details</div>
                      <div className="pw-vehicle-fields">
                        <VehicleField label="Fuel type" value={result.fuelType} field="fuelType" editing={editing} editData={editData} setEditData={setEditData} />
                        <VehicleField label="Engine capacity" value={result.engineCC} field="engineCC" editing={editing} editData={editData} setEditData={setEditData} />
                        <VehicleField label="Year" value={result.yearOfManufacture} field="yearOfManufacture" editing={editing} editData={editData} setEditData={setEditData} />
                        <VehicleField label="Revenue weight" value={result.revenueWeight} field="revenueWeight" editing={editing} editData={editData} setEditData={setEditData} />
                        <VehicleField label="Type approval" value={result.model} field="model" editing={editing} editData={editData} setEditData={setEditData} />
                        <VehicleField label="Euro status" value={result.euroStatus} field="euroStatus" editing={editing} editData={editData} setEditData={setEditData} />
                      </div>
                    </article>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="pw-public-section" style={{ background: "#fff", borderBlock: "1px solid var(--pw-public-line)" }}>
          <div className="pw-public-shell">
            <div className="pw-public-heading is-centred">
              <span className="pw-public-eyebrow">What the check helps with</span>
              <h2>A clearer starting point before your workshop visit.</h2>
              <p>Use the available record as a practical reference when discussing maintenance, MOT preparation, warning lights or repair requirements.</p>
            </div>
            <div className="pw-vehicle-benefit-grid">
              {benefits.map(({ icon: Icon, title, copy }, index) => (
                <motion.article
                  className="pw-vehicle-benefit"
                  key={title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: .46, delay: (index % 3) * .06 }}
                >
                  <span><Icon size={20} /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="pw-public-section pw-public-cta">
          <div className="pw-public-shell pw-public-cta__card">
            <div>
              <h2>Found the vehicle? Plan the right workshop support.</h2>
              <p>Send us the registration, mileage and the issue you would like checked. We will help confirm the most suitable appointment.</p>
            </div>
            <div className="pw-public-cta__actions">
              <button type="button" className="pw-public-button pw-public-button--primary" onClick={() => navigate("/contact")}>Contact the workshop <ArrowRight size={17} /></button>
              <button type="button" className="pw-public-button pw-public-button--secondary" onClick={() => navigate("/services")}>Explore services</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
