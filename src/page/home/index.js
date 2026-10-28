import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BadgePoundSterling,
  Building2,
  CalendarCheck2,
  CarFront,
  Cog,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleGauge,
  ClipboardCheck,
  Clock3,
  Disc3,
  Gauge,
  KeyRound,
  Mail,
  MapPin,
  MessageSquareText,
  Paintbrush,
  Phone,
  Search,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  UsersRound,
  Wrench,
} from "lucide-react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import { useNavigate } from "react-router-dom";
import "./homeStyle.css";
import "./homeResponsiveV6.css";
import "./homePremiumV9.css";
import "./theMechnicHome.css";
import toast from "react-hot-toast";
import { submitContactEnquiry } from "../../services/apiServices/contactService";

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return undefined;
    let current = 0;
    const step = target / 72;
    const timer = window.setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        window.clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 18);
    return () => window.clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-65px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 34 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, copy, centred = false, light = false }) {
  return (
    <FadeUp>
      <div className={`pw-home-section-heading ${centred ? "is-centred" : ""} ${light ? "is-light" : ""}`}>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
    </FadeUp>
  );
}

function ServiceCard({ icon: Icon, title, desc, price, detail, highlights = [], index }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 250, damping: 21 }}
      className="pw-home-service-card"
    >
      <div className="pw-home-service-card__rail" aria-hidden="true" />
      <div className="pw-home-service-card__top">
        <span className="pw-home-service-card__number">{String(index + 1).padStart(2, "0")}</span>
        <span className="pw-home-icon"><Icon size={23} /></span>
      </div>
      <div className="pw-home-service-card__body">
        <span className="pw-home-service-card__price">{price}</span>
        <h3>{title}</h3>
        <p>{desc}</p>
        <ul>
          {highlights.slice(0, 2).map((item) => (
            <li key={item}><Check size={14} /> {item}</li>
          ))}
        </ul>
      </div>
      <div className="pw-home-service-card__foot">
        <span><CheckCircle2 size={16} /> {detail}</span>
        <span className="pw-home-service-card__arrow"><ArrowRight size={18} aria-hidden="true" /></span>
      </div>
    </motion.article>
  );
}

