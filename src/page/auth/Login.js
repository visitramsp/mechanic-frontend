import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import BrandLogo from "../../components/BrandLogo";
import { loginAPI } from "../../services/apiServices/authService";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const FEATURES = [
  "Customer and vehicle records in one place",
  "Professional estimates, job sheets and invoices",
  "Secure access for your workshop team",
];

export default function Login({ open, setOpen }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  const closeModal = () => {
    if (!formik.isSubmitting) setOpen(false);
  };

 
const formik = useFormik({
  initialValues: {
    email: "",
    password: "",
  },
  validationSchema: loginSchema,

  onSubmit: async (values, { setSubmitting, resetForm }) => {
    try {
      // Dummy API response for testing
       // const response = await loginAPI(values);
      const response = {
        success: true,
        message: "Login successful",
        token: "dummy-jwt-token-123456",
        user: {
          id: 1,
          name: "John Mechanic",
          email: values.email,
          role: "mechanic",
          phone: "+44 7700 900123",
          status: "active",
        },
      };

      if (!response.success) {
        toast.error(
          response.message || "The email or password is incorrect."
        );
        return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("users", JSON.stringify(response.user));
      localStorage.setItem(
        "rememberWorkshopSession",
        String(rememberMe)
      );

      resetForm();
      setOpen(false);

      toast.success(response.message || "Welcome to the Mechanic");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      toast.error(
        error?.response?.data?.message ||
          "We could not sign you in. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  },
});


  const fieldClass = (name) => {
    const hasError = formik.touched[name] && formik.errors[name];
    return `prestige-login-field ${hasError ? "has-error" : ""}`;
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      maxWidth="md"
      className="prestige-dialog"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "920px",
          margin: { xs: "8px", sm: "20px", md: "24px" },
          maxHeight: { xs: "calc(100dvh - 16px)", sm: "calc(100dvh - 40px)", md: "92vh" },
          borderRadius: { xs: "24px", sm: "30px" },
          overflow: "hidden",
          background: "#ffffff",
          border: "1px solid rgba(255,255,255,.75)",
          boxShadow: "0 40px 120px rgba(5, 13, 25, .48)",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(5, 13, 25, .74)",
          backdropFilter: "blur(12px)",
        },
      }}
      aria-labelledby="prestige-login-title"
    >
      <div className="premium-login-grid relative grid min-h-[610px] lg:grid-cols-[.92fr_1.08fr]">
        <aside className="premium-login-panel relative hidden overflow-hidden p-9 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="premium-login-grid-pattern absolute inset-0 opacity-40" />
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-[#86a6ff]/20" />

          <div className="relative z-10">
            <BrandLogo light />
            <div className="mt-16 inline-flex items-center gap-2 rounded-full border border-[#86a6ff]/30 bg-white/[.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#b4c6ff]">
              <Sparkles size={13} /> Workshop command suite
            </div>
            <h2 className="mt-5 max-w-sm font-serif text-4xl font-bold leading-[1.08]">
              Run every workshop detail with confidence.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/62">
              A refined workspace for premium bike care, customer service and operational control.
            </p>

            <div className="mt-9 space-y-4">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-white/78">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#86a6ff]" size={17} />
                  <span className="leading-6">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.08] text-[#86a6ff]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-xs font-bold text-white">Protected workshop access</p>
              <p className="mt-0.5 text-[11px] text-white/45">Your session is handled securely.</p>
            </div>
          </div>
        </aside>

        <section className="relative flex min-w-0 flex-col bg-[#ffffff] px-5 py-6 sm:px-9 sm:py-8 lg:px-12 lg:py-10">
          <button
            type="button"
            onClick={closeModal}
            disabled={formik.isSubmitting}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce4ef] bg-white text-[#667085] transition hover:border-[#3157d5] hover:bg-[#f4f7fb] hover:text-[#0a1628] disabled:opacity-50 sm:right-6 sm:top-6"
            aria-label="Close login"
          >
            <X size={18} />
          </button>

          <div className="pr-12 lg:hidden">
            <BrandLogo />
          </div>

          <div className="mt-10 lg:mt-4">
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#3157d5]">
              Private client area
            </p>
            <h1 id="prestige-login-title" className="mt-3 font-serif text-3xl font-bold text-[#111c34] sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Sign in to manage customers, vehicles and workshop operations.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="login-email" className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-[#475467]">
                Email address
              </label>
              <div className={fieldClass("email")}>
                <Mail size={18} className="shrink-0" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1.5 text-xs font-medium text-[#d92d20]">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="text-[11px] font-bold uppercase tracking-[.14em] text-[#475467]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-bold text-[#3157d5] transition hover:text-[#0a1628]"
                  onClick={() => toast("Please contact your workshop administrator to reset access.")}
                >
                  Forgot password?
                </button>
              </div>
              <div className={fieldClass("password")}>
                <LockKeyhole size={18} className="shrink-0" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(formik.touched.password && formik.errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#667085] transition hover:bg-[#eef3ff] hover:text-[#0a1628]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1.5 text-xs font-medium text-[#d92d20]">{formik.errors.password}</p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-[#66736d]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="prestige-checkbox h-4 w-4 rounded border-[#c7d2e3]"
              />
              Keep me signed in on this device
            </label>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="prestige-login-submit group flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[#050d19] bg-[#0a1628] px-5 py-3.5 text-sm font-bold text-white shadow-[0_16px_34px_rgba(49,87,213,.24)] transition hover:-translate-y-0.5 hover:bg-[#050d19] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {formik.isSubmitting ? "Signing in…" : "Sign in securely"}
              {!formik.isSubmitting && <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-auto pt-8 text-center">
            <p className="text-sm text-[#667085]">
              Fresh installation?{" "}
              <button
                type="button"
                className="font-bold text-[#3157d5] transition hover:text-[#0a1628]"
                onClick={() => {
                  setOpen(false);
                  navigate("/setup-admin");
                }}
              >
                Create the first administrator
              </button>
            </p>
          </div>
        </section>
      </div>
    </Dialog>
  );
}
