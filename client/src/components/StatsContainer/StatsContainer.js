import React from "react";
import styled from "styled-components/macro";
import {
  FaThumbsUp,
  FaSuitcaseRolling,
  FaCalendarCheck,
  FaBug,
} from "react-icons/fa";

import { useAppContext } from "../../hooks/context/use-app-context";
import StatsItem from "../../components/StatsItem";

function StatsContainer() {
  const { stats } = useAppContext();
  const defaultStats = [
    {
      title: "Pending Applications",
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: "#e9b949",
      bcg: "#fcefc7",
    },
    {
      title: "Interview Scheduled",
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "Jobs Accepted",
      count: stats.accepted || 0,
      icon: <FaThumbsUp />,
      color: "#4db2bc",
      bcg: "#d4fcff",
    },
    {
      title: "Jobs Declined",
      count: stats.declined || 0,
      icon: <FaBug />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatsItem key={index} {...item} />;
      })}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: grid;
  row-gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  @media (min-width: 1120px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 1rem;
  }
`;

export default StatsContainer;