function TestimonialCard({ quote, name, vehicle, initials, delay }) {
  return (
    <FadeUp delay={delay} className="h-full">
      <motion.article whileHover={{ y: -5 }} className="pw-home-review-card">
        <div className="pw-home-review-card__stars" aria-label="Five star review">
          {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
        </div>
        <p>“{quote}”</p>
        <div className="pw-home-review-card__person">
          <span>{initials}</span>
          <div>
            <strong>{name}</strong>
            <small>{vehicle}</small>
          </div>
        </div>
      </motion.article>
    </FadeUp>
  );
}

const serviceCards = [
  {
    icon: ClipboardCheck,
    title: "MOT Preparation & Repairs",
    desc: "Pre-test checks, advisories explained clearly and practical repairs arranged before your test date.",
    price: "From £49",
    detail: "Clear pre-test report",
    highlights: ["Advisories explained", "Repair approval before work"],
  },
  {
    icon: Wrench,
    title: "Interim & Full Servicing",
    desc: "Scheduled maintenance for petrol, diesel, hybrid and electric vehicles, tailored to mileage and usage.",
    price: "From £129",
    detail: "Service record updated",
    highlights: ["Manufacturer-aware schedules", "Petrol, diesel, hybrid & EV"],
  },
  {
    icon: Gauge,
    title: "Diagnostics & Warning Lights",
    desc: "Modern fault-code scanning, live-data testing and a plain-English explanation before work begins.",
    price: "From £85",
    detail: "Digital findings supplied",
    highlights: ["Live-data testing", "Plain-English fault summary"],
  },
  {
    icon: Disc3,
    title: "Brakes, Suspension & Steering",
    desc: "Inspection and replacement of safety-critical components with road testing and final quality checks.",
    price: "From £95",
    detail: "Safety-first assessment",
    highlights: ["Road-tested after repair", "Quality checked components"],
  },
  {
    icon: CircleGauge,
    title: "Tyres & Wheel Alignment",
    desc: "Tyre condition checks, balancing and computerised alignment to support comfort, safety and tyre life.",
    price: "From £65",
    detail: "Alignment report included",
    highlights: ["Tyre condition review", "Computerised geometry check"],
  },
  {
    icon: Snowflake,
    title: "Air Conditioning & Electrical",
    desc: "Air-conditioning servicing, battery testing, charging-system checks and electrical fault tracing.",
    price: "From £79",
    detail: "System health check",
    highlights: ["Battery & charging tests", "Air-con performance review"],
  },
  {
    icon: Paintbrush,
    title: "Bodywork & Cosmetic Repair",
    desc: "Smart repairs for dents, scuffs and paint damage, with larger panel work quoted after inspection.",
    price: "Tailored quote",
    detail: "Photo estimate available",
    highlights: ["Smart cosmetic repairs", "Panel work quoted clearly"],
  },
  {
    icon: CarFront,
    title: "Vehicle Health Check",
    desc: "A considered inspection before a long journey, seasonal change or used-car purchase decision.",
    price: "From £59",
    detail: "Written condition summary",
    highlights: ["Seasonal & pre-trip checks", "Used-car inspection support"],
  },
];

const plans = [
  {
    name: "Essential Care",
    eyebrow: "Everyday maintenance",
    price: "From £129",
    copy: "A practical service option for lower-mileage vehicles and routine annual care.",
    features: ["Oil and filter replacement", "Fluid and tyre checks", "Safety inspection", "Digital service summary"],
  },
  {
    name: "Complete Care",
    eyebrow: "Most popular",
    price: "From £229",
    copy: "A more detailed inspection for vehicles covering regular family or commuter mileage.",
    features: ["Comprehensive service schedule", "Brake and suspension inspection", "Diagnostic scan", "Priority booking support"],
    featured: true,
  },
  {
    name: "Prestige Care",
    eyebrow: "Premium attention",
    price: "Tailored",
    copy: "A high-touch plan for prestige, performance, specialist and carefully maintained vehicles.",
    features: ["Vehicle-specific maintenance plan", "Detailed condition reporting", "Collection options", "Named service adviser"],
  },
];

const faqs = [
  {
    question: "Can I book an MOT and service together?",
    answer: "Yes. Select the combined MOT and service option when you enquire. The workshop can plan both items around the same visit and explain any MOT advisories before additional work is approved.",
  },
  {
    question: "Will you contact me before carrying out extra repairs?",
    answer: "Yes. Additional work should be explained and authorised before it begins. You receive a clear summary of the issue, the proposed repair and the expected cost.",
  },
  {
    question: "Do you work on hybrid and electric vehicles?",
    answer: "The booking form accepts petrol, diesel, hybrid and electric vehicles. Specialist high-voltage work can be confirmed after the vehicle details and required service are reviewed.",
  },
  {
    question: "Can you look after company cars and small fleets?",
    answer: "Yes. PrestigeWorkshops supports local businesses with scheduled servicing, maintenance planning, consolidated communication and organised vehicle records.",
  },
  {
    question: "What should I bring when dropping off my vehicle?",
    answer: "Bring your keys, locking wheel-nut key if fitted, and any information about warning lights or recent symptoms. Service history is helpful when available.",
  },
];

function LegacyHomePage() {
  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState("idle");
  const [activeFaq, setActiveFaq] = useState(0);

  const handleBook = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const fullName = String(form.get("name") || "").trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts.shift() || "Customer";
    const lastName = parts.join(" ") || "Enquiry";
    const details = [
      form.get("fuelType") ? `Fuel type: ${form.get("fuelType")}` : "",
      form.get("preferredDate") ? `Preferred date: ${form.get("preferredDate")}` : "",
      form.get("preferredContact") ? `Preferred contact: ${form.get("preferredContact")}` : "",
      String(form.get("details") || "").trim(),
    ].filter(Boolean).join("\n");

    setFormStatus("loading");
    const response = await submitContactEnquiry({
      firstName,
      lastName,
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      registration: String(form.get("registration") || "").trim().toUpperCase(),
      service: String(form.get("service") || "Workshop booking").trim(),
      message: details || "Please contact me to discuss a workshop booking.",
      consent: true,
      source: "homepage-booking",
    });
    if (!response?.success) {
      setFormStatus("idle");
      toast.error(response?.message || "Unable to send the booking request.");
      return;
    }
    formElement.reset();
    setFormStatus("done");
    toast.success(response?.message || "Booking request received.");
  };

  return (
    <div className="premium-public pw-home-page">
      <Header />

      <main>
        <section className="pw-home-hero">
          <div className="pw-home-hero__grid" aria-hidden="true" />
          <div className="pw-home-hero__orb pw-home-hero__orb--one" aria-hidden="true" />
          <div className="pw-home-hero__orb pw-home-hero__orb--two" aria-hidden="true" />

          <div className="pw-home-shell pw-home-hero__inner">
            <div className="pw-home-hero__copy">
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.5 }}
                className="pw-home-kicker"
              >
                <Sparkles size={15} /> Independent British motoring care
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                Proper care for<br />
                <span>every mile ahead.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.62 }}
                className="pw-home-hero__lead"
              >
                PrestigeWorkshops brings servicing, MOT preparation, diagnostics and repairs into one considered experience—clear estimates, skilled workmanship and updates that keep you informed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.6 }}
                className="pw-home-hero__actions"
              >
                <button type="button" onClick={() => navigate("/find-vehicle")} className="pw-home-btn pw-home-btn--primary">
                  <Search size={19} /> Check a vehicle <ArrowRight size={18} />
                </button>
                <button type="button" onClick={() => navigate("/contact")} className="pw-home-btn pw-home-btn--secondary">
                  <CalendarCheck2 size={19} /> Book workshop care
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.62, duration: 0.6 }}
                className="pw-home-hero__proof"
              >
                <span><ShieldCheck size={17} /> Clear approval before extra work</span>
                <span><MessageSquareText size={17} /> Helpful progress updates</span>
                <span><KeyRound size={17} /> Secure vehicle records</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 70, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="pw-home-hero__visual"
            >
              <div className="pw-home-hero__image-wrap">
                <img src="https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=88" alt="Vehicle receiving premium workshop care" width="1200" height="900" loading="eager" fetchPriority="high" decoding="async" />
                <div className="pw-home-hero__image-shade" />
                <div className="pw-home-hero__image-badge"><span /> Workshop availability today</div>
              </div>
              <div className="pw-home-hero__floating-card pw-home-hero__floating-card--service">
                <span><ClipboardCheck size={20} /></span>
                <div><small>Service promise</small><strong>Quote first. Approve second.</strong></div>
              </div>
              <div className="pw-home-hero__floating-card pw-home-hero__floating-card--rating">
                <div className="pw-home-rating"><Star size={15} fill="currentColor" /> 4.9</div>
                <small>Customer experience</small>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pw-home-proof" aria-label="PrestigeWorkshops standards and experience">
          <div className="pw-home-shell pw-home-proof__layout">
            <FadeUp className="pw-home-proof__intro">
              <span className="pw-home-eyebrow">Why drivers choose us</span>
              <h2>Workshop care built around clarity, quality and confidence.</h2>
              <p>Every visit is supported by a written estimate, organised records and practical communication from first enquiry to vehicle collection.</p>
              <div className="pw-home-proof__assurances">
                <span><ShieldCheck size={17} /> Quality-assured workmanship</span>
                <span><BadgePoundSterling size={17} /> Costs agreed before work</span>
              </div>
            </FadeUp>

            <div className="pw-home-proof__grid">
              {[
                { icon: UsersRound, number: 12000, suffix: "+", title: "Workshop visits supported", copy: "Experience across everyday, prestige, hybrid and performance vehicles." },
                { icon: Star, number: 98, suffix: "%", title: "Customer satisfaction", copy: "Clear updates, considered advice and an organised handover experience." },
                { icon: Wrench, number: 16, suffix: "+", title: "Years of experience", copy: "Independent workshop knowledge backed by modern diagnostic processes." },
                { icon: Clock3, number: 24, suffix: " hrs", title: "Typical enquiry response", copy: "Prompt booking support during normal workshop opening hours." },
              ].map(({ icon: Icon, number, suffix, title, copy }, index) => (
                <FadeUp key={title} delay={index * 0.07}>
                  <article className="pw-home-proof-card">
                    <div className="pw-home-proof-card__head">
                      <span><Icon size={20} /></span>
                      <small>0{index + 1}</small>
                    </div>
                    <strong><Counter target={number} suffix={suffix} /></strong>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="pw-home-section pw-home-services">
          <div className="pw-home-shell">
            <SectionHeading
              eyebrow="Workshop services"
              title="One trusted place for everyday vehicle care."
              copy="From an annual service to an unexpected warning light, our workshop is organised around clear advice, careful inspection and dependable follow-through."
            />
            <div className="pw-home-service-grid">
              {serviceCards.map((service, index) => (
                <FadeUp key={service.title} delay={(index % 4) * 0.06}>
                  <ServiceCard {...service} index={index} />
                </FadeUp>
              ))}
            </div>
            <FadeUp>
              <div className="pw-home-services__footer">
                <div>
                  <strong>Not sure which service you need?</strong>
                  <p>Tell us what the vehicle is doing and our team will guide you to the right booking.</p>
                </div>
                <button type="button" onClick={() => navigate("/services")} className="pw-home-text-btn">
                  Explore all services <ArrowRight size={17} />
                </button>
              </div>
            </FadeUp>
          </div>
        </section>

        <section className="pw-home-section pw-home-care">
          <div className="pw-home-shell">
            <SectionHeading
              eyebrow="Service options"
              title="Choose the level of care that suits your vehicle."
              copy="Simple, well-explained options for routine maintenance, higher-mileage use and prestige vehicles that need more individual attention."
              centred
            />
            <div className="pw-home-plan-grid">
              {plans.map((plan, index) => (
                <FadeUp key={plan.name} delay={index * 0.08}>
                  <article className={`pw-home-plan ${plan.featured ? "is-featured" : ""}`}>
                    {plan.featured && <span className="pw-home-plan__badge">Recommended</span>}
                    <small>{plan.eyebrow}</small>
                    <h3>{plan.name}</h3>
                    <strong>{plan.price}</strong>
                    <p>{plan.copy}</p>
                    <ul>
                      {plan.features.map((feature) => <li key={feature}><Check size={17} /> {feature}</li>)}
                    </ul>
                    <button type="button" onClick={() => navigate("/contact")}>
                      Discuss this option <ArrowRight size={17} />
                    </button>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="pw-home-section pw-home-process">
          <div className="pw-home-shell pw-home-process__layout">
            <div>
              <SectionHeading
                eyebrow="How it works"
                title="A workshop visit without the usual uncertainty."
                copy="The process is designed to keep decisions simple and make every stage visible—from the first enquiry to collection."
                light
              />
              <button type="button" onClick={() => navigate("/contact")} className="pw-home-btn pw-home-btn--light">
                Start a booking <ArrowRight size={18} />
              </button>
            </div>
            <div className="pw-home-process__steps">
              {[
                ["01", Search, "Tell us about the vehicle", "Enter the registration or share the make, model and symptoms."],
                ["02", CalendarCheck2, "Choose a suitable visit", "Request a date and the type of workshop support you need."],
                ["03", ClipboardCheck, "Review the estimate", "We inspect, explain the findings and ask for approval before extras."],
                ["04", KeyRound, "Collect with confidence", "Receive a clear summary of completed work and future recommendations."],
              ].map(([number, Icon, title, copy], index) => (
                <FadeUp key={title} delay={index * 0.07}>
                  <article className="pw-home-process-card">
                    <span className="pw-home-process-card__number">{number}</span>
                    <span className="pw-home-process-card__icon"><Icon size={21} /></span>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="pw-home-section pw-home-booking">
          <div className="pw-home-shell pw-home-booking__layout">
            <div className="pw-home-booking__intro">
              <SectionHeading
                eyebrow="Request a booking"
                title="Tell us what your vehicle needs."
                copy="Share a few details and the workshop team can confirm availability, likely next steps and any information needed before your visit."
              />
              <div className="pw-home-contact-list">
                <a href="tel:+442079460128"><Phone size={18} /><span><small>Call the workshop</small><strong>+44 (0)20 7946 0128</strong></span></a>
                <a href="mailto:hello@prestigeworkshops.com"><Mail size={18} /><span><small>Email enquiries</small><strong>hello@prestigeworkshops.com</strong></span></a>
                <div><MapPin size={18} /><span><small>Service area</small><strong>London & surrounding counties</strong></span></div>
              </div>
              <div className="pw-home-booking__note"><Clock3 size={18} /> Most enquiries receive a response within two working hours.</div>
            </div>

            <FadeUp delay={0.08}>
              <form className="pw-home-booking-form" onSubmit={handleBook}>
                <div className="pw-home-booking-form__head">
                  <span><CalendarCheck2 size={21} /></span>
                  <div><small>Quick enquiry</small><h3>Request workshop care</h3></div>
                </div>
                <div className="pw-home-form-grid">
                  <label><span>Your name</span><input name="name" required type="text" placeholder="e.g. Oliver Bennett" /></label>
                  <label><span>Telephone</span><input name="phone" required type="tel" placeholder="+44 7700 900123" /></label>
                  <label><span>Email</span><input name="email" required type="email" placeholder="you@example.com" /></label>
                  <label><span>Registration</span><input name="registration" type="text" placeholder="AB12 CDE" className="uppercase" /></label>
                  <label>
                    <span>Fuel type</span>
                    <select name="fuelType" defaultValue=""><option value="" disabled>Select fuel type</option><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option><option>Other</option></select>
                  </label>
                  <label className="pw-home-form-grid__wide">
                    <span>Service required</span>
                    <select name="service" defaultValue="" required><option value="" disabled>Select a service</option><option>MOT preparation</option><option>Interim service</option><option>Full service</option><option>Diagnostics</option><option>Brakes or suspension</option><option>Tyres or alignment</option><option>Air conditioning</option><option>Bodywork</option><option>Not sure yet</option></select>
                  </label>
                  <label><span>Preferred date</span><input name="preferredDate" type="date" /></label>
                  <label><span>Preferred contact</span><select name="preferredContact" defaultValue="Phone"><option>Phone</option><option>Email</option><option>Text message</option></select></label>
                  <label className="pw-home-form-grid__wide"><span>Anything we should know?</span><textarea name="details" rows="3" placeholder="Describe warning lights, noises, recent work or any deadline." /></label>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={formStatus === "loading"} className={`pw-home-submit ${formStatus === "done" ? "is-done" : ""}`}>
                  <AnimatePresence mode="wait">
                    {formStatus === "idle" && <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Send booking request <ArrowRight size={18} /></motion.span>}
                    {formStatus === "loading" && <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><i /> Sending your request…</motion.span>}
                    {formStatus === "done" && <motion.span key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}><CheckCircle2 size={19} /> Request received</motion.span>}
                  </AnimatePresence>
                </motion.button>
                <p className="pw-home-form-privacy"><ShieldCheck size={15} /> Your details are used only to respond to this workshop enquiry.</p>
              </form>
            </FadeUp>
          </div>
        </section>

        <section className="pw-home-section pw-home-fleet">
          <div className="pw-home-shell pw-home-fleet__card">
            <div className="pw-home-fleet__visual">
              <span className="pw-home-fleet__icon"><Building2 size={29} /></span>
              <div className="pw-home-fleet__mini"><UsersRound size={19} /><strong>One point of contact</strong><small>For drivers and managers</small></div>
              <div className="pw-home-fleet__mini"><ClipboardCheck size={19} /><strong>Organised records</strong><small>Service and repair history</small></div>
            </div>
            <div className="pw-home-fleet__copy">
              <span className="pw-home-eyebrow">Business & fleet support</span>
              <h2>Keep company vehicles ready for the working week.</h2>
              <p>Structured maintenance support for sole traders, local companies and small fleets—planned servicing, consistent communication and fewer avoidable disruptions.</p>
              <div className="pw-home-fleet__benefits">
                <span><CheckCircle2 size={17} /> Flexible booking coordination</span>
                <span><CheckCircle2 size={17} /> Driver and manager updates</span>
                <span><CheckCircle2 size={17} /> Maintenance planning</span>
                <span><CheckCircle2 size={17} /> Consolidated vehicle records</span>
              </div>
              <button type="button" onClick={() => navigate("/contact")} className="pw-home-btn pw-home-btn--primary">Discuss fleet support <ArrowRight size={18} /></button>
            </div>
          </div>
        </section>

        <section className="pw-home-section pw-home-coverage">
          <div className="pw-home-shell">
            <SectionHeading
              eyebrow="Vehicle coverage"
              title="Care for familiar family cars, working vehicles and prestige marques."
              copy="Our enquiry process supports a broad mix of petrol, diesel, hybrid and electric vehicles. Specialist requirements can be confirmed before booking."
              centred
            />
            <div className="pw-home-marques" aria-label="Example supported vehicle marques">
              {["Audi", "BMW", "Ford", "Jaguar", "Land Rover", "Mercedes-Benz", "MINI", "Nissan", "Tesla", "Toyota", "Vauxhall", "Volkswagen"].map((brand) => <span key={brand}>{brand}</span>)}
            </div>
            <div className="pw-home-coverage__cards">
              {[
                [CarFront, "Private motorists", "Routine servicing, MOT preparation, repairs and vehicle health checks."],
                [Sparkles, "Prestige vehicles", "More individual planning, detailed reporting and careful cosmetic attention."],
                [Building2, "Business vehicles", "Practical scheduling and records for vans, company cars and small fleets."],
              ].map(([Icon, title, copy], index) => (
                <FadeUp key={title} delay={index * 0.08}>
                  <article><span><Icon size={22} /></span><div><h3>{title}</h3><p>{copy}</p></div></article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="pw-home-section pw-home-reviews">
          <div className="pw-home-shell">
            <SectionHeading
              eyebrow="Customer experience"
              title="Professional, organised and refreshingly straightforward."
              copy="The kind of workshop experience drivers remember for the right reasons: useful updates, well-explained work and no surprises at collection."
            />
            <div className="pw-home-review-grid">
              <TestimonialCard delay={0} initials="OB" name="Oliver Bennett" vehicle="Volkswagen Golf" quote="The team diagnosed an intermittent fault quickly, explained the repair clearly and had the car ready the same afternoon." />
              <TestimonialCard delay={0.08} initials="AC" name="Amelia Clarke" vehicle="Range Rover Evoque" quote="Booking was simple and the progress updates were excellent. Everything felt organised, polished and very straightforward." />
              <TestimonialCard delay={0.16} initials="JW" name="James Wilson" vehicle="Land Rover Discovery Sport" quote="The air-conditioning issue was resolved properly and the final invoice matched the estimate. A very professional experience." />
            </div>
          </div>
        </section>

        <section className="pw-home-section pw-home-faq">
          <div className="pw-home-shell pw-home-faq__layout">
            <div className="pw-home-faq__intro">
              <SectionHeading
                eyebrow="Frequently asked questions"
                title="Useful answers before you book."
                copy="A few of the practical questions customers usually ask when arranging workshop care."
              />
              <div className="pw-home-faq__help">
                <MessageSquareText size={22} />
                <div><strong>Still need help?</strong><p>Speak to the workshop team and we will point you in the right direction.</p></div>
                <button type="button" onClick={() => navigate("/contact")}>Contact us <ArrowRight size={16} /></button>
              </div>
            </div>
            <div className="pw-home-faq__list">
              {faqs.map((faq, index) => {
                const open = activeFaq === index;
                return (
                  <article key={faq.question} className={open ? "is-open" : ""}>
                    <button type="button" onClick={() => setActiveFaq(open ? -1 : index)} aria-expanded={open}>
                      <span>{faq.question}</span><ChevronDown size={20} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pw-home-final-cta">
          <div className="pw-home-shell pw-home-final-cta__inner">
            <div>
              <span className="pw-home-kicker"><Sparkles size={15} /> Ready when your vehicle is</span>
              <h2>Book with confidence.<br /><span>Drive away informed.</span></h2>
              <p>Start with your registration, choose the support you need and let PrestigeWorkshops organise the rest.</p>
            </div>
            <div className="pw-home-final-cta__actions">
              <button type="button" onClick={() => navigate("/find-vehicle")} className="pw-home-btn pw-home-btn--light"><Search size={18} /> Check a vehicle</button>
              <button type="button" onClick={() => navigate("/contact")} className="pw-home-btn pw-home-btn--ghost">Request a booking <ArrowRight size={18} /></button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const services = [
    [Cog, "Routine service", "Keep your bike smooth, safe and ready for the next ride."],
    [Gauge, "Diagnostics", "Find the real cause behind warning lights and poor performance."],
    [Wrench, "Repair & rebuild", "Clear mechanical repairs, with approval before work begins."],
    [ClipboardCheck, "Bike health check", "A proper inspection before a ride, purchase or season change."],
  ];
  return <div className="tm-page">
    <Header />
    <main>
      <section className="tm-hero"><div className="tm-hero__grid" /><div className="tm-shell tm-hero__content">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="tm-hero__copy">
          <p className="tm-kicker"><span /> BIKE REPAIR · MAINTENANCE · PERFORMANCE</p>
          <h1>Built for the <em>ride.</em><br />Tuned for <em>life.</em></h1>
          <p className="tm-hero__lead">The Mechanic is a bike-first workshop for riders who want honest advice, precise work and a machine that feels right every time they roll on the throttle.</p>
          <div className="tm-hero__actions"><button className="tm-button tm-button--light" onClick={() => navigate("/contact")}>Book your bike <ArrowRight size={18} /></button><button className="tm-text-button" onClick={() => navigate("/services")}>Explore services <ArrowRight size={17} /></button></div>
          <div className="tm-hero__proof"><span><CheckCircle2 size={17} /> Clear estimates</span><span><ShieldCheck size={17} /> Rider-focused care</span><span><CalendarCheck2 size={17} /> Easy booking</span></div>
        </motion.div>
        <motion.div className="tm-hero__visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .85, delay: .08 }}><img src="/the-mechnic-hero-bike.png" alt="Motorcycle from the Race Dynamics reference collection" /><div className="tm-hero__stamp"><span>THE</span><b>MECHANIC</b><small>BIKE WORKSHOP</small></div></motion.div>
      </div></section>
      <section className="tm-intro"><div className="tm-shell tm-intro__grid"><p className="tm-section-label">01 — OUR STANDARD</p><h2>Good bike care<br />is <em>felt</em> on every ride.</h2><div><p>From the first check to the final road test, we make every decision around your bike, your riding and what genuinely needs attention.</p><button className="tm-arrow-link" onClick={() => navigate("/contact")}>Talk to the workshop <ArrowRight size={18} /></button></div></div></section>
      <section className="tm-services"><div className="tm-shell"><div className="tm-section-head"><div><p className="tm-section-label">02 — WHAT WE DO</p><h2>Every mile deserves<br /><em>expert attention.</em></h2></div><button className="tm-button tm-button--outline" onClick={() => navigate("/services")}>All bike services <ArrowRight size={17} /></button></div><div className="tm-service-grid">{services.map(([Icon, title, copy], index) => <motion.article key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}><span>0{index + 1}</span><Icon size={32} /><h3>{title}</h3><p>{copy}</p><button onClick={() => navigate("/contact")} aria-label={`Book ${title}`}><ArrowRight size={18} /></button></motion.article>)}</div></div></section>
      <section className="tm-process"><div className="tm-shell"><div className="tm-process__heading"><p className="tm-section-label">03 — THE PROCESS</p><h2>No surprises.<br /><em>Just better riding.</em></h2></div><div className="tm-process__steps">{[["01", "Tell us about your bike", "Share its make, model, mileage and what you are noticing."], ["02", "We inspect with intent", "We diagnose the cause, not just the symptom."], ["03", "You approve the plan", "You get a clear recommendation and price before work starts."], ["04", "Ride away confident", "Final checks ensure the bike leaves feeling exactly as it should."]].map(([number, title, copy]) => <article key={number}><b>{number}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
      <section className="tm-check"><div className="tm-shell tm-check__inner"><div><p className="tm-section-label">BIKE LOOKUP</p><h2>Start with<br /><em>your bike.</em></h2><p>Already have the registration? Check the available record before you book, so we can help prepare the right visit.</p><button className="tm-button tm-button--light" onClick={() => navigate("/find-vehicle")}><Search size={17} /> Check a bike</button></div><div className="tm-check__mark"><img src="/the-mechnic-logo.png" alt="" /><span>CARE THAT<br />KEEPS YOU<br />MOVING</span></div></div></section>
      <section className="tm-cta"><div className="tm-shell"><Sparkles size={20} /><h2>Your next great ride<br />starts in the workshop.</h2><button className="tm-button tm-button--light" onClick={() => navigate("/contact")}>Request a booking <ArrowRight size={18} /></button></div></section>
    </main><Footer />
  </div>;
}
