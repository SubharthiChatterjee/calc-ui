const isDigit = (digit) => /\d/.test(digit);

export const parseCalcV1 = (s) => {
  const stack = [];
  let sign = "+";
  let num = 0;
  let c;
  for (let i = 0; i < s.length; i++) {
    let k = i;
    if (isDigit(s[k])) {
      c = "";
      while (k < s.length && isDigit(s[k])) {
        c += s[k];
        k++;
      }
      i = k - 1;
    } else c = s[i];
    if (isDigit(c)) num = Number(c);
    if (
      i + 1 === s.length ||
      c === "+" ||
      c === "-" ||
      c === "*" ||
      c === "/"
    ) {
      if (sign === "+") stack.push(num);
      else if (sign === "-") stack.push(-num);
      else if (sign === "*")
        stack[stack.length - 1] = stack[stack.length - 1] * num;
      else if (sign === "/")
        stack[stack.length - 1] = Number(stack[stack.length - 1] / Number(num));
      sign = c;
      num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);
};
