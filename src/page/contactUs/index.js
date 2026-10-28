import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import "../publicPages.css";
import toast from "react-hot-toast";
import { submitContactEnquiry } from "../../services/apiServices/contactService";

const contactHighlights = [
  {
    icon: MessageSquareText,
    title: "Clear first response",
    copy: "Tell us what the vehicle is doing and we will help identify the right appointment type.",
  },
  {
    icon: CalendarCheck2,
    title: "Practical booking support",
    copy: "Share your preferred day and we will confirm suitable workshop availability.",
  },
  {
    icon: ShieldCheck,
    title: "No work without approval",
    copy: "Additional repairs are explained and agreed before they are carried out.",
  },
];

export default function Contact() {
  const [formStatus, setFormStatus] = useState("idle");

  const submitForm = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setFormStatus("loading");
    const response = await submitContactEnquiry({
      firstName: String(form.get("firstName") || "").trim(),
      lastName: String(form.get("lastName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      registration: String(form.get("registration") || "").trim().toUpperCase(),
      service: String(form.get("service") || "").trim(),
      message: String(form.get("message") || "").trim(),
      consent: true,
      source: "website",
    });
    if (!response?.success) {
      setFormStatus("idle");
      toast.error(response?.message || "We could not send your enquiry. Please try again.");
      return;
    }
    formElement.reset();
    setFormStatus("done");
    toast.success(response?.message || "Your enquiry has been received.");
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
              transition={{ duration: .65, ease: [0.22, 1, .36, 1] }}
            >
              <span className="pw-public-eyebrow">Contact the Mechanic</span>
              <h1>Speak with a team that <span>listens first.</span></h1>
              <p className="pw-public-hero__lead">
                Ask about servicing, MOT preparation, diagnostics, repairs or ongoing fleet support. Share the vehicle details and we will help you understand the most suitable next step.
              </p>
              <div className="pw-public-hero__chips">
                <span><Clock3 size={15} /> Mon–Sat · 08:00–18:00</span>
                <span><Phone size={15} /> UK workshop support</span>
                <span><ShieldCheck size={15} /> Clear approval process</span>
              </div>
            </motion.div>

            <motion.aside
              className="pw-public-hero__panel pw-contact-hero__panel"
              initial={{ opacity: 0, x: 34 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: .7, delay: .08, ease: [0.22, 1, .36, 1] }}
            >
              {contactHighlights.map(({ icon: Icon, title, copy }) => (
                <article key={title}>
                  <span><Icon size={20} /></span>
                  <div><strong>{title}</strong><p>{copy}</p></div>
                </article>
              ))}
            </motion.aside>
          </div>
        </section>

        <section className="pw-public-section">
          <div className="pw-public-shell pw-contact-layout">
            <div className="pw-contact-info-stack">
              <motion.article
                className="pw-contact-info-card"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: .5 }}
              >
                <span className="pw-public-eyebrow">Workshop details</span>
                <h3>Contact the team directly</h3>
                <p>Use whichever method is most convenient. Including the registration and mileage helps us respond more accurately.</p>
                <div className="pw-contact-info-card__list">
                  <a href="tel:+442079460128">
                    <Phone size={18} />
                    <span><small>Telephone</small><strong>+44 (0)20 7946 0128</strong></span>
                  </a>
                  <a href="mailto:hello@prestigeworkshops.com">
                    <Mail size={18} />
                    <span><small>Email</small><strong>hello@prestigeworkshops.com</strong></span>
                  </a>
                  <div>
                    <Clock3 size={18} />
                    <span><small>Opening hours</small><strong>Monday–Saturday · 08:00–18:00</strong></span>
                  </div>
                  <div>
                    <MapPin size={18} />
                    <span><small>Workshop support</small><strong>Bike repair, service and diagnostics</strong></span>
                  </div>
                </div>
              </motion.article>

              <motion.article
                className="pw-contact-area-card"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: .5, delay: .07 }}
              >
                <div className="pw-contact-area-card__copy">
                  <span className="pw-public-eyebrow">Workshop coverage</span>
                  <h3>Supporting riders with service, repair and practical advice.</h3>
                  <p>Collection and delivery can be discussed for suitable bookings and local business fleets.</p>
                </div>
                <motion.span
                  className="pw-contact-area-card__pin"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin size={23} />
                </motion.span>
              </motion.article>
            </div>

            <motion.article
              className="pw-contact-form"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .55, delay: .05 }}
            >
              <AnimatePresence mode="wait">
                {formStatus !== "done" ? (
                  <motion.form key="form" onSubmit={submitForm} initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                    <span className="pw-public-eyebrow">Send an enquiry</span>
                    <h2>Tell us about your vehicle.</h2>
                    <p className="pw-contact-form__lead">Provide as much detail as you can. The form is designed for service bookings, warning lights, repair questions and general workshop enquiries.</p>

                    <div className="pw-form-grid">
                      <div className="pw-form-field">
                        <label htmlFor="firstName">First name</label>
                        <input id="firstName" name="firstName" placeholder="First name" required />
                      </div>
                      <div className="pw-form-field">
                        <label htmlFor="lastName">Last name</label>
                        <input id="lastName" name="lastName" placeholder="Last name" required />
                      </div>
                      <div className="pw-form-field">
                        <label htmlFor="email">Email address</label>
                        <input id="email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div className="pw-form-field">
                        <label htmlFor="phone">Telephone</label>
                        <input id="phone" name="phone" type="tel" placeholder="+44 7700 900123" required />
                      </div>
                      <div className="pw-form-field">
                        <label htmlFor="registration">Registration</label>
                        <input id="registration" name="registration" placeholder="YY59 UAD" />
                      </div>
                      <div className="pw-form-field">
                        <label htmlFor="service">Enquiry type</label>
                        <select id="service" name="service" defaultValue="" required>
                          <option value="" disabled>Select an option</option>
                          <option>MOT preparation</option>
                          <option>Interim or full service</option>
                          <option>Diagnostics and warning lights</option>
                          <option>Brakes, tyres or suspension</option>
                          <option>Air conditioning or electrical</option>
                          <option>Fleet support</option>
                          <option>Other enquiry</option>
                        </select>
                      </div>
                      <div className="pw-form-field is-full">
                        <label htmlFor="message">Vehicle details and message</label>
                        <textarea id="message" name="message" placeholder="Tell us the mileage, symptoms, warning lights and preferred booking date..." required />
                      </div>
                    </div>

                    <div className="pw-contact-form__foot">
                      <p>By submitting this form, you agree that the workshop may contact you about this enquiry.</p>
                      <button type="submit" className="pw-public-button pw-public-button--primary" disabled={formStatus === "loading"}>
                        {formStatus === "loading" ? "Sending enquiry…" : <>Send enquiry <ArrowRight size={17} /></>}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="pw-contact-success"
                    initial={{ opacity: 0, scale: .97 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div>
                      <span><CheckCircle2 size={28} /></span>
                      <h3>Your enquiry has been received.</h3>
                      <p>Thank you. A member of the Mechanic team will review the details and respond during normal opening hours.</p>
                      <button type="button" className="pw-public-button pw-public-button--secondary" style={{ marginTop: "1.2rem" }} onClick={() => setFormStatus("idle")}>Send another enquiry</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          </div>
        </section>

        <section className="pw-public-section pw-public-process">
          <div className="pw-public-shell">
            <div className="pw-public-heading is-centred">
              <span className="pw-public-eyebrow">What happens next</span>
              <h2>A clear response without unnecessary back-and-forth.</h2>
              <p>The workshop uses your information to recommend the right booking and identify any details needed before the vehicle arrives.</p>
            </div>
            <div className="pw-public-process__grid">
              {[
                ["01", "We review the vehicle details", "Registration, mileage and symptoms help the team understand the likely requirement."],
                ["02", "We confirm the appointment type", "You receive guidance on the most suitable service, diagnostic or inspection booking."],
                ["03", "Availability is discussed", "The team confirms practical dates, expected timing and anything to bring with the vehicle."],
                ["04", "The visit is prepared", "The workshop has a clearer brief before the vehicle arrives, helping the day run smoothly."],
              ].map(([number, title, copy], index) => (
                <motion.article
                  className="pw-public-process-card"
                  key={number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: .45, delay: index * .06 }}
                >
                  <span>STEP {number}</span>
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
              <h2>Prefer to speak with someone?</h2>
              <p>Call the workshop during opening hours and have the registration, mileage and a brief description of the issue ready.</p>
            </div>
            <div className="pw-public-cta__actions">
              <a className="pw-public-button pw-public-button--primary" href="tel:+442079460128"><Phone size={17} /> Call +44 (0)20 7946 0128</a>
              <a className="pw-public-button pw-public-button--secondary" href="mailto:hello@prestigeworkshops.com"><Mail size={17} /> Send an email</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
