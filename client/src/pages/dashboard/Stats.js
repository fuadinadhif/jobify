import React from "react";

import { useAppContext } from "../../hooks/context/use-app-context";
import StatsContainer from "../../components/StatsContainer";
import ChartsContainer from "../../components/ChartsContainer";
import Loading from "../../components/Loading";

function Stats() {
  const { getJobStats, isLoading, monthlyApplications } = useAppContext();

  React.useEffect(() => {
    getJobStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading center="center" />;
  }

  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
}

export default Stats;
