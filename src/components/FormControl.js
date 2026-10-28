export const Label = ({ children }) => (
  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-[#64736c]">
    {children}
  </label>
);

const controlClass = `w-full min-w-0 rounded-xl border border-[#d0d9e6] bg-[#ffffff] px-3.5 py-3
  text-sm text-[#1d2939] outline-none placeholder:text-[#98a2b3]
  transition-all duration-200 focus:border-[#5b7bea] focus:ring-4 focus:ring-[#5b7bea]/15
  disabled:cursor-not-allowed disabled:bg-[#eeebe4] disabled:text-[#8b948f]`;

export const Input = ({ className = "", ...props }) => (
  <input {...props} className={`${controlClass} ${className}`} />
);

export const Select = ({ children, className = "", ...props }) => (
  <select {...props} className={`${controlClass} appearance-none pr-10 ${className}`}>
    {children}
  </select>
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea {...props} className={`${controlClass} min-h-[104px] resize-y ${className}`} />
);

export const FormSection = ({ children }) => (
  <section className="mb-6 border-b border-[#e5eaf2] pb-6 last:mb-0 last:border-0 last:pb-0">
    {children}
  </section>
);

export const SectionTitle = ({ children }) => (
  <div className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.18em] text-[#3157d5]">
    <span className="flex items-center gap-1.5">{children}</span>
    <span className="h-px flex-1 bg-[#dfd4c1]" />
  </div>
);

export const FormGroup = ({ label, children, className = "" }) => (
  <div className={`min-w-0 ${className}`}>
    {label && <Label>{label}</Label>}
    {children}
  </div>
);
