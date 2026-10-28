import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo";

const socialLinks = [
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "Facebook", icon: FaFacebook, href: "#" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "#" },
  { label: "WhatsApp", icon: RiWhatsappFill, href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#dce4ef] bg-white text-[#0a1728]">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-12 lg:grid-cols-[1.35fr_.75fr_.8fr_1fr]">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-md text-sm leading-7 text-[#69768a]">
            Bike-first repair, careful maintenance and a workshop experience shaped around riders and their machines.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d9e3f1] bg-[#f6f9fd] px-3 py-2 text-xs font-bold text-[#44536a]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Bike workshop enquiries open
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#315fe6]">Explore</p>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-[#5f6d82]">
            <Link className="transition-colors hover:text-[#315fe6]" to="/">Home</Link>
            <Link className="transition-colors hover:text-[#315fe6]" to="/find-vehicle">Bike check</Link>
            <Link className="transition-colors hover:text-[#315fe6]" to="/services">Bike services</Link>
            <Link className="transition-colors hover:text-[#315fe6]" to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#315fe6]">The workshop</p>
          <p className="mt-4 text-sm leading-6 text-[#66758a]">Motorcycle servicing, repairs and performance care</p>
          <p className="mt-2 text-sm leading-6 text-[#66758a]">Send an enquiry to arrange your next visit.</p>
        </div>

        <div className="lg:justify-self-end">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#315fe6]">Follow the Mechanic</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#66758a]">Bike-care advice, workshop updates and behind-the-scenes service content.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="group flex min-w-[172px] items-center gap-3 rounded-xl border border-[#dce4ef] bg-[#f9fbfe] px-3 py-2.5 text-sm font-bold text-[#46566d] transition-all hover:-translate-y-0.5 hover:border-[#b8c8f3] hover:bg-[#eef3ff] hover:text-[#315fe6]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#d8e3fb] bg-white text-[#315fe6] transition-transform group-hover:scale-105">
                  <Icon size={17} />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#e2e8f1] bg-[#f7f9fc] px-6 py-4">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-2 text-center text-xs text-[#7c8798] sm:flex-row sm:text-left">
          <span>© {new Date().getFullYear()} the Mechanic. All rights reserved.</span>
          <span>Bike repair · Clear estimates · Digital records</span>
        </div>
      </div>
    </footer>
  );
}
