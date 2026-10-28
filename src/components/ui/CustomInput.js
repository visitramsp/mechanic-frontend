export const CustomInput = ({ label, className = "", formik, ...props }) => {
  const { values, handleChange, handleBlur, touched, errors, submitCount } = formik;
  const fieldName = props.name;
  const showError = (touched[fieldName] || submitCount > 0) && errors[fieldName];
  return (
    <div className="pw-field min-w-0">
      {label && <label className="pw-field-label">{label}</label>}
      <input
        {...props}
        value={values[fieldName] ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={Boolean(showError)}
        className={`pw-control ${showError ? "pw-control--error" : ""} ${className}`}
      />
      {showError && <p className="pw-field-error">{errors[fieldName]}</p>}
    </div>
  );
};
