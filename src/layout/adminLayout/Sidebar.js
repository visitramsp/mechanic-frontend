import { NavLink } from "react-router-dom";
import {
  RiCarLine,
  RiDashboardLine,
  RiFileListLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiSettings3Line,
  RiUserLine,
  RiTeamLine,
  RiMessage2Line,
  RiHistoryLine,
} from "react-icons/ri";
import { FileText, Wrench, X } from "lucide-react";
import BrandLogo from "../../components/BrandLogo";

const NAV = [
  { to: "/dashboard", icon: RiDashboardLine, label: "Overview" },
  { to: "/customers", icon: RiUserLine, label: "Customers" },
  { to: "/vehicles", icon: RiCarLine, label: "Vehicles" },
  { to: "/estimates", icon: RiFileListLine, label: "Estimates" },
  { to: "/jobSheets", icon: Wrench, label: "Job sheets" },
  { to: "/invoices", icon: FileText, label: "Invoices" },
  { to: "/contact-enquiries", icon: RiMessage2Line, label: "Website enquiries", roles: ["Admin", "Manager"] },
  { to: "/dvla-history", icon: RiHistoryLine, label: "DVLA history", roles: ["Admin", "Manager"] },
  { to: "/users", icon: RiTeamLine, label: "Team users", roles: ["Admin"] },
  { to: "/settings", icon: RiSettings3Line, label: "Settings", roles: ["Admin", "Manager"] },
];

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("users") || "{}"); } catch { return {}; }
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const widthClass = collapsed ? "md:w-20" : "md:w-64";
  const user = getStoredUser();
  const role = user?.role || "Technician";
  const visibleNav = NAV.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <>
      {mobileOpen && (
        <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-[#061326]/55 backdrop-blur-[3px] md:hidden" />
      )}
      <aside className={`prestige-sidebar fixed left-0 top-0 z-40 flex h-[100dvh] w-[min(18rem,88vw)] flex-col transition-all duration-300 ${widthClass} ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-4">
          <BrandLogo compact={collapsed} light className="overflow-hidden" />
          <button type="button" onClick={() => setMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/70 md:hidden" aria-label="Close navigation"><X size={18} /></button>
        </div>
        {/* <div className={`px-4 pt-6 ${collapsed ? "md:hidden" : ""}`}>
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#86a6ff]">Workshop command</p>
          <p className="mt-2 text-xs leading-relaxed text-white/45">Premium service operations, kept beautifully organised.</p>
        </div> */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {visibleNav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `sidebar-nav-link ${isActive ? "active" : ""} flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all`}>
              <Icon className="shrink-0 text-lg" size={18} />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="shrink-0 border-t border-white/10 p-3">
          {/* {!collapsed && (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[.055] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#86a6ff] text-xs font-extrabold text-[#0a1628]">{String(user?.name || "PW").split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</div>
              <div className="min-w-0"><div className="truncate text-xs font-bold text-white">{user?.name || "the Mechnic team"}</div><div className="truncate text-[10px] text-white/45">{role}</div></div>
            </div>
          )} */}
          <button type="button" onClick={() => setCollapsed((value) => !value)} className="hidden w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-white/55 transition hover:bg-white/[.06] hover:text-white md:flex">
            {collapsed ? <RiMenuUnfoldLine className="text-lg" /> : <><RiMenuFoldLine className="text-lg" /><span>Collapse menu</span></>}
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
