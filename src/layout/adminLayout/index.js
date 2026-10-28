import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { getMeAPI } from "../../services/apiServices/authService";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    getMeAPI().then((response) => {
      if (active && response?.success && response?.data) {
        localStorage.setItem("users", JSON.stringify(response.data));
      }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <div className="premium-admin min-h-screen overflow-x-clip">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Header collapsed={collapsed} onOpenMenu={() => setMobileOpen(true)} />
      <main
        className={`min-h-screen min-w-0 pt-[72px] transition-[padding] duration-300 ${collapsed ? "md:pl-20" : "md:pl-64"}`}
      >
        <div className="mx-auto min-w-0 max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-7 lg:py-8">
          <div className="pw-route-view min-w-0">
            {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
