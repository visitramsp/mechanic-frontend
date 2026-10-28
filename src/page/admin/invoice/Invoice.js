import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiEdit2, FiEye, FiFileText, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  BtnBlue,
  Card,
  LoadingState,
  PageHeader,
  Pagination,
  RegPlate,
  Table,
} from "../../../components/ui/UI";
import ConfirmDialog from "../../../components/ConfirmDialog";
import useDebounce from "../../../components/useDebounce";
import {
  deleteInvoice,
  fetchInvoiceById,
  fetchInvoices,
  updateInvoiceStatus,
} from "../../../services/apiServices/invoiceService";
import { fetchDashboard } from "../../../services/apiServices/dashboardService";
import { InvoiceDetailModal, PaymentModal } from "./InvoiceModals";

const fmt = (value) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(value || 0));

const niceDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
        new Date(`${String(value).split("T")[0]}T00:00:00`),
      )
    : "—";

const normalizeInvoice = (record = {}) => ({
  ...record,
  databaseId: record.databaseId ?? record.id,
  id: record.invoiceNumber || record.id,
  invoiceNumber: record.invoiceNumber || record.id,
  customer: record.customerName || record.customerRecord?.name || "—",
  vehicle: record.vehicleRegistration || record.vehicleRecord?.registrationNumber || "—",
  make:
    record.vehicleDescription ||
    [record.vehicleRecord?.make, record.vehicleRecord?.model].filter(Boolean).join(" ") ||
    "Vehicle details unavailable",
  date: record.invoiceDate || record.date,
  due: record.dueDate || record.due,
  vatRate: Number(record.vatPercentage ?? record.vatRate ?? 0),
  vatAmt: Number(record.vatAmount ?? record.vatAmt ?? 0),
  paid: Number(record.paidAmount ?? record.paid ?? 0),
  balance: Number(record.balance ?? 0),
  total: Number(record.total ?? 0),
  subtotal: Number(record.subtotal ?? 0),
  labourCharge: Number(record.labourCharge ?? 0),
  discount: Number(record.discount ?? 0),
});

