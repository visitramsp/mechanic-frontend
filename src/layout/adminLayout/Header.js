import { useEffect, useMemo, useRef, useState } from "react";
import {
  RiLogoutBoxRLine,
  RiMenuLine,
  RiSearchLine,
  RiUser3Line,
} from "react-icons/ri";
import { ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";
import { logoutAPI } from "../../services/apiServices/authService";

const SEARCH_TARGETS = [
  { terms: ["dashboard", "overview", "home"], to: "/dashboard" },
  { terms: ["customer", "customers", "client", "clients"], to: "/customers" },
  { terms: ["vehicle", "vehicles", "car", "cars"], to: "/vehicles" },
  { terms: ["estimate", "estimates", "quotation", "quote"], to: "/estimates" },
  { terms: ["job", "jobs", "job sheet", "jobsheet", "workshop"], to: "/jobsheets" },
  { terms: ["invoice", "invoices", "billing", "payment"], to: "/invoices" },
  { terms: ["enquiry", "enquiries", "contact", "booking"], to: "/contact-enquiries", roles: ["Admin", "Manager"] },
  { terms: ["dvla", "lookup", "audit"], to: "/dvla-history", roles: ["Admin", "Manager"] },
  { terms: ["user", "users", "staff", "team"], to: "/users", roles: ["Admin"] },
  { terms: ["setting", "settings", "profile"], to: "/settings", roles: ["Admin", "Manager"] },
];

const TITLES = {
  "/dashboard": ["Workshop overview", "A clear view of today’s operation"],
  "/customers": ["Customers", "Relationships, vehicles and service history"],
  "/vehicles": ["Vehicles", "Vehicle records and compliance details"],
  "/estimates": ["Estimates", "Prepare and manage transparent quotations"],
  "/jobsheets": ["Job sheets", "Track workshop work from arrival to handover"],
  "/invoices": ["Invoices", "Billing, VAT and payment records"],
  "/contact-enquiries": ["Website enquiries", "Review and manage public booking requests"],
  "/dvla-history": ["DVLA history", "Registration lookup audit and upstream results"],
  "/users": ["Team users", "Role-based workshop access management"],
  "/settings": ["Settings", "Business preferences and workshop profile"],
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("users") || "{}") || {};
  } catch {
    return {};
  }
};

const getInitials = (name) =>
  String(name || "PW")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "PW";

const Header = ({ collapsed, onOpenMenu }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const lowerPath = pathname.toLowerCase();
  const formTitle = lowerPath.includes("/new")
    ? [lowerPath.includes("customers") ? "Add customer" : lowerPath.includes("vehicles") ? "Add vehicle" : lowerPath.includes("estimates") ? "New estimate" : lowerPath.includes("jobsheets") ? "New job sheet" : "New invoice", "Create a new workshop record"]
    : lowerPath.includes("/edit")
      ? [lowerPath.includes("customers") ? "Edit customer" : lowerPath.includes("vehicles") ? "Edit vehicle" : lowerPath.includes("estimates") ? "Edit estimate" : lowerPath.includes("jobsheets") ? "Edit job sheet" : "Edit invoice", "Update record details"]
      : null;
  const [title, subtitle] = formTitle || TITLES[lowerPath] || ["the Mechanic", "Premium bike workshop management suite"];

  const user = useMemo(() => getStoredUser(), [profileOpen]);
  const displayName = user?.name || user?.fullName || user?.username || "Workshop admin";
  const email = user?.email || "the Mechanic";

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const runGlobalSearch = (event) => {
    if (event.key !== "Enter") return;

    const query = globalSearch.trim().toLowerCase();
    if (!query) return;

    const role = user?.role || "Technician";
    const target = SEARCH_TARGETS.find(
      (item) =>
        (!item.roles || item.roles.includes(role)) &&
        item.terms.some((term) => term.includes(query) || query.includes(term)),
    );

    if (!target) {
      toast.error("Try customers, vehicles, estimates, job sheets or invoices.");
      return;
    }

    navigate(target.to);
    setGlobalSearch("");
    setSearchOpen(false);
  };

  const confirmLogout = async () => {
    await logoutAPI();
    localStorage.removeItem("token");
    localStorage.removeItem("users");
    localStorage.removeItem("rememberWorkshopSession");
    setLogoutOpen(false);
    setProfileOpen(false);
    toast.success("You have been signed out securely.");
    navigate("/", { replace: true });
  };

  return (
    <>
      <header
        className={`prestige-admin-header fixed right-0 top-0 z-20 flex h-[72px] items-center justify-between gap-3 px-3 transition-all duration-300 sm:px-5 lg:px-6 ${collapsed ? "md:left-20" : "md:left-64"} left-0`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dce4ef] bg-white text-[#3157d5] shadow-sm md:hidden"
            aria-label="Open navigation"
          >
            <RiMenuLine className="text-xl" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-bold text-[#111c34] sm:text-lg">{title}</h1>
            <p className="hidden truncate text-xs text-[#667085] sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div
            className={`${searchOpen ? "absolute inset-x-3 top-[78px] flex shadow-xl sm:static sm:w-56" : "hidden lg:flex"} z-30 items-center gap-2 rounded-xl border border-[#dce4ef] bg-[#ffffff] px-3 py-2.5`}
          >
            <RiSearchLine className="shrink-0 text-[#98a2b3]" />
            <input
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              onKeyDown={runGlobalSearch}
              placeholder="Jump to customers, invoices…"
              className="min-w-0 w-full bg-transparent text-sm text-[#344054] outline-none placeholder:text-[#98a2b3]"
              autoFocus={searchOpen}
              aria-label="Quick navigation search"
            />
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#667085] transition hover:bg-white hover:text-[#3157d5] lg:hidden"
            aria-label="Search records"
          >
            <RiSearchLine className="text-lg" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className={`flex h-11 items-center gap-2 rounded-xl border bg-white px-2 shadow-sm transition hover:border-[#3157d5] ${profileOpen ? "border-[#3157d5] ring-4 ring-[#3157d5]/10" : "border-[#dce4ef]"}`}
              aria-label="Account menu"
              aria-expanded={profileOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3157d5] text-[11px] font-bold text-white">
                {getInitials(displayName)}
              </span>
              <span className="hidden max-w-36 text-left xl:block">
                <span className="block truncate text-xs font-bold text-[#111c34]">{displayName}</span>
                <span className="block truncate text-[10px] text-[#98a2b3]">{email}</span>
              </span>
              <ChevronDown
                size={14}
                className={`hidden text-[#98a2b3] transition-transform sm:block ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[min(19rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#dce4ef] bg-[#ffffff] shadow-[0_24px_70px_rgba(10,22,40,.20)]">
                <div className="border-b border-[#e5eaf2] bg-[#f4f7fb] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3157d5] text-sm font-bold text-white">
                      {getInitials(displayName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#111c34]">{displayName}</p>
                      <p className="mt-0.5 truncate text-xs text-[#667085]">{email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#475467] transition hover:bg-[#eef4ff] hover:text-[#3157d5]"
                  >
                    <RiUser3Line className="text-lg" /> Profile & workshop settings
                  </button>
                  <div className="my-1 border-t border-[#e5eaf2]" />
                  <button
                    type="button"
                    onClick={() => setLogoutOpen(true)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#d92d20] transition hover:bg-[#fff1f0]"
                  >
                    <RiLogoutBoxRLine className="text-lg" /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={logoutOpen}
        tone="warning"
        title="Log out of the Mechanic?"
        message="You will return to the public website and will need to sign in again to access workshop records."
        confirmText="Yes, log out"
        cancelText="Stay signed in"
        onClose={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default Header;
