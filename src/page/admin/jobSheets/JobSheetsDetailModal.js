import { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { RiDownloadLine, RiPrinterLine } from "react-icons/ri";
import { Modal } from "../../../components/ui/Modal";
import { Badge, BtnBlue, BtnGhost, RegPlate, TotalsBox } from "../../../components/ui/UI";
import { downloadJobSheetPdf, printJobSheetPdf } from "../../../utils/pdfDocuments";

const Detail = ({ label, children }) => (
  <div className="pw-detail-tile">
    <span>{label}</span>
    <strong>{children || "—"}</strong>
  </div>
);

export default function JobSheetsDetailModal({ setViewing, viewing }) {
  const [preparing, setPreparing] = useState(false);
  if (!viewing) return null;
  const { customer, vehicle, items = [] } = viewing;

  const handlePdfAction = async (mode) => {
    if (preparing) return;
    setPreparing(mode);
    try {
      await Promise.resolve(mode === "print" ? printJobSheetPdf(viewing) : downloadJobSheetPdf(viewing));
    } catch (error) {
      console.error(error);
      toast.error("Unable to prepare the job sheet PDF");
    } finally {
      setPreparing(false);
    }
  };

  return (
    <Modal
      title={viewing.jobNumber || `Job sheet #${viewing.id}`}
      sub="Workshop assignment, vehicle, repair and cost details"
      size="lg"
      onClose={() => setViewing(null)}
      open={Boolean(viewing)}
      footer={
        <>
          <BtnGhost type="button" onClick={() => setViewing(null)}>Close</BtnGhost>
          <BtnGhost type="button" disabled={Boolean(preparing)} onClick={() => handlePdfAction("print")}><RiPrinterLine /> {preparing === "print" ? "Preparing…" : "Print / Save PDF"}</BtnGhost>
          <BtnBlue type="button" disabled={Boolean(preparing)} onClick={() => handlePdfAction("download")}><RiDownloadLine /> {preparing === "download" ? "Preparing PDF…" : "Download PDF"}</BtnBlue>
        </>
      }
    >
      <div id="job-sheet-detail-content" className="space-y-5 bg-white">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#dce4ef] bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="pw-eyebrow">Job sheet summary</p>
            <p className="mt-1 text-sm text-[#667085]">
              Created {viewing.createdAt ? moment(viewing.createdAt).format("D MMM YYYY, HH:mm") : "—"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2"><Badge status={viewing.priority} /><Badge status={viewing.status} /></div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <section className="pw-summary-panel">
            <p className="pw-eyebrow">Customer</p>
            <div className="mt-3 grid gap-2">
              <Detail label="Name">{customer?.name}</Detail>
              <Detail label="Phone">{customer?.phone}</Detail>
              <Detail label="Email">{customer?.email}</Detail>
              <Detail label="Address">{customer?.address}</Detail>
            </div>
          </section>
          <section className="pw-summary-panel">
            <p className="pw-eyebrow">Vehicle</p>
            <div className="mt-3 grid gap-2">
              <Detail label="Registration"><RegPlate reg={vehicle?.registrationNumber} /></Detail>
              <Detail label="Make and model">{[vehicle?.make, vehicle?.model].filter(Boolean).join(" ")}</Detail>
              <Detail label="Mileage">{viewing.vehicleMileage || vehicle?.mileage}</Detail>
              <Detail label="VIN">{vehicle?.vinNumber}</Detail>
            </div>
          </section>
          <section className="pw-summary-panel sm:col-span-2 xl:col-span-1">
            <p className="pw-eyebrow">Workshop</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <Detail label="Technician">{viewing.technicianName}</Detail>
              <Detail label="Service advisor">{viewing.serviceAdvisor}</Detail>
              <Detail label="Start date">{viewing.startDate ? moment(viewing.startDate).format("D MMM YYYY") : "—"}</Detail>
              <Detail label="Job number">{viewing.jobNumber || viewing.id}</Detail>
            </div>
          </section>
        </div>

        <section>
          <p className="pw-eyebrow">Repair items</p>
          <h3 className="mt-1 text-base font-extrabold text-[#111c34]">Work carried out</h3>

          <div className="pw-detail-items-mobile mt-3">
            {items.map((item, index) => (
              <article key={item.id || index} className="pw-line-item-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="pw-eyebrow">Item {index + 1}</p>
                    <h4 className="mt-1 break-words font-extrabold text-[#111c34]">{item.description || "Untitled item"}</h4>
                  </div>
                  <Badge status={item.itemType || "Service"} />
                </div>
                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                  <Detail label="Quantity">{item.quantity ?? 0}</Detail>
                  <Detail label="Unit price">£{Number(item.unitPrice || 0).toFixed(2)}</Detail>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#eef3ff] px-3 py-2 text-sm">
                  <span className="font-semibold text-[#667085]">Line total</span>
                  <strong className="text-[#111c34]">£{Number(item.totalPrice || 0).toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className="pw-detail-items-desktop pw-table-wrap mt-3">
            <table className="pw-table">
              <thead><tr><th>#</th><th>Description</th><th>Type</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td className="font-semibold text-[#111c34]">{item.description || "—"}</td>
                    <td>{item.itemType || "—"}</td>
                    <td>{item.quantity ?? 0}</td>
                    <td>£{Number(item.unitPrice || 0).toFixed(2)}</td>
                    <td className="font-bold text-[#111c34]">£{Number(item.totalPrice || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
          <div className="pw-note-box">
            <p className="pw-eyebrow">Workshop notes</p>
            <p className="mt-2 break-words text-sm leading-6">{viewing.notes || "No additional notes were added."}</p>
          </div>
          <TotalsBox
            subtotal={viewing.subtotal || viewing.totalPrice || 0}
            vat={viewing.vatAmount || 0}
            vatPercentage={viewing.vatPercentage || 0}
            discount={viewing.discount || 0}
            LabourCharge={viewing.labourRate || 0}
            total={viewing.total || 0}
          />
        </div>

      </div>
    </Modal>
  );
}
