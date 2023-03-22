import styled from "styled-components/macro";

import { useAppContext } from "../../hooks/context/use-app-context.js";
import FormRow from "../../components/FormRow";
import FormRowSelect from "../../components/FormRowSelect";
import Alert from "../../components/Alert";

function AddJob() {
  const {
    isEditing,
    showAlert,
    displayNullAlert,
    position,
    company,
    jobLocation,
    jobTypeOptions,
    jobType,
    statusOptions,
    status,
    handleInputChange,
    clearInputValues,
    createJob,
    editJob,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !jobLocation) {
      displayNullAlert();
      return;
    }

    if (isEditing) {
      editJob();
      return;
    }

    createJob();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    handleInputChange({ name, value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    clearInputValues();
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <h3>{isEditing ? "Edit Job" : "Add Job"}</h3>
        {showAlert && <Alert />}

        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            label="location"
            name="jobLocation"
            value={jobLocation}
            handleChange={handleChange}
          />
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleChange}
            selectOptions={statusOptions}
          />
          <FormRowSelect
            label="Type"
            name="jobType"
            value={jobType}
            handleChange={handleChange}
            selectOptions={jobTypeOptions}
          />

          <div className="btn-container">
            <button type="submit" className="btn btn-block submit-btn">
              Submit
            </button>
            <button className="btn btn-block clear-btn" onClick={handleClick}>
              Clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
  box-shadow: var(--shadow-2);
  h3 {
    margin-top: 0;
  }
  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    row-gap: 0.5rem;
  }
  .form-center button {
    align-self: end;
    height: 35px;
    margin-top: 1rem;
  }
  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    align-self: flex-end;
    margin-top: 0.5rem;
    button {
      height: 35px;
    }
  }
  .clear-btn {
    background: var(--grey-500);
  }
  .clear-btn:hover {
    background: var(--black);
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
    .btn-container {
      margin-top: 0;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .form-center button {
      margin-top: 0;
    }
  }
`;

export default AddJob;
