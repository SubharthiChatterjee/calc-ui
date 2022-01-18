import React, { useState, useMemo } from "react";
import ButtonComponent from "../../components/button/button.components";
import { parseCalcV1 } from "../../utils/calc";
import "./calculator.style.css";

const TOKEN_TYPE = {
  DIGIT: "digit",
  OPERATOR: "operator",
  DOT: "dot",
};

const getType = (str) => {
  return /\./.test(str)
    ? TOKEN_TYPE.DOT
    : /\d+/.test(str)
    ? TOKEN_TYPE.DIGIT
    : TOKEN_TYPE.OPERATOR;
};

const doesOperatorExist = (expression) =>
  expression.some((calc) => getType(calc) === TOKEN_TYPE.OPERATOR);

export const Calculator = ({ onResult }) => {
  // ------------------ state ----------------------------------
  const [expression, setExpression] = useState([]);

  // ------------------ computed state ----------------------------------
  const calculationResult = useMemo(() => {
    const operatorExist = doesOperatorExist(expression);
    const res = operatorExist
      ? parseCalcV1(expression.join(""))
      : expression.join("");
    return res;
  }, [expression]);

  const lastTokenType = useMemo(() => {
    const last = expression.slice(-1).pop();
    const type = getType(last);
    return type;
  }, [expression]);

  // ------------------ event handlers ----------------------------------
  const onNumHandle = (value) => {
    const operators = ["%", "/", "+", "-", "*"];
    if (operators.includes(value) && lastTokenType !== TOKEN_TYPE.DIGIT) {
      return;
    }
    setExpression((prev) => prev.concat(value));
  };

  const onSpecialHandle = (value) => {
    switch (value) {
      case "C":
        setExpression([]);
        break;
      case "del":
        setExpression((prev) => prev.slice(0, -1));
        break;
      case ".":
        if (lastTokenType !== TOKEN_TYPE.DOT) {
          onNumHandle(".");
        }
        break;
      case "%":
      case "/":
      case "+":
      case "-":
      case "*":
        onNumHandle(value);
        break;
      case "=":
        const operatorExist = doesOperatorExist(expression);
        if (operatorExist) {
          const payload = {
            result: calculationResult,
            expression: expression.join(""),
          };
          setExpression([calculationResult]);
          onResult(payload);
        }
        return;
      case "≠":
        window.alert(`don't click this`);
        break;
      default:
        return;
    }
  };

  return (
    <div className="calcWrapper">
      <div className="calc">
        <div className="show-calculation">
          <span className="result-calculation">{expression}</span>
          <span className="dashed-line" />
          <span className="final-result">
            {calculationResult === "" ? "Enter calculation" : calculationResult}
          </span>
        </div>
        <div className="button-layout">
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            C
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            ≠
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            %
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            /
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            7
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            8
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            9
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            *
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            4
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            5
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            6
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            -
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            1
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            2
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            3
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            +
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            .
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onNumHandle(value)}>
            0
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            del
          </ButtonComponent>
          <ButtonComponent handleClick={(value) => onSpecialHandle(value)}>
            =
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};
