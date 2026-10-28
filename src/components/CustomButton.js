export const Btn = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold
      transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5b7bea]/20
      disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export const BtnPrimary = ({ className = "", ...props }) => (
  <Btn
    {...props}
    className={`border border-[#050d19] bg-[#0a1628] text-white shadow-[0_12px_26px_rgba(10,22,40,.2)] hover:-translate-y-0.5 hover:bg-[#050d19] ${className}`}
  />
);

export const BtnGhost = ({ className = "", ...props }) => (
  <Btn
    {...props}
    className={`border border-[#d0d9e6] bg-[#ffffff] text-[#1d2939] hover:border-[#5b7bea] hover:bg-[#f4f7fb] ${className}`}
  />
);

export const BtnGreen = ({ className = "", ...props }) => (
  <Btn {...props} className={`bg-[#079455] text-white hover:bg-[#067647] ${className}`} />
);

export const BtnRed = ({ className = "", ...props }) => (
  <Btn {...props} className={`border border-[#fecdca] bg-[#fef3f2] text-[#b42318] hover:bg-[#d92d20] hover:text-white ${className}`} />
);

export const BtnAmber = ({ className = "", ...props }) => (
  <Btn {...props} className={`bg-[#3157d5] text-white hover:bg-[#2445b5] ${className}`} />
);

export const BtnSm = ({ as: Component = BtnPrimary, ...props }) => (
  <Component {...props} className="min-h-9 px-3 py-1.5 text-xs" />
);
