import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  CarFront,
  Check,
  CheckCircle2,
  CircleGauge,
  ClipboardCheck,
  Clock3,
  Disc3,
  Gauge,
  MessageSquareText,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Wrench,
} from "lucide-react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import "../publicPages.css";

const services = [
  {
    icon: ClipboardCheck,
    title: "MOT preparation & repairs",
    description:
      "A structured pre-test inspection for common MOT failure points, followed by a clear explanation of any advisory or repair requirement before work is approved.",
    includes: [
      "Lighting, tyres, brakes and visibility checks",
      "Suspension, steering and emissions review",
      "Written findings with priorities explained",
      "Repairs coordinated around your planned MOT date",
    ],
    bestFor: "Annual MOT readiness",
    price: "From £49",
    turnaround: "Usually same day",
  },
  {
    icon: Wrench,
    title: "Interim & full servicing",
    description:
      "Maintenance planned around mileage, age, manufacturer guidance and how the vehicle is actually used—from short urban trips to higher-mileage motorway driving.",
    includes: [
      "Oil, filters and fluid checks or replacement",
      "Brake, tyre, steering and suspension inspection",
      "Service reminder and record updates",
      "Petrol, diesel, hybrid and electric vehicle support",
    ],
    bestFor: "Routine scheduled maintenance",
    price: "From £129",
    turnaround: "Half or full day",
  },
  {
    icon: Gauge,
    title: "Diagnostics & warning lights",
    description:
      "Modern fault-code scanning supported by live-data testing and practical investigation, so the recommendation is based on evidence rather than guesswork.",
    includes: [
      "Diagnostic scan and recorded fault review",
      "Live-data and electrical testing where required",
      "Plain-English explanation of likely causes",
      "Repair options and next steps agreed first",
    ],
    bestFor: "Dashboard lights or intermittent faults",
    price: "From £85",
    turnaround: "From 60–90 minutes",
  },
  {
    icon: Disc3,
    title: "Brakes, suspension & steering",
    description:
      "Inspection and repair of safety-critical components with measured wear checks, appropriate replacement parts and a road test after completion.",
    includes: [
      "Brake pads, discs, callipers and fluid checks",
      "Shock absorbers, springs and bushes",
      "Steering joints, wheel bearings and geometry",
      "Final quality-control and road testing",
    ],
    bestFor: "Noise, vibration, pulling or poor control",
    price: "From £95",
    turnaround: "Quoted after inspection",
  },
  {
    icon: CircleGauge,
    title: "Tyres & wheel alignment",
    description:
      "Tyre condition, pressure, balancing and computerised alignment checks designed to improve safety, driving comfort and tyre life.",
    includes: [
      "Tread depth and sidewall condition checks",
      "Wheel balancing and puncture assessment",
      "Computerised alignment measurements",
      "Before-and-after geometry report",
    ],
    bestFor: "Uneven wear or steering pull",
    price: "From £65",
    turnaround: "Around 60 minutes",
  },
  {
    icon: Snowflake,
    title: "Air conditioning & climate control",
    description:
      "System performance checks, refrigerant servicing and leak investigation for vehicles that are no longer cooling, demisting or maintaining temperature correctly.",
    includes: [
      "Cooling-performance and pressure testing",
      "Refrigerant recharge where appropriate",
      "Leak checks and cabin-filter review",
      "Climate-control fault investigation",
    ],
    bestFor: "Weak cooling, odour or poor demisting",
    price: "From £79",
    turnaround: "From 60 minutes",
  },
  {
    icon: BatteryCharging,
    title: "Battery, charging & electrical faults",
    description:
      "Targeted electrical checks for starting problems, battery drain, charging faults and intermittent systems that are difficult to diagnose without structured testing.",
    includes: [
      "Battery health and cold-cranking assessment",
      "Alternator and charging-system testing",
      "Parasitic drain and circuit checks",
      "Replacement coding where required",
    ],
    bestFor: "Starting or charging concerns",
    price: "From £69",
    turnaround: "Assessment first",
  },
  {
    icon: CarFront,
    title: "Vehicle health & pre-purchase checks",
    description:
      "A considered condition review before a long journey, seasonal change or used-car purchase, with findings organised by urgency rather than presented as a confusing list.",
    includes: [
      "Visible mechanical and safety inspection",
      "Tyre, fluid and warning-light review",
      "Road-test observations where available",
      "Written condition summary with priorities",
    ],
    bestFor: "Buying, selling or preparing to travel",
    price: "From £59",
    turnaround: "By appointment",
  },
];

const process = [
  {
    title: "Tell us what you need",
    copy: "Share the registration, mileage, symptoms and preferred date. We will confirm the right appointment type.",
  },
  {
    title: "We inspect and explain",
    copy: "The workshop checks the vehicle and records findings before recommending additional work.",
  },
  {
    title: "You approve the work",
    copy: "Costs, priorities and expected timing are explained clearly before any extra repair begins.",
  },
  {
    title: "Quality check and handover",
    copy: "Completed work is reviewed, records are updated and the vehicle is handed back with practical next steps.",
  },
];

function ServiceCard({ service, index, onEnquire }) {
  const Icon = service.icon;
  return (
    <motion.article
      className="pw-service-detail-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pw-service-detail-card__top">
        <span className="pw-service-detail-card__icon"><Icon size={25} /></span>
        <span className="pw-service-detail-card__number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <div className="pw-service-detail-card__meta">
        <span><Clock3 size={13} /> {service.turnaround}</span>
        <span>{service.bestFor}</span>
      </div>
      <ul>
        {service.includes.map((item) => (
          <li key={item}><CheckCircle2 size={16} /> {item}</li>
        ))}
      </ul>
      <div className="pw-service-detail-card__foot">
        <div><small>Typical pricing</small><strong>{service.price}</strong></div>
        <button type="button" onClick={onEnquire} aria-label={`Enquire about ${service.title}`}><ArrowRight size={19} /></button>
      </div>
    </motion.article>
  );
}

