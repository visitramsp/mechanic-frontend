export const STATUS_STYLES = {
  Pending: "bg-[#eef3ff] text-[#3157d5] border-[#c7d7fe]",
  Approved: "bg-[#eef3ff] text-[#3157d5] border-[#c7d7fe]",
  Declined: "bg-[#fef3f2] text-[#b42318] border-[#fecdca]",
  Converted: "bg-[#f2f4f7] text-[#475467] border-[#d0d5dd]",
  "In Progress": "bg-[#f4f3ff] text-[#6941c6] border-[#d9d6fe]",
  Complete: "bg-[#ecfdf3] text-[#067647] border-[#abefc6]",
  Invoiced: "bg-[#f2f4f7] text-[#475467] border-[#d0d5dd]",
  Open: "bg-[#eef3ff] text-[#3157d5] border-[#c7d7fe]",
  Unpaid: "bg-[#fffaeb] text-[#b54708] border-[#fedf89]",
  Paid: "bg-[#ecfdf3] text-[#067647] border-[#abefc6]",
  Confirmed: "bg-[#ecfdf3] text-[#067647] border-[#abefc6]",
  Cancelled: "bg-[#fef3f2] text-[#b42318] border-[#fecdca]",
};

export const STATUS_DOT = {
  Pending: "bg-[#5b7bea]",
  Approved: "bg-[#079455]",
  Declined: "bg-[#d92d20]",
  Converted: "bg-[#667085]",
  "In Progress": "bg-[#7f56d9]",
  Complete: "bg-[#079455]",
  Invoiced: "bg-[#667085]",
  Open: "bg-[#5b7bea]",
  Unpaid: "bg-[#f79009]",
  Paid: "bg-[#079455]",
  Confirmed: "bg-[#079455]",
  Cancelled: "bg-[#d92d20]",
};

export const Badge = ({ status }) => (
  <span
    className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
      STATUS_STYLES[status] || "bg-[#f2f4f7] text-[#475467] border-[#d0d5dd]"
    }`}
  >
    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[status] || "bg-[#667085]"}`} />
    <span className="truncate">{status}</span>
  </span>
);

export default Badge;
