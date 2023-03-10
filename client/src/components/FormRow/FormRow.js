import React from "react";

function FormRow({ type, name, value, handleChange, label }) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {label || name}
      </label>
      <input
        type={type}
        id={name}
        className="form-input"
        value={value}
        name={name}
        onChange={handleChange}
      />
    </div>
  );
}

export default FormRow;
