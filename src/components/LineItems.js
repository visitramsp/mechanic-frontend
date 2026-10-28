import { Input } from "./FormControl";
import { BtnGhost, BtnRed } from "./CustomButton";

const fmt = (value) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(value || 0));
const calcLineTotal = (items = []) =>
  items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0);

export const LineItemsTable = ({ items, setItems, withVatCol = false }) => {
  const setItem = (index, key, value) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    setItems(next);
  };
  const addItem = () => setItems([...items, { desc: "", qty: 1, rate: "" }]);
  const removeItem = (index) => setItems(items.filter((_, itemIndex) => itemIndex !== index));
  const subtotal = calcLineTotal(items);
  const vat = subtotal * 0.2;

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-[#dce4ef] bg-[#ffffff]">
        <table className="w-full min-w-[650px] text-sm">
          <thead>
            <tr className="bg-[#f4f7fb]">
              {["Description", "Qty", "Rate (£)", withVatCol && "VAT", "Total", ""]
                .filter(Boolean)
                .map((heading) => (
                  <th key={heading} className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[.15em] text-[#667085]">
                    {heading}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t border-[#e5eaf2]">
                <td className="px-2 py-2" style={{ width: "45%" }}>
                  <Input value={item.desc} onChange={(event) => setItem(index, "desc", event.target.value)} placeholder="Description…" />
                </td>
                <td className="px-2 py-2">
                  <Input type="number" value={item.qty} onChange={(event) => setItem(index, "qty", event.target.value)} min="0.5" step="0.5" />
                </td>
                <td className="px-2 py-2">
                  <Input type="number" value={item.rate} onChange={(event) => setItem(index, "rate", event.target.value)} placeholder="0.00" />
                </td>
                {withVatCol && <td className="px-2 py-2 text-xs text-[#667085]">20%</td>}
                <td className="whitespace-nowrap px-2 py-2 font-mono text-xs font-semibold text-[#0a1628]">
                  {fmt(Number(item.qty || 0) * Number(item.rate || 0))}
                </td>
                <td className="px-2 py-2">
                  {items.length > 1 && <BtnRed className="min-h-9 px-2 py-1 text-xs" onClick={() => removeItem(index)}>✕</BtnRed>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <BtnGhost className="min-h-9 text-xs" onClick={addItem}>+ Add line</BtnGhost>
      </div>

      <TotalsBox subtotal={subtotal} vat={vat} total={subtotal + vat} />
    </>
  );
};

export const TotalsBox = ({ subtotal, vat, total, label = "Total" }) => (
  <div className="mt-4 ml-auto w-full rounded-2xl border border-[#dce4ef] bg-[#f4f7fb] p-4 sm:w-80">
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-[#667085]">Subtotal</span><span className="font-mono font-semibold">{fmt(subtotal)}</span>
    </div>
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-[#667085]">VAT (20%)</span><span className="font-mono font-semibold">{fmt(vat)}</span>
    </div>
    <div className="mt-2 flex justify-between gap-4 border-t border-[#dcd2c1] pt-3">
      <span className="font-bold text-[#111c34]">{label}</span>
      <span className="font-mono text-xl font-bold text-[#0a1628]">{fmt(total)}</span>
    </div>
  </div>
);

export const ViewLineItems = ({ items = [], total }) => {
  const subtotal = calcLineTotal(items);
  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-[#dce4ef] bg-[#ffffff]">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-[#f4f7fb]">
              {["Description", "Qty", "Rate", "Total"].map((heading) => (
                <th key={heading} className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[.15em] text-[#667085]">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t border-[#e5eaf2]">
                <td className="px-3 py-3">{item.desc}</td>
                <td className="px-3 py-3">{item.qty}</td>
                <td className="px-3 py-3 font-mono">{fmt(item.rate)}</td>
                <td className="px-3 py-3 font-mono font-semibold text-[#0a1628]">{fmt(Number(item.qty || 1) * Number(item.rate || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TotalsBox subtotal={subtotal} vat={subtotal * 0.2} total={total || subtotal * 1.2} />
    </>
  );
};
