import React, { useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Home, Vehicle, Contact, Services as Service } from "./page/publicSite";
import SetupAdmin from "./page/auth/setup/SetupAdmin";
import { routes } from "./routes/Routes";
import Layout from "./layout/adminLayout";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import SiteLoader from "./components/SiteLoader";
import { AnimatePresence, motion } from "framer-motion";

const prestigeTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3157d5", dark: "#2445b5", light: "#eef3ff", contrastText: "#ffffff" },
    secondary: { main: "#0a1628", dark: "#050d19", light: "#e9eef7", contrastText: "#ffffff" },
    error: { main: "#d92d20" },
    warning: { main: "#f79009" },
    success: { main: "#079455" },
    background: { default: "#f4f7fb", paper: "#ffffff" },
    text: { primary: "#111c34", secondary: "#667085" },
    divider: "#dce4ef",
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
    h1: { fontFamily: '"Manrope", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Manrope", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Manrope", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Manrope", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Manrope", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Manrope", sans-serif', fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#f4f7fb", color: "#111c34" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, minHeight: 44, paddingInline: 18, boxShadow: "none" },
        contained: { boxShadow: "0 12px 28px rgba(49,87,213,.20)" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: 12,
          background: "#ffffff",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3157d5", borderWidth: 1 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { color: "#667085" } } },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundImage: "none" },
      },
    },
  },
});

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      setShowLoader(false);
      document.body.style.overflow = "";
    }, 1900);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <ThemeProvider theme={prestigeTheme}>
      <AnimatePresence>{showLoader && <SiteLoader />}</AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showLoader ? 0 : 1 }}
        transition={{ duration: 0.45 }}
        aria-hidden={showLoader}
      >
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-vehicle" element={<Vehicle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Service />} />
          <Route path="/setup-admin" element={<SetupAdmin />} />

          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            {routes.map(({ path, Component, roles }) => (
              <Route key={path} path={path} element={<RequireRole roles={roles}><Component /></RequireRole>} />
            ))}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
      </motion.div>
    </ThemeProvider>
  );
}

export default App;
