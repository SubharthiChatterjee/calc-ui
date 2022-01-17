import React, { useState, useEffect, useCallback, useRef } from "react";
import ButtonComponent from "../../components/button/button.components";
import CalcHistory from "../../components/history";
import { usePrevious } from "../../hooks/usePrevious";
import { API_POINTS, useApi } from "../../hooks/useApi";
import "./calc.style.css";

const Calc = () => {
  const [calculation, setCalculation] = useState([0]);
  const [result, setResult] = useState(0);
  const [opera, setOpera] = useState(null);
  const [prevResult, setPrevResult] = useState(null);
  const timerHandle = useRef(null);

  // calc result, expression
  const [userCompute, setUserCompute] = useState(null);
  const prevUserCompute = usePrevious(userCompute);
  const [logState, setLogState] = useState({ logs: [], isLoading: true });

  const logsApi = useApi(API_POINTS.LOGS);
  const updateLogsApi = useApi(API_POINTS.UPDATE_LOGS);
  const fetchLogs = useCallback(async () => await logsApi(), [logsApi]);
  const updateLogs = useCallback(
    async (payload) => await updateLogsApi({ data: payload }),
    [updateLogsApi]
  );

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
    return () => {
      timerHandle?.current && clearInterval(timerHandle.current);
    };
  }, [fetchLogs]);

  useEffect(() => {
    if (userCompute && userCompute.expression !== prevUserCompute?.expression) {
      updateLogs({ ...userCompute });
    }
  }, [userCompute, updateLogs, prevUserCompute]);

  useEffect(() => {
    setCalculation([0]);
    setResult(0);
  }, []);

  useEffect(() => {
    if (opera != null) {
      let itemBeforeOperator = 0;
      let itemAfterOperator = 0;
      let operatorFound = false;
      const length = calculation.length;
      for (let i = length - 1; i >= 0; i--) {
        if (calculation[i] !== "$") {
          if (opera === calculation[i]) {
            operatorFound = true;
            continue;
          }
          if (operatorFound) {
            if (result !== 0) {
              itemBeforeOperator = result;
            } else {
              itemBeforeOperator =
                itemBeforeOperator === 0
                  ? calculation[i]
                  : calculation[i] + itemBeforeOperator;
            }
          } else {
            itemAfterOperator =
              itemAfterOperator === 0
                ? calculation[i]
                : calculation[i] + itemAfterOperator;
          }
        } else {
          if (result !== 0) {
            //console.log("Resultwokring")
            itemBeforeOperator = result;
          }
          break;
        }
      }

      const lastItem = calculation[calculation.length - 1];
      if (lastItem !== opera) {
        setPrevResult(prevResult);
        let updatedResult = 0;
        switch (opera) {
          case "%":
            updatedResult = itemBeforeOperator % itemAfterOperator;
            setResult(updatedResult);
            break;
          case "/":
            updatedResult = itemBeforeOperator / itemAfterOperator;
            setResult(updatedResult);
            break;
          case "*":
            updatedResult = itemBeforeOperator * itemAfterOperator;
            setResult(updatedResult);
            break;
          case "+":
            updatedResult =
              parseInt(itemBeforeOperator) + parseInt(itemAfterOperator);
            setResult(updatedResult);
            break;
          case "-":
            updatedResult = itemBeforeOperator - itemAfterOperator;
            setResult(updatedResult);
            break;
          default:
            return;
        }
      }
    } else {
      return;
    }
  }, [opera, calculation]);

  const num_handle = (value) => {
    if (calculation.length === 1 && calculation.indexOf(0) === 0) {
      setCalculation([value]);
    } else {
      setCalculation([...calculation, value]);
    }
    //console.log("num_handle :: " + value);
  };

  const special_handle = (value) => {
    if (calculation.length === 1 && calculation[calculation.length - 1] === 0) {
      return;
    }
    switch (value) {
      case "C":
        setCalculation([0]);
        setResult(0);
        setOpera(null);
        return;
      case "%":
        updateCalculation("%");
        setOpera("%");
        break;
      case "/":
        updateCalculation("/");
        setOpera("/");
        break;
      case "+":
        updateCalculation("+");
        setOpera("+");
        break;
      case "-":
        updateCalculation("-");
        setOpera("-");
        break;
      case "*":
        updateCalculation("*");
        setOpera("*");
        break;
      case "del":
        if (calculation.length === 1) {
          if (result === calculation[calculation.length - 1]) {
            setCalculation([0]);
            setResult(0);
          }
        }
        const newCalculation = calculation.pop();
        if (newCalculation.length) {
          setResult(prevResult);
          setCalculation([...calculation]);
        } else {
          setCalculation([0]);
          setResult(0);
        }

        return;
      case ".":
        setCalculation([...calculation, "."]);
        return;
      case "=":
        setCalculation([result]);
        setOpera(null);
        const exp = calculation?.filter((calc) => calc !== "$");
        if (exp.length > 1) {
          setUserCompute({
            result,
            expression: exp.join(""),
          });
        }
        return;
      default:
        return;
    }
  };

  const updateCalculation = (value) => {
    if (result !== 0) {
      setPrevResult(result);
      setCalculation([...calculation, "$", value]);
    } else {
      setCalculation([...calculation, value]);
    }
  };

  const showCalculation = () => {
    return calculation.filter((item) => item !== "$");
  };

  return (
    <>
      <div className="calcCont">
        <div className="calcWrapper">
          <div className="calc">
            <div className="show-calculation">
              <span className="result-calculation">{showCalculation()}</span>
              <span className="dashed-line" />
              <span className="final-result">
                {result === 0 ? "Start Calculating" : result}
              </span>
            </div>
            <div className="button-layout">
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                C
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                ≠
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                %
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                /
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                7
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                8
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                9
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                *
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                4
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                5
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                6
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                -
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                1
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                2
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                3
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                +
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                .
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => num_handle(value)}>
                0
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                del
              </ButtonComponent>
              <ButtonComponent handleClick={(value) => special_handle(value)}>
                =
              </ButtonComponent>
            </div>
          </div>
        </div>

        <CalcHistory {...logState} />
      </div>
    </>
  );
};

export default Calc;