export default function Invoice() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [dashboard, setDashboard] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const query = useDebounce(search);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const [invoiceResponse, dashboardResponse] = await Promise.all([
          fetchInvoices({ search: query, status, page, limit: 20 }),
          fetchDashboard(),
        ]);
        if (invoiceResponse?.success) {
          setInvoices((invoiceResponse.data || []).map(normalizeInvoice));
          setMeta(
            invoiceResponse.meta || {
              page,
              pages: 1,
              total: invoiceResponse.data?.length || 0,
              limit: 20,
            },
          );
        } else {
          toast.error(invoiceResponse?.message || "Unable to load invoices");
        }
        if (dashboardResponse?.success) setDashboard(dashboardResponse.data?.metrics || {});
      } finally {
        setLoading(false);
      }
    },
    [query, status],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const currentPagePaid = useMemo(
    () => invoices.reduce((sum, item) => sum + Number(item.paid || 0), 0),
    [invoices],
  );


  const openInvoice = async (invoice) => {
    const loadingToast = toast.loading("Loading invoice details…");
    try {
      const response = await fetchInvoiceById(invoice.databaseId || invoice.id);
      if (response?.success) setSelected(normalizeInvoice(response.data));
      else toast.error(response?.message || "Unable to load invoice details");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const paymentSaved = () => {
    setPaymentInvoice(null);
    setSelected(null);
    load(meta.page);
  };

  const changeStatus = async (invoice, nextStatus) => {
    const response = await updateInvoiceStatus(invoice.id, nextStatus);
    if (response?.success) {
      toast.success(response.message || "Invoice status updated");
      setSelected(null);
      load(meta.page);
    } else {
      toast.error(response?.message || "Unable to update status");
    }
  };

  const remove = async () => {
    const response = await deleteInvoice(deleteTarget.id);
    if (response?.success) {
      toast.success(response.message || "Invoice deleted");
      setDeleteTarget(null);
      load(meta.page);
    } else {
      toast.error(response?.message || "Unable to delete invoice");
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Invoices"
        sub="Database-backed billing, VAT, payments and overlap-free PDF records"
        action={
          <BtnBlue onClick={() => navigate("/invoices/new", { state: { from: "/invoices" } })}>
            <FiPlus /> New invoice
          </BtnBlue>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="pw-stat-card">
          <div>
            <p className="pw-eyebrow">All invoices</p>
            <strong className="pw-stat-value">{meta.total || 0}</strong>
          </div>
          <div className="pw-stat-icon"><FiFileText /></div>
        </Card>
        <Card className="pw-stat-card">
          <div>
            <p className="pw-eyebrow">Outstanding</p>
            <strong className="pw-stat-value">{fmt(dashboard.outstandingAmount)}</strong>
            <small className="text-[#667085]">{dashboard.unpaidInvoices || 0} open invoices</small>
          </div>
          <div className="pw-stat-icon">£</div>
        </Card>
        <Card className="pw-stat-card">
          <div>
            <p className="pw-eyebrow">Paid on this page</p>
            <strong className="pw-stat-value">{fmt(currentPagePaid)}</strong>
            <small className="text-[#667085]">Month revenue: {fmt(dashboard.monthRevenue)}</small>
          </div>
          <div className="pw-stat-icon"><FiCheck /></div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="pw-list-toolbar">
          <div className="pw-search-box">
            <FiSearch />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search invoice, customer or vehicle"
            />
          </div>
          <select className="pw-control pw-select sm:max-w-48" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option>Paid</option>
            <option>Unpaid</option>
            <option>Partial</option>
            <option>Overdue</option>
            <option>Draft</option>
            <option>Void</option>
          </select>
        </div>

        {loading ? (
          <LoadingState label="Loading invoices…" />
        ) : (
          <>
            <div className="pw-mobile-records">
              {invoices.map((invoice) => (
                <article className="pw-record-card" key={invoice.databaseId || invoice.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="pw-eyebrow">{invoice.id}</p>
                      <h3>{invoice.customer}</h3>
                      <p>{invoice.make}</p>
                    </div>
                    <Badge status={invoice.status} />
                  </div>
                  <div className="pw-record-details">
                    <span><RegPlate reg={invoice.vehicle} /></span>
                    <span>Total: {fmt(invoice.total)}</span>
                    <span>Balance: {fmt(invoice.balance)}</span>
                    <span>Due: {niceDate(invoice.due)}</span>
                  </div>
                  <div className="pw-record-actions">
                    <button onClick={() => openInvoice(invoice)}><FiEye /> View / PDF</button>
                    <button
                      disabled={invoice.status === "Void"}
                      onClick={() =>
                        navigate(`/invoices/${encodeURIComponent(invoice.id)}/edit`, {
                          state: { record: invoice, from: "/invoices" },
                        })
                      }
                    >
                      <FiEdit2 /> Edit
                    </button>
                    {Number(invoice.balance) > 0 && invoice.status !== "Void" && (
                      <button className="success" onClick={() => setPaymentInvoice(invoice)}>
                        <FiCheck /> Payment
                      </button>
                    )}
                    {Number(invoice.paid || 0) === 0 && (
                      <button className="danger" onClick={() => setDeleteTarget(invoice)}>
                        <FiTrash2 /> Delete
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="pw-desktop-table">
              <Table
                headers={["Invoice", "Customer", "Vehicle", "Date", "Due", "Total", "Paid", "Balance", "Status", "Actions"]}
                empty={!invoices.length ? "No invoices found" : null}
              >
                {invoices.map((invoice) => (
                  <tr key={invoice.databaseId || invoice.id}>
                    <td className="font-mono font-bold text-[#3157d5]">{invoice.id}</td>
                    <td><strong>{invoice.customer}</strong><div className="text-xs text-slate-400">{invoice.make}</div></td>
                    <td><RegPlate reg={invoice.vehicle} /></td>
                    <td>{niceDate(invoice.date)}</td>
                    <td>{niceDate(invoice.due)}</td>
                    <td className="font-mono font-bold">{fmt(invoice.total)}</td>
                    <td className="text-emerald-600">{fmt(invoice.paid)}</td>
                    <td className="text-rose-600">{fmt(invoice.balance)}</td>
                    <td><Badge status={invoice.status} /></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="pw-icon-button" title="View invoice and PDF" onClick={() => openInvoice(invoice)}><FiEye /></button>
                        <button
                          className="pw-icon-button"
                          title="Edit invoice"
                          disabled={invoice.status === "Void"}
                          onClick={() =>
                            navigate(`/invoices/${encodeURIComponent(invoice.id)}/edit`, {
                              state: { record: invoice, from: "/invoices" },
                            })
                          }
                        >
                          <FiEdit2 />
                        </button>
                        {Number(invoice.balance) > 0 && invoice.status !== "Void" && (
                          <button className="pw-icon-button pw-icon-button--success" title="Record payment" onClick={() => setPaymentInvoice(invoice)}>
                            <FiCheck />
                          </button>
                        )}
                        {Number(invoice.paid || 0) === 0 && (
                          <button className="pw-icon-button pw-icon-button--danger" title="Delete invoice" onClick={() => setDeleteTarget(invoice)}>
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
            <Pagination meta={meta} disabled={loading} onPageChange={load} />
          </>
        )}
      </Card>

      <InvoiceDetailModal
        invoice={selected}
        onClose={() => setSelected(null)}
        onPayment={(invoice) => {
          setSelected(null);
          setPaymentInvoice(invoice);
        }}
        onStatus={changeStatus}
      />

      <PaymentModal
        invoice={paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        onSaved={paymentSaved}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete invoice?"
        message="Only invoices without payments can be deleted. Paid records must remain in the audit history."
        confirmText="Delete invoice"
        cancelText="Keep invoice"
        onConfirm={remove}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
