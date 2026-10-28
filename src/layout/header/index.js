import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LogIn, Menu, ShieldCheck, X } from "lucide-react";
import BrandLogo from "../../components/BrandLogo";
import Login from "../../page/auth/Login";

const navItems = [
  { label: "Home", path: "/" }, { label: "Bike check", path: "/find-vehicle" },
  { label: "Bike services", path: "/services" }, { label: "Contact", path: "/contact" },
];

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false); const [mobileOpen, setMobileOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); const location = useLocation(); const isAuthenticated = Boolean(localStorage.getItem("token"));
  useEffect(() => { const check = () => setScrolled(window.scrollY > 16); check(); window.addEventListener("scroll", check, { passive: true }); return () => window.removeEventListener("scroll", check); }, []);
  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [mobileOpen]);
  useEffect(() => { if (!mobileOpen) return undefined; const onKeyDown = (event) => { if (event.key === "Escape") setMobileOpen(false); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [mobileOpen]);
  const go = (path) => { setMobileOpen(false); navigate(path); }; const account = () => { setMobileOpen(false); isAuthenticated ? navigate("/dashboard") : setLoginOpen(true); };
  return <>
    <header className={`tm-header ${scrolled ? "tm-header--solid" : ""}`}><div className="tm-header__inner">
      <button className="tm-header__brand" onClick={() => go("/")} aria-label="the Mechanic home"><BrandLogo /></button>
      <nav className="tm-header__nav" aria-label="Main navigation">{navItems.map((item) => <button key={item.path} className={location.pathname === item.path ? "is-active" : ""} onClick={() => go(item.path)}>{item.label}</button>)}</nav>
      <div className="tm-header__right"><button className="tm-header__login" onClick={account}><LogIn size={16} />{isAuthenticated ? "Dashboard" : "Workshop login"}</button></div>
      <button className="tm-header__menu" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}><Menu size={22} /></button>
    </div></header>
    <AnimatePresence>{mobileOpen && <motion.div className="tm-drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="tm-drawer__backdrop" onClick={() => setMobileOpen(false)} aria-label="Close menu" /><motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 340, damping: 32 }}><div className="tm-drawer__head"><BrandLogo /><button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></button></div><p><ShieldCheck size={16} /> Built for riders who care about every ride.</p><nav>{navItems.map((item) => <button key={item.path} onClick={() => go(item.path)}><span>{item.label}</span><ChevronRight size={18} /></button>)}</nav><button className="tm-button tm-button--dark" onClick={account}>{isAuthenticated ? "Open dashboard" : "Workshop login"}</button></motion.aside></motion.div>}</AnimatePresence>
    <Login open={loginOpen} setOpen={setLoginOpen} />
  </>;
}
