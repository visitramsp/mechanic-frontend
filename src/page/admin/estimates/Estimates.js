import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiEyeLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Badge, BtnBlue, Card, LoadingState, PageHeader, Pagination, RegPlate, Select, Table } from "../../../components/ui/UI";
import ConfirmDialog from "../../../components/ConfirmDialog";
import useDebounce from "../../../components/useDebounce";
import { approvedEstimates, deleteEstimates, fetchEstimateById, fetchEstimates } from "../../../services/apiServices/estimateService";
import ViewItemDetailsModal from "./ViewItemDetailsModal";

export default function Estimates() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const query = useDebounce(search);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    const response = await fetchEstimates({ search: query, status, page, limit: 20 });
    if (response?.success) { setRecords(response.data || []); setMeta(response.meta || { page, pages: 1, total: response.data?.length || 0, limit: 20 }); }
    else toast.error(response?.message || "Unable to load estimates");
    setLoading(false);
  }, [query, status]);
  useEffect(() => { load(1); }, [load]);

  const openEstimate = async (estimate) => {
    const loadingToast = toast.loading("Loading estimate details…");
    try {
      const response = await fetchEstimateById(estimate.id);
      if (response?.success) setViewing(response.data);
      else toast.error(response?.message || "Unable to load estimate details");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const updateStatus = async (id, nextStatus) => {
    const response = await approvedEstimates(id, { status: nextStatus });
    if (response?.success) { toast.success(nextStatus === "Approved" ? "Estimate approved and job sheet created" : response.message || "Status updated"); load(meta.page); }
    else toast.error(response?.message || "Unable to update status");
  };
  const remove = async () => {
    const response = await deleteEstimates(deleteId);
    if (response?.success) { toast.success(response.message || "Estimate deleted"); setDeleteId(null); load(meta.page); }
    else toast.error(response?.message || "Unable to delete estimate");
  };

  return <div className="space-y-5">
    <PageHeader title="Estimates" sub={`${meta.total || 0} quotations across all statuses`} action={<BtnBlue onClick={() => navigate("/estimates/new", { state: { from: "/estimates" } })}><RiAddLine /> New estimate</BtnBlue>} />
    <Card className="overflow-hidden"><div className="pw-list-toolbar"><div className="pw-search-box"><RiSearchLine /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search estimate, order number or advisor" /></div><select className="pw-control pw-select sm:max-w-48" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option>Draft</option><option>Sent</option><option>Approved</option><option>Rejected</option></select></div>
      {loading ? <LoadingState label="Loading estimates…" /> : <>
        <div className="pw-mobile-records">{records.map((est) => <article className="pw-record-card" key={est.id}><div className="flex items-start justify-between gap-3"><div><p className="pw-eyebrow">{est.estimateNumber || `Estimate #${est.id}`}</p><h3>{est.customer?.name || "Unknown customer"}</h3><p>{moment(est.estimateDate).format("DD MMM YYYY")}</p></div><Badge status={est.status} /></div><div className="pw-record-details"><span><RegPlate reg={est.vehicle?.registrationNumber || est.vehicle?.model} /></span><span>Total: £{Number(est.total || 0).toFixed(2)}</span><span>Valid until: {est.validUntil ? moment(est.validUntil).format("DD MMM YYYY") : "—"}</span></div><div className="pw-record-actions"><button onClick={() => openEstimate(est)}><RiEyeLine /> View</button><button disabled={est.status === "Approved"} onClick={() => navigate(`/estimates/${est.id}/edit`, { state: { record: est, from: "/estimates" } })}><RiEditLine /> Edit</button>{!est.jobSheet && <button className="danger" onClick={() => setDeleteId(est.id)}><RiDeleteBinLine /> Delete</button>}</div>{!["Approved", "Rejected"].includes(est.status) && <div className="mt-3"><Select value={est.status || "Draft"} onChange={(e) => updateStatus(est.id, e.target.value)}><option>Draft</option><option>Sent</option><option>Approved</option><option>Rejected</option></Select></div>}</article>)}</div>
        <div className="pw-desktop-table"><Table headers={["Estimate", "Customer", "Vehicle", "Date", "Valid until", "Total", "Status", "Actions"]} empty={!records.length ? "No estimates found" : null}>{records.map((est) => <tr key={est.id}><td className="font-mono font-bold text-[#3157d5]">{est.estimateNumber || `#${est.id}`}</td><td className="font-semibold">{est.customer?.name || "—"}</td><td><RegPlate reg={est.vehicle?.registrationNumber || est.vehicle?.model} /></td><td>{moment(est.estimateDate).format("DD MMM YYYY")}</td><td>{est.validUntil ? moment(est.validUntil).format("DD MMM YYYY") : "—"}</td><td className="font-mono font-bold">£{Number(est.total || 0).toFixed(2)}</td><td><Badge status={est.status} /></td><td><div className="flex items-center gap-2"><button className="pw-icon-button" onClick={() => openEstimate(est)}><RiEyeLine /></button><button className="pw-icon-button" disabled={est.status === "Approved"} onClick={() => navigate(`/estimates/${est.id}/edit`, { state: { record: est, from: "/estimates" } })}><RiEditLine /></button>{!est.jobSheet && <button className="pw-icon-button pw-icon-button--danger" onClick={() => setDeleteId(est.id)}><RiDeleteBinLine /></button>}{!["Rejected", "Approved"].includes(est.status) && <Select className="!min-h-9 !py-1" value={est.status || "Draft"} onChange={(e) => updateStatus(est.id, e.target.value)}><option>Draft</option><option>Sent</option><option>Approved</option><option>Rejected</option></Select>}</div></td></tr>)}</Table></div>
        <Pagination meta={meta} disabled={loading} onPageChange={load} />
      </>}
    </Card>
    {viewing && <ViewItemDetailsModal setViewing={setViewing} viewing={viewing} />}
    <ConfirmDialog open={Boolean(deleteId)} title="Delete estimate?" message="This quotation and its line items will be removed. Estimates with a linked job sheet cannot be deleted." confirmText="Delete estimate" cancelText="Keep estimate" onConfirm={remove} onClose={() => setDeleteId(null)} />
  </div>;
}
