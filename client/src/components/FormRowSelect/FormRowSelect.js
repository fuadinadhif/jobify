import React from "react";

function FormRowSelect({ label, name, value, handleChange, selectOptions }) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {label || name}
      </label>

      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="form-select"
      >
        {selectOptions.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default FormRowSelect;
