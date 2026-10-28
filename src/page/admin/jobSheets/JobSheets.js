import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiEyeLine, RiFileTextLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BtnBlue, Card, LoadingState, PageHeader, Pagination, RegPlate, Table } from "../../../components/ui/UI";
import useDebounce from "../../../components/useDebounce";
import { fetchJobSheetById, fetchJobSheets } from "../../../services/apiServices/jobSheetService";
import { createInvoiceFromJobSheet } from "../../../services/apiServices/invoiceService";
import PriorityStatusUpdate from "./component/PriorityStatusUpdate";
import StatusUpdate from "./component/StatusUpdate";
import JobSheetsDetailModal from "./JobSheetsDetailModal";

export default function JobSheets() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatingInvoice, setCreatingInvoice] = useState(null);
  const [viewing, setViewing] = useState(null);
  const query = useDebounce(search);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    const response = await fetchJobSheets({ search: query, status, priority, page, limit: 20 });
    if (response?.success) { setRecords(response.data || []); setMeta(response.meta || { page, pages: 1, total: response.data?.length || 0, limit: 20 }); }
    else toast.error(response?.message || "Unable to load job sheets");
    setLoading(false);
  }, [query, status, priority]);
  useEffect(() => { load(1); }, [load]);

  const openJobSheet = async (job) => {
    const loadingToast = toast.loading("Loading job sheet details…");
    try {
      const response = await fetchJobSheetById(job.id);
      if (response?.success) setViewing(response.data);
      else toast.error(response?.message || "Unable to load job sheet details");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const makeInvoice = async (job) => {
    setCreatingInvoice(job.id);
    const response = await createInvoiceFromJobSheet(job.id);
    if (response?.success) {
      toast.success(response.message || "Invoice created from job sheet");
      navigate(`/invoices/${response.data?.id || response.data?.invoiceNumber}/edit`, { state: { record: response.data, from: "/jobSheets" } });
    } else toast.error(response?.message || "Unable to create invoice");
    setCreatingInvoice(null);
  };

  const actionButtons = (job, compact = false) => <>
    <button className={compact ? "pw-icon-button" : ""} onClick={() => openJobSheet(job)}><RiEyeLine />{!compact && " View"}</button>
    <button className={compact ? "pw-icon-button" : ""} onClick={() => navigate(`/jobSheets/${job.id}/edit`, { state: { record: job, from: "/jobSheets" } })}><RiEditLine />{!compact && " Edit"}</button>
    {job.status === "Completed" && <button disabled={creatingInvoice === job.id} className={compact ? "pw-icon-button pw-icon-button--success" : "success"} onClick={() => makeInvoice(job)}><RiFileTextLine />{!compact && (creatingInvoice === job.id ? " Creating…" : " Invoice")}</button>}
  </>;

  return <div className="space-y-5">
    <PageHeader title="Job sheets" sub={`${meta.total || 0} workshop jobs`} action={<BtnBlue onClick={() => navigate("/jobSheets/new", { state: { from: "/jobSheets" } })}><RiAddLine /> Manual job sheet</BtnBlue>} />
    <Card className="overflow-hidden"><div className="pw-list-toolbar"><div className="pw-search-box"><RiSearchLine /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search job, technician or advisor" /></div><div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><select className="pw-control pw-select sm:max-w-44" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select><select className="pw-control pw-select sm:max-w-44" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option>Open</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></select></div></div>
      {loading ? <LoadingState label="Loading job sheets…" /> : <>
        <div className="pw-mobile-records">{records.map((job) => <article className="pw-record-card" key={job.id}><div className="flex items-start justify-between gap-3"><div><p className="pw-eyebrow">{job.jobNumber || `Job #${job.id}`}</p><h3>{job.customer?.name || "Unknown customer"}</h3><p>{job.startDate ? moment(job.startDate).format("DD MMM YYYY") : "Start date not set"}</p></div><StatusUpdate title={job.status} id={job.id} jobSheetsList={() => load(meta.page)} /></div><div className="pw-record-details"><span><RegPlate reg={job.vehicle?.registrationNumber || job.vehicle?.model} /></span><span>Technician: {job.technicianName || "—"}</span><span>Advisor: {job.serviceAdvisor || "—"}</span><span>Total: £{Number(job.total || 0).toFixed(2)}</span></div><div className="flex items-center justify-between gap-3"><PriorityStatusUpdate title={job.priority} id={job.id} jobSheetsList={() => load(meta.page)} /><div className="pw-record-actions !border-0 !pt-0">{actionButtons(job)}</div></div></article>)}</div>
        <div className="pw-desktop-table"><Table headers={["Job sheet", "Customer", "Vehicle", "Start date", "Advisor", "Technician", "Total", "Priority", "Status", "Actions"]} empty={!records.length ? "No job sheets found" : null}>{records.map((job) => <tr key={job.id}><td className="font-mono font-bold text-[#3157d5]">{job.jobNumber || `#${job.id}`}</td><td className="font-semibold">{job.customer?.name || "—"}</td><td><RegPlate reg={job.vehicle?.registrationNumber || job.vehicle?.model} /></td><td>{job.startDate ? moment(job.startDate).format("DD MMM YYYY") : "—"}</td><td>{job.serviceAdvisor || "—"}</td><td>{job.technicianName || "—"}</td><td className="font-mono font-bold">£{Number(job.total || 0).toFixed(2)}</td><td><PriorityStatusUpdate title={job.priority} id={job.id} jobSheetsList={() => load(meta.page)} /></td><td><StatusUpdate title={job.status} id={job.id} jobSheetsList={() => load(meta.page)} /></td><td><div className="flex gap-2">{actionButtons(job, true)}</div></td></tr>)}</Table></div>
        <Pagination meta={meta} disabled={loading} onPageChange={load} />
      </>}
    </Card>
    {viewing && <JobSheetsDetailModal setViewing={setViewing} viewing={viewing} />}
  </div>;
}
