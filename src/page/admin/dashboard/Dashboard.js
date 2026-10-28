import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { BtnBlue, Card, LoadingState, PageHeader, StatCard } from "../../../components/ui/UI";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  RiArrowRightLine, RiCarLine, RiFileList3Line, RiMoneyPoundCircleLine, RiUserAddLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../../services/apiServices/dashboardService";

const ICONS = { estimate: "📋", job: "🔧", invoice: "🧾", customer: "👤" };
const STATUS_COLOURS = { Open: "#3157d5", "In Progress": "#f79009", Completed: "#079455", Cancelled: "#d92d20" };
const money = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(value || 0));

const quickActions = [
  { label: "Add customer", description: "Create a new customer record", icon: RiUserAddLine, to: "/customers/new" },
  { label: "Add vehicle", description: "Register a customer vehicle", icon: RiCarLine, to: "/vehicles/new" },
  { label: "New estimate", description: "Prepare a quotation", icon: RiFileList3Line, to: "/estimates/new" },
  { label: "New invoice", description: "Create a VAT invoice", icon: RiMoneyPoundCircleLine, to: "/invoices/new" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const response = await fetchDashboard();
      if (!active) return;
      if (response?.success) setData(response.data);
      else toast.error(response?.message || "Unable to load dashboard");
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const metrics = data?.metrics || {};
  const jobStatusData = useMemo(() => (data?.jobStatusData || []).map((item) => ({
    ...item, color: STATUS_COLOURS[item.name] || "#7f56d9",
  })), [data]);
  const jobTotal = jobStatusData.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const revenueData = useMemo(() => (data?.revenueData || []).map((item) => ({
    ...item,
    label: moment(item.month, "YYYY-MM").isValid() ? moment(item.month, "YYYY-MM").format("MMM") : item.month,
  })), [data]);
  const activities = data?.activities || [];
  let currentRole = "Technician";
  try { currentRole = JSON.parse(localStorage.getItem("users") || "{}").role || "Technician"; } catch {}
  const canManageEnquiries = ["Admin", "Manager"].includes(currentRole);

  if (loading && !data) return <Card><LoadingState label="Loading workshop overview…" /></Card>;

  return (
    <div className="space-y-5 fade-up sm:space-y-6">
      <PageHeader
        title="Workshop overview"
        sub="Live customers, workshop activity, payments and revenue from your backend."
        action={<BtnBlue onClick={() => navigate("/estimates/new", { state: { from: "/estimates" } })}>New estimate <RiArrowRightLine /></BtnBlue>}
      />

      <section className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="👥" label="Total customers" value={Number(metrics.totalCustomers || 0).toLocaleString()} />
        <StatCard icon="🚗" label="Total vehicles" value={Number(metrics.totalVehicles || 0).toLocaleString()} />
        <StatCard icon="🔧" label="Open job sheets" value={Number(metrics.openJobs || 0).toLocaleString()} />
        <StatCard icon="✅" label="Completed jobs" value={Number(metrics.completedJobs || 0).toLocaleString()} />
      </section>

      <section className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="📋" label="Pending estimates" value={Number(metrics.pendingEstimates || 0).toLocaleString()} />
        <Card className="pw-metric-card">
          <p className="pw-eyebrow">Unpaid invoices</p>
          <strong>{Number(metrics.unpaidInvoices || 0).toLocaleString()}</strong>
          <span className="text-[#d92d20]">{money(metrics.outstandingAmount)} outstanding</span>
          <button type="button" onClick={() => navigate("/invoices")}>View invoices <RiArrowRightLine /></button>
        </Card>
        <Card className="pw-metric-card"><p className="pw-eyebrow">Today’s revenue</p><strong>{money(metrics.todayRevenue)}</strong><span className="text-emerald-700">Recorded payments today</span></Card>
        <Card className="pw-metric-card"><p className="pw-eyebrow">Month revenue</p><strong>{money(metrics.monthRevenue)}</strong><span className="text-emerald-700">Recorded payments this month</span></Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-5">
        <Card className="min-w-0 p-4 sm:p-6 xl:col-span-2">
          <div className="mb-5"><p className="pw-eyebrow">Financial performance</p><h2 className="mt-1 text-base font-extrabold text-[#111c34] sm:text-lg">Monthly revenue</h2></div>
          <div className="h-[230px] min-w-0 sm:h-[280px]">
            {revenueData.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={revenueData} barSize={28} margin={{ top: 5, right: 0, left: -18, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#e8edf5" vertical={false} /><XAxis dataKey="label" tick={{ fontSize: 11, fill: "#98a2b3" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "#98a2b3" }} axisLine={false} tickLine={false} tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} /><Tooltip formatter={(value) => [money(value), "Revenue"]} contentStyle={{ borderRadius: 14, border: "1px solid #dce4ef", boxShadow: "0 16px 42px rgba(10,22,40,.12)" }} /><Bar dataKey="revenue" fill="#3157d5" radius={[8, 8, 2, 2]} /></BarChart></ResponsiveContainer> : <LoadingState label="Revenue appears after payments are recorded." />}
          </div>
        </Card>

        <Card className="min-w-0 p-4 sm:p-6">
          <p className="pw-eyebrow">Workshop progress</p><h2 className="mt-1 text-base font-extrabold text-[#111c34] sm:text-lg">Job status overview</h2>
          <div className="mt-2 h-[180px] min-w-0">{jobStatusData.length ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={jobStatusData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">{jobStatusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #dce4ef" }} /></PieChart></ResponsiveContainer> : <LoadingState label="No job sheets yet." />}</div>
          <div className="grid gap-2">{jobStatusData.map((item) => <div key={item.name} className="flex items-center justify-between gap-3 text-xs"><div className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} /><span className="truncate text-[#667085]">{item.name}</span></div><strong className="shrink-0 text-[#344054]">{item.value} ({jobTotal ? Math.round((item.value / jobTotal) * 100) : 0}%)</strong></div>)}</div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-5">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-[#e5eaf2] px-4 py-4 sm:px-6"><div><p className="pw-eyebrow">Live feed</p><h2 className="mt-1 text-base font-extrabold text-[#111c34] sm:text-lg">Recent activity</h2></div></div>
          <div className="divide-y divide-[#edf1f6] px-4 sm:px-6">{activities.length ? activities.map((activity) => <article key={activity.id} className="flex min-w-0 items-start gap-3 py-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-base">{ICONS[activity.icon] || "📌"}</span><div className="min-w-0 flex-1"><p className="text-sm leading-6 text-[#475467]">{activity.text}</p><time className="mt-1 block text-xs text-[#98a2b3] sm:hidden">{moment(activity.time).fromNow()}</time></div><time className="hidden shrink-0 pt-1 text-xs text-[#98a2b3] sm:block">{moment(activity.time).fromNow()}</time></article>) : <LoadingState label="Recent activity will appear here." />}</div>
        </Card>
        <Card className="p-4 sm:p-6"><p className="pw-eyebrow">Create record</p><h2 className="mt-1 text-base font-extrabold text-[#111c34] sm:text-lg">Quick actions</h2><div className="mt-4 grid gap-2">{quickActions.map(({ label, description, icon: Icon, to }) => <button key={label} type="button" onClick={() => navigate(to, { state: { from: to.split("/new")[0] || "/dashboard" } })} className="pw-quick-action"><span><Icon /></span><span className="min-w-0 flex-1 text-left"><strong>{label}</strong><small>{description}</small></span><RiArrowRightLine className="shrink-0" /></button>)}</div>{canManageEnquiries && <button type="button" onClick={() => navigate("/contact-enquiries")} className="mt-3 w-full rounded-xl border border-[#dce4ef] bg-[#f8fafc] px-3 py-2.5 text-xs font-bold text-[#3157d5]">{Number(metrics.newEnquiries || 0)} new website enquiries</button>}</Card>
      </section>
    </div>
  );
}
