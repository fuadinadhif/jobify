import React from "react";
import styled from "styled-components/macro";

import { useAppContext } from "../../hooks/context/use-app-context";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";

function PageButtonContainer() {
  const { numOfPages, page, changePage } = useAppContext();
  const [disablePrev, setDisablePrev] = React.useState(false);
  const [disableNext, setDisableNext] = React.useState(false);
  const pages = Array.from({ length: numOfPages }, (_, index) => index + 1);

  const prevPage = () => {
    let newPage = page - 1;
    if (newPage <= 1) setDisablePrev(true);
    changePage(newPage);
  };

  const nextPage = () => {
    let newPage = page + 1;
    if (newPage >= numOfPages) setDisableNext(true);
    changePage(newPage);
  };

  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage} disabled={disablePrev}>
        <HiChevronDoubleLeft />
        Prev
      </button>
      <div className="btn-container">
        {pages.map((pageNumber, index) => {
          return (
            <button
              type="button"
              className={pageNumber === page ? "pageBtn active" : "pageBtn"}
              key={index}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button className="next-btn" onClick={nextPage} disabled={disableNext}>
        Next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  height: 6rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  gap: 1rem;
  .btn-container {
    background: var(--primary-100);
    border-radius: var(--borderRadius);
  }
  .pageBtn {
    background: transparent;
    border-color: transparent;
    width: 50px;
    height: 40px;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary-500);
    transition: var(--transition);
    border-radius: var(--borderRadius);
    cursor: pointer;
  }
  .active {
    background: var(--primary-500);
    color: var(--white);
  }
  .prev-btn,
  .next-btn {
    width: 100px;
    height: 40px;
    background: var(--white);
    border-color: transparent;
    border-radius: var(--borderRadius);
    color: var(--primary-500);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: var(--transition);
  }
  .prev-btn:hover,
  .next-btn:hover {
    background: var(--primary-500);
    color: var(--white);
  }
`;

export default PageButtonContainer;
