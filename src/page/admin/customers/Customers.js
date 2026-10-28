import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiMailLine, RiPhoneLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BtnBlue, Card, LoadingState, PageHeader, Pagination, Table } from "../../../components/ui/UI";
import ConfirmDialog from "../../../components/ConfirmDialog";
import useDebounce from "../../../components/useDebounce";
import { deleteCustomers, fetchCustomers } from "../../../services/apiServices/customers";

export default function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const query = useDebounce(search);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    const response = await fetchCustomers({ search: query, page, limit: 20 });
    if (response?.success) {
      setCustomers(response.data || []);
      setMeta(response.meta || { page, pages: 1, total: response.data?.length || 0, limit: 20 });
    } else toast.error(response?.message || "Unable to load customers");
    setLoading(false);
  }, [query]);

  useEffect(() => { load(1); }, [load]);

  const remove = async () => {
    const response = await deleteCustomers(deleteId);
    if (response?.success) {
      toast.success(response.message || "Customer deleted");
      setDeleteId(null);
      load(meta.page);
    } else toast.error(response?.message || "Unable to delete customer");
  };

  return <div className="space-y-5">
    <PageHeader title="Customers" sub={`${meta.total || 0} customer records`} action={<BtnBlue onClick={() => navigate("/customers/new", { state: { from: "/customers" } })}><RiAddLine /> Add customer</BtnBlue>} />
    <Card className="overflow-hidden">
      <div className="pw-list-toolbar"><div className="pw-search-box"><RiSearchLine /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone or email" /></div></div>
      {loading ? <LoadingState label="Loading customers…" /> : <>
        <div className="pw-mobile-records">{customers.map((customer) => <article className="pw-record-card" key={customer.id}>
          <div className="flex items-start justify-between gap-3"><div><p className="pw-eyebrow">Customer #{customer.id}</p><h3>{customer.name}</h3></div><span className="pw-avatar">{String(customer.name || "C").slice(0,2).toUpperCase()}</span></div>
          <div className="pw-record-details"><span><RiPhoneLine />{customer.phone || "—"}</span><span><RiMailLine />{customer.email || "—"}</span><span>{customer.address || "No address"}</span></div>
          <div className="pw-record-actions"><button onClick={() => navigate(`/customers/${customer.id}/edit`, { state: { record: customer, from: "/customers" } })}><RiEditLine /> Edit</button><button className="danger" onClick={() => setDeleteId(customer.id)}><RiDeleteBinLine /> Delete</button></div>
        </article>)}</div>
        <div className="pw-desktop-table"><Table headers={["ID", "Name", "Phone", "Email", "Address", "Joined", "Actions"]} empty={!customers.length ? "No customers found" : null}>{customers.map((customer) => <tr key={customer.id}><td>#{customer.id}</td><td className="font-bold text-[#111c34]">{customer.name}</td><td>{customer.phone}</td><td>{customer.email}</td><td className="max-w-[260px] truncate">{customer.address}</td><td>{moment(customer.createdAt).format("DD MMM YYYY")}</td><td><div className="flex gap-2"><button className="pw-icon-button" onClick={() => navigate(`/customers/${customer.id}/edit`, { state: { record: customer, from: "/customers" } })}><RiEditLine /></button><button className="pw-icon-button pw-icon-button--danger" onClick={() => setDeleteId(customer.id)}><RiDeleteBinLine /></button></div></td></tr>)}</Table></div>
        <Pagination meta={meta} disabled={loading} onPageChange={load} />
      </>}
    </Card>
    <ConfirmDialog open={Boolean(deleteId)} title="Delete customer?" message="This customer record will be permanently removed. Linked records may prevent deletion." confirmText="Delete customer" cancelText="Keep record" onConfirm={remove} onClose={() => setDeleteId(null)} />
  </div>;
}
