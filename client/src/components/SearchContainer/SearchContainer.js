import React from "react";
import styled from "styled-components/macro";

import { useAppContext } from "../../hooks/context/use-app-context";
import FormRow from "../FormRow";
import FormRowSelect from "../FormRowSelect";

function SearchContainer() {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleInputChange,
    clearInputValues,
  } = useAppContext();

  const handleSearch = (e) => {
    if (isLoading) return;
    handleInputChange({ name: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearInputValues();
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>Search Form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            label="Search"
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          <FormRowSelect
            label="Job Status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            selectOptions={["all", ...statusOptions]}
          />
          <FormRowSelect
            label="Job Type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            selectOptions={["all", ...jobTypeOptions]}
          />
          <FormRowSelect
            label="Sort"
            name="sort"
            value={sort}
            handleChange={handleSearch}
            selectOptions={sortOptions}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  .form {
    width: 100%;
    max-width: 100%;
  }
  .form-input,
  .form-select,
  .btn-block {
    height: 35px;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 2rem;
    row-gap: 0.5rem;
  }
  h5 {
    font-weight: 700;
  }
  .btn-block {
    align-self: end;
    margin-top: 1rem;
  }
  @media (min-width: 768px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .btn-block {
      margin-top: 0;
    }
  }
`;

export default SearchContainer;
