import React, { useState, useEffect, useCallback, useRef } from "react";
import { Calculator } from "../../components/calculator";
import { CalcHistory } from "../../components/history";
import { API_POINTS, useApi } from "../../hooks/useApi";
import "./home.style.css";

export const Home = () => {
  const [logState, setLogState] = useState({ logs: [], isLoading: true });

  const timerHandle = useRef(null); // mutable non state

  // ------------------ api endpoints ----------------------------------
  const logsApi = useApi(API_POINTS.LOGS);
  const updateLogsApi = useApi(API_POINTS.UPDATE_LOGS);

  const fetchLogs = useCallback(async () => await logsApi(), [logsApi]);
  const sendLogs = useCallback(
    async (payload) => await updateLogsApi({ data: payload }),
    [updateLogsApi]
  );

  // ------------------ side effects ----------------------------------
  useEffect(() => {
    // first time
    setTimeout(async () => {
      const response = await fetchLogs();
      setLogState({ logs: response.data?.data, isLoading: false });
    });

    // afterwards poll
    timerHandle.current = setInterval(async () => {
      const result = await fetchLogs();
      setLogState({ logs: result.data?.data, isLoading: false });
    }, 5000);

    return () => timerHandle?.current && clearInterval(timerHandle.current);
  }, [fetchLogs]);

  return (
    <div className="calcCont">
      <Calculator onResult={sendLogs} />
      <CalcHistory {...logState} />
    </div>
  );
};
