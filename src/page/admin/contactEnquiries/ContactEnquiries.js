import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import { Badge, BtnBlue, BtnGhost, Card, Input, LoadingState, PageHeader, Pagination, Select, Table, Textarea } from "../../../components/ui/UI";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { Modal } from "../../../components/ui/Modal";
import useDebounce from "../../../components/useDebounce";
import { deleteContactEnquiry, fetchContactEnquiries, fetchContactEnquiryById, updateContactEnquiry } from "../../../services/apiServices/contactService";

const statuses = ["New", "In Review", "Contacted", "Booked", "Closed", "Spam"];
function EnquiryModal({ enquiry, onClose, onSaved }) {
  const [form, setForm] = useState({
    status: enquiry.status || "New",
    assignedTo: enquiry.assignedTo || "",
    internalNotes: enquiry.internalNotes || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await updateContactEnquiry(enquiry.id, form);
      if (response?.success) {
        toast.success(response.message || "Enquiry updated");
        onSaved();
      } else {
        toast.error(response?.message || "Unable to update enquiry");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={Boolean(enquiry)}
      title={`${enquiry.firstName} ${enquiry.lastName}`}
      sub={`Website enquiry #${enquiry.id} · Review the request and record the workshop follow-up.`}
      size="lg"
      onClose={saving ? undefined : onClose}
      footer={
        <>
          <BtnGhost type="button" onClick={onClose} disabled={saving}>Close</BtnGhost>
          <BtnBlue type="submit" form="enquiry-review-form" disabled={saving}>
            {saving ? "Saving…" : "Save follow-up"}
          </BtnBlue>
        </>
      }
    >
      <form id="enquiry-review-form" onSubmit={save} className="space-y-5">
        <div className="pw-modal-detail-grid pw-modal-detail-grid--four">
          <div className="pw-detail-tile"><span>Email</span><strong>{enquiry.email}</strong></div>
          <div className="pw-detail-tile"><span>Phone</span><strong>{enquiry.phone}</strong></div>
          <div className="pw-detail-tile"><span>Registration</span><strong>{enquiry.registration || "—"}</strong></div>
          <div className="pw-detail-tile"><span>Service</span><strong>{enquiry.service || "General"}</strong></div>
        </div>
        <div className="pw-note-box">
          <p className="pw-eyebrow">Customer message</p>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">{enquiry.message}</p>
        </div>
        <div className="pw-form-grid">
          <Select label="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </Select>
          <Input label="Assigned to" value={form.assignedTo} onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))} placeholder="Team member name" />
        </div>
        <Textarea label="Internal notes" value={form.internalNotes} onChange={(event) => setForm((current) => ({ ...current, internalNotes: event.target.value }))} placeholder="Private workshop follow-up notes" />
      </form>
    </Modal>
  );
}
export default function ContactEnquiries() {
  const [records, setRecords] = useState([]); const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 }); const [search, setSearch] = useState(""); const [status, setStatus] = useState(""); const [loading, setLoading] = useState(true); const [viewing, setViewing] = useState(null); const [deleteTarget, setDeleteTarget] = useState(null); const query = useDebounce(search);
  const load = useCallback(async (page = 1) => { setLoading(true); const response = await fetchContactEnquiries({ search: query, status, page, limit: 20 }); if (response?.success) { setRecords(response.data || []); setMeta(response.meta || { page, pages: 1, total: response.data?.length || 0, limit: 20 }); } else toast.error(response?.message || "Unable to load enquiries"); setLoading(false); }, [query, status]);
  useEffect(() => { load(1); }, [load]);
  const openEnquiry = async (item) => {
    const response = await fetchContactEnquiryById(item.id);
    if (response?.success) setViewing(response.data);
    else toast.error(response?.message || "Unable to load enquiry details");
  };
  const remove = async () => { const response = await deleteContactEnquiry(deleteTarget.id); if (response?.success) { toast.success(response.message || "Enquiry deleted"); setDeleteTarget(null); load(meta.page); } else toast.error(response?.message || "Unable to delete enquiry"); };
  return <div className="space-y-5"><PageHeader title="Website enquiries" sub={`${meta.total || 0} contact and booking requests`} /><Card className="overflow-hidden"><div className="pw-list-toolbar"><div className="pw-search-box"><FiSearch /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer, email, phone or registration" /></div><select className="pw-control pw-select sm:max-w-48" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>{loading ? <LoadingState label="Loading enquiries…" /> : <><div className="pw-mobile-records">{records.map((item) => <article className="pw-record-card" key={item.id}><div className="flex items-start justify-between gap-3"><div><p className="pw-eyebrow">{item.service || "General enquiry"}</p><h3>{item.firstName} {item.lastName}</h3><p>{moment(item.createdAt).format("DD MMM YYYY, HH:mm")}</p></div><Badge status={item.status} /></div><div className="pw-record-details"><span>{item.email}</span><span>{item.phone}</span><span>{item.registration || "No registration"}</span><span>{item.message}</span></div><div className="pw-record-actions"><button onClick={() => openEnquiry(item)}><FiEye /> Review</button><button className="danger" onClick={() => setDeleteTarget(item)}><FiTrash2 /> Delete</button></div></article>)}</div><div className="pw-desktop-table"><Table headers={["Customer", "Contact", "Registration", "Service", "Received", "Status", "Assigned", "Actions"]} empty={!records.length ? "No enquiries found" : null}>{records.map((item) => <tr key={item.id}><td className="font-bold text-[#111c34]">{item.firstName} {item.lastName}</td><td><div>{item.email}</div><small>{item.phone}</small></td><td>{item.registration || "—"}</td><td>{item.service || "General"}</td><td>{moment(item.createdAt).format("DD MMM YYYY, HH:mm")}</td><td><Badge status={item.status} /></td><td>{item.assignedTo || "—"}</td><td><div className="flex gap-2"><button className="pw-icon-button" onClick={() => openEnquiry(item)}><FiEye /></button><button className="pw-icon-button pw-icon-button--danger" onClick={() => setDeleteTarget(item)}><FiTrash2 /></button></div></td></tr>)}</Table></div><Pagination meta={meta} disabled={loading} onPageChange={load} /></>}</Card>{viewing && <EnquiryModal enquiry={viewing} onClose={() => setViewing(null)} onSaved={() => { setViewing(null); load(meta.page); }} />}<ConfirmDialog open={Boolean(deleteTarget)} title="Delete enquiry?" message="This removes the website enquiry and internal follow-up notes permanently." confirmText="Delete enquiry" cancelText="Keep enquiry" onConfirm={remove} onClose={() => setDeleteTarget(null)} /></div>;
}