export default function Service() {
  const navigate = useNavigate();

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
              <span className="pw-public-eyebrow">Workshop services</span>
              <h1>Bike care, <span>properly explained.</span></h1>
              <p className="pw-public-hero__lead">
                From routine maintenance to an unexpected warning light, the Mechanic combines modern diagnostics, experienced inspection and clear approval before additional work begins.
              </p>
              <div className="pw-public-hero__chips">
                <span><ShieldCheck size={15} /> Written estimates</span>
                <span><ClipboardCheck size={15} /> Organised records</span>
                <span><MessageSquareText size={15} /> Clear updates</span>
              </div>
            </motion.div>

            <motion.aside
              className="pw-public-hero__panel pw-services-hero-card"
              initial={{ opacity: 0, x: 34 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                [ClipboardCheck, "Service plans matched to your vehicle", "Mileage, age and manufacturer guidance are considered together."],
                [ShieldCheck, "Approval before extra work", "No unexpected additions without a clear explanation and agreement."],
                [Sparkles, "A considered handover", "Completed work, advisories and next steps are summarised clearly."],
              ].map(([Icon, title, copy]) => (
                <div className="pw-services-hero-card__row" key={title}>
                  <span><Icon size={20} /></span>
                  <div><strong>{title}</strong><small>{copy}</small></div>
                </div>
              ))}
              <button type="button" className="pw-public-button pw-public-button--primary" onClick={() => navigate("/contact")}>
                Request a workshop booking <ArrowRight size={17} />
              </button>
            </motion.aside>
          </div>
        </section>

        <section className="pw-public-section">
          <div className="pw-public-shell">
            <div className="pw-public-heading">
              <span className="pw-public-eyebrow">Complete workshop support</span>
              <h2>Services for everyday maintenance and more complex faults.</h2>
              <p>
                Each service begins with the right level of inspection. We separate urgent safety work from future maintenance, explain the options and keep the recommendation proportionate to the vehicle.
              </p>
            </div>
            <div className="pw-services-grid">
              {services.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} onEnquire={() => navigate("/contact")} />
              ))}
            </div>
          </div>
        </section>

        <section className="pw-public-section pw-public-process">
          <div className="pw-public-shell">
            <div className="pw-public-heading is-centred">
              <span className="pw-public-eyebrow">How your visit works</span>
              <h2>A straightforward workshop process from booking to collection.</h2>
              <p>Simple stages keep you informed and make it clear when a decision or approval is needed.</p>
            </div>
            <div className="pw-public-process__grid">
              {process.map((item, index) => (
                <motion.article
                  className="pw-public-process-card"
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.48, delay: index * 0.06 }}
                >
                  <span>STEP 0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="pw-public-section">
          <div className="pw-public-shell pw-services-standards">
            <motion.div
              className="pw-services-standards__copy"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <span className="pw-public-eyebrow">Our service standard</span>
              <h2>Good workshop care should feel organised, not uncertain.</h2>
              <p>
                the Mechanic is designed around the details that matter to riders: accurate inspection, sensible priorities, agreed costs and a clear record of what was completed.
              </p>
              <div className="pw-services-standards__list">
                {[
                  "Written estimates before additional repair work",
                  "Quality parts selected for the vehicle and budget",
                  "Safety-critical findings identified separately",
                  "Digital records for estimates, jobs and invoices",
                  "Practical advice on future maintenance timing",
                ].map((item) => <span key={item}><Check size={17} /> {item}</span>)}
              </div>
            </motion.div>

            <motion.aside
              className="pw-services-standards__panel"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <h3>Need help choosing a service?</h3>
              <p>Share the registration, mileage and symptoms. The team can recommend the correct appointment rather than asking you to guess.</p>
              {[
                [CarFront, "Describe the symptom", "Noise, warning light, vibration, leak or general maintenance request."],
                [Gauge, "Add mileage and registration", "This helps identify the likely service schedule and vehicle specification."],
                [MessageSquareText, "Receive a clear recommendation", "We will confirm the suitable booking and what to expect next."],
              ].map(([Icon, title, copy]) => (
                <article key={title}>
                  <span><Icon size={18} /></span>
                  <div><strong>{title}</strong><small>{copy}</small></div>
                </article>
              ))}
              <button type="button" className="pw-public-button pw-public-button--primary" onClick={() => navigate("/contact")}>
                Speak with the workshop <ArrowRight size={17} />
              </button>
            </motion.aside>
          </div>
        </section>

        <section className="pw-public-section pw-public-cta">
          <div className="pw-public-shell pw-public-cta__card">
            <div>
              <h2>Ready to plan your next workshop visit?</h2>
              <p>Send the vehicle details and the work you have in mind. Our team will help confirm the right appointment and next available options.</p>
            </div>
            <div className="pw-public-cta__actions">
              <button type="button" className="pw-public-button pw-public-button--primary" onClick={() => navigate("/contact")}>Request a booking <ArrowRight size={17} /></button>
              <button type="button" className="pw-public-button pw-public-button--secondary" onClick={() => navigate("/find-vehicle")}>Check a vehicle</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
