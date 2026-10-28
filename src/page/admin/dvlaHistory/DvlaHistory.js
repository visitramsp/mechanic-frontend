import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { FiEye, FiSearch } from "react-icons/fi";
import { Badge, BtnGhost, Card, LoadingState, PageHeader, Pagination, RegPlate, Table } from "../../../components/ui/UI";
import useDebounce from "../../../components/useDebounce";
import { Modal } from "../../../components/ui/Modal";
import { fetchDvlaHistory } from "../../../services/apiServices/vehicleService";

function HistoryModal({ item, onClose }) {
  if (!item) return null;
  return (
    <Modal
      open={Boolean(item)}
      title={item.registrationNumber}
      sub="DVLA lookup audit, upstream response and request metadata"
      size="lg"
      onClose={onClose}
      footer={<BtnGhost type="button" onClick={onClose}>Close</BtnGhost>}
    >
      <div className="space-y-5">
        <div className="pw-modal-detail-grid pw-modal-detail-grid--three">
          <div className="pw-detail-tile"><span>Status</span><Badge status={item.status} /></div>
          <div className="pw-detail-tile"><span>Requested</span><strong>{moment(item.createdAt).format("DD MMM YYYY, HH:mm:ss")}</strong></div>
          <div className="pw-detail-tile"><span>IP address</span><strong>{item.requestedIp || "—"}</strong></div>
        </div>
        {item.errorMessage && (
          <div className="pw-note-box pw-note-box--danger">
            <p className="pw-eyebrow">Error</p>
            <p className="mt-2 break-words text-sm text-[#d92d20]">{item.errorMessage}</p>
          </div>
        )}
        <div className="pw-code-panel">
          <div className="pw-code-panel__head">
            <p className="pw-eyebrow">Upstream response</p>
            <span>JSON</span>
          </div>
          <pre>{JSON.stringify(item.responseData || {}, null, 2)}</pre>
        </div>
        <div className="pw-note-box">
          <p className="pw-eyebrow">User agent</p>
          <p className="mt-2 break-all text-xs leading-5">{item.userAgent || "—"}</p>
        </div>
      </div>
    </Modal>
  );
}
export default function DvlaHistory() {
  const [records, setRecords] = useState([]); const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 }); const [search, setSearch] = useState(""); const [status, setStatus] = useState(""); const [loading, setLoading] = useState(true); const [viewing, setViewing] = useState(null); const query = useDebounce(search);
  const load = useCallback(async (page = 1) => { setLoading(true); const response = await fetchDvlaHistory({ search: query, status, page, limit: 20 }); if (response?.success) { setRecords(response.data || []); setMeta(response.meta || { page, pages: 1, total: response.data?.length || 0, limit: 20 }); } else toast.error(response?.message || "Unable to load DVLA history"); setLoading(false); }, [query, status]);
  useEffect(() => { load(1); }, [load]);
  return <div className="space-y-5"><PageHeader title="DVLA lookup history" sub={`${meta.total || 0} registration lookup audit records`} /><Card className="overflow-hidden"><div className="pw-list-toolbar"><div className="pw-search-box"><FiSearch /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search registration" /></div><select className="pw-control pw-select sm:max-w-48" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All results</option><option>Success</option><option>Not Found</option><option>Failed</option></select></div>{loading ? <LoadingState label="Loading lookup history…" /> : <><div className="pw-mobile-records">{records.map((item) => <article className="pw-record-card" key={item.id}><div className="flex items-start justify-between gap-3"><div><RegPlate reg={item.registrationNumber} /><p className="mt-3">{moment(item.createdAt).format("DD MMM YYYY, HH:mm")}</p></div><Badge status={item.status} /></div><div className="pw-record-details"><span>{item.errorMessage || "Vehicle details returned successfully"}</span><span>IP: {item.requestedIp || "—"}</span></div><div className="pw-record-actions"><button onClick={() => setViewing(item)}><FiEye /> View audit</button></div></article>)}</div><div className="pw-desktop-table"><Table headers={["Registration", "Status", "Requested", "IP address", "Result", "Action"]} empty={!records.length ? "No DVLA lookups found" : null}>{records.map((item) => <tr key={item.id}><td><RegPlate reg={item.registrationNumber} /></td><td><Badge status={item.status} /></td><td>{moment(item.createdAt).format("DD MMM YYYY, HH:mm:ss")}</td><td className="font-mono text-xs">{item.requestedIp || "—"}</td><td className="max-w-[360px] truncate">{item.errorMessage || "Successful response"}</td><td><button className="pw-icon-button" onClick={() => setViewing(item)}><FiEye /></button></td></tr>)}</Table></div><Pagination meta={meta} disabled={loading} onPageChange={load} /></>}</Card>{viewing && <HistoryModal item={viewing} onClose={() => setViewing(null)} />}</div>;
}
