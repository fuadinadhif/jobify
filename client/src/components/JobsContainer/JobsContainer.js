import React from "react";
import styled from "styled-components/macro";

import { useAppContext } from "../../hooks/context/use-app-context";
import Loading from "../Loading";
import Job from "../Job";
import PageButtonContainer from "../PageButtonContainer";

function JobsContainer() {
  const {
    getAllJobs,
    jobs,
    isLoading,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
    page,
  } = useAppContext();

  React.useEffect(() => {
    const timeoutId = setTimeout(() => getAllJobs(), 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, searchStatus, searchType, sort]);

  if (isLoading) {
    return <Loading center="center" />;
  } else if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display... </h2>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <h5>
          {totalJobs} job{jobs.length > 1 && "s"} found
        </h5>

        <div className="jobs">
          {jobs.map((job) => {
            return <Job key={job._id} {...job} />;
          })}
        </div>
        {numOfPages > 1 && <PageButtonContainer />}
      </Wrapper>
    );
  }
}

const Wrapper = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .jobs {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  @media (min-width: 992px) {
    .jobs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
`;

export default JobsContainer;
