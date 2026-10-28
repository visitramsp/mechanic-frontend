import React from "react";

const BrandLogo = ({ compact = false, className = "" }) => (
  <div className={`tm-brand ${compact ? "tm-brand--compact" : ""} ${className}`}>
    <img src={`${process.env.PUBLIC_URL}/the-mechnic-logo.png`} alt="the Mechanic" />
    {/* {!compact && (
      <span>
        <strong>the</strong>
        <b>Mechanic</b>
        <small>BIKE CARE · REPAIRS · PERFORMANCE</small>
      </span>
    )} */}
  </div>
);

export default BrandLogo;
