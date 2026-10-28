import { useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BrandLogo from "../../../components/BrandLogo";
import { registerAPI } from "../../../services/apiServices/authService";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

export default function SetupAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const response = await registerAPI({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: "Admin",
    });
    setSubmitting(false);
    if (!response?.success) {
      toast.error(response?.message || "Unable to create the administrator account.");
      return;
    }
    setComplete(true);
    toast.success(response?.message || "Administrator account created.");
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-[980px] overflow-hidden rounded-[28px] border border-[#dce4ef] bg-white shadow-[0_30px_90px_rgba(10,22,40,.16)] lg:grid lg:grid-cols-[.9fr_1.1fr]">
        <aside className="premium-login-panel relative hidden min-h-[660px] overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="premium-login-grid-pattern absolute inset-0 opacity-40" />
          <div className="relative z-10">
            <BrandLogo light />
            <span className="mt-16 inline-flex items-center gap-2 rounded-full border border-[#86a6ff]/30 bg-white/[.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#b4c6ff]"><ShieldCheck size={14} /> Secure first-time setup</span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight">Create the first workshop administrator.</h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">Use this page once after a fresh database migration. Further staff accounts are created from Team Users inside the protected dashboard.</p>
          </div>
          <div className="relative z-10 space-y-3 border-t border-white/10 pt-6 text-sm text-white/70">
            <p className="flex gap-3"><CheckCircle2 className="shrink-0 text-[#86a6ff]" size={17} /> The first registered account is always an Admin.</p>
            <p className="flex gap-3"><CheckCircle2 className="shrink-0 text-[#86a6ff]" size={17} /> Public registration is blocked after setup by default.</p>
          </div>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between gap-3">
            <div className="lg:hidden"><BrandLogo /></div>
            <Link to="/" className="ml-auto inline-flex items-center gap-2 text-sm font-bold text-[#3157d5]"><ArrowLeft size={16} /> Public website</Link>
          </div>

          {complete ? (
            <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={32} /></span>
              <h2 className="mt-6 font-serif text-3xl font-bold text-[#111c34]">Administrator created</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-[#667085]">Your initial account is ready. Return to the website and use the secure sign-in button with the email and password you just created.</p>
              <button type="button" onClick={() => navigate("/", { replace: true })} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0a1628] px-6 text-sm font-bold text-white">Continue to sign in</button>
            </div>
          ) : (
            <>
              <p className="mt-10 text-[11px] font-bold uppercase tracking-[.22em] text-[#3157d5] lg:mt-4">Initial system access</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#111c34] sm:text-4xl">Set up your administrator</h2>
              <p className="mt-3 text-sm leading-6 text-[#667085]">Use a private company email and a strong password containing uppercase, lowercase and a number.</p>

              <form className="mt-8 space-y-5" onSubmit={submit}>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-[#475467]">Full name</span>
                  <span className="prestige-login-field"><UserRound size={18} /><input name="name" value={form.name} onChange={update} minLength={2} maxLength={100} placeholder="Workshop administrator" required /></span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-[#475467]">Email address</span>
                  <span className="prestige-login-field"><Mail size={18} /><input name="email" type="email" value={form.email} onChange={update} placeholder="admin@workshop.co.uk" required /></span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-[#475467]">Password</span>
                  <span className="prestige-login-field"><LockKeyhole size={18} /><input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update} minLength={8} maxLength={128} placeholder="At least 8 characters" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-[#475467]">Confirm password</span>
                  <span className="prestige-login-field"><LockKeyhole size={18} /><input name="confirmPassword" type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={update} minLength={8} maxLength={128} placeholder="Repeat password" required /></span>
                </label>
                <button type="submit" disabled={submitting} className="prestige-login-submit flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#0a1628] px-5 text-sm font-bold text-white disabled:opacity-60">{submitting ? "Creating administrator…" : "Create administrator account"}</button>
              </form>
              <p className="mt-5 text-xs leading-5 text-[#667085]">If an account already exists, the backend will safely reject this public setup request. Use Team Users to manage staff after signing in.</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
