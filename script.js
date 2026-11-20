
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

function appendValue(value) {
  if (display.value === "Error") {
    display.value = "0";
  }

  if (display.value === "0" && value !== "." &&
      !["+", "-", "*", "/", "%", ")"].includes(value)) {
    display.value = value;
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  display.value = "0";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);

  if (display.value === "" || display.value === "Error") {
    display.value = "0";
  }
}

function evaluateExpression(expression) {
  if (!/^[0-9+\-*/.%() ]+$/.test(expression)) {
    throw new Error("Invalid input");
  }

  expression = expression.replace(
    /(\d+(?:\.\d+)?)%/g,
    "($1/100)"
  );

  const result = Function(
    '"use strict"; return (' + expression + ')'
  )();

  if (!Number.isFinite(result)) {
    throw new Error("Invalid calculation");
  }

  return result;
}

function calculate() {
  try {
    const result = evaluateExpression(display.value);
    display.value = String(Number(result.toPrecision(12)));
  } catch {
    display.value = "Error";
  }
}

function getCurrentNumber() {
  const value = evaluateExpression(display.value);
  return value;
}

function squareRoot() {
  try {
    const value = getCurrentNumber();

    if (value < 0) throw new Error();

    display.value = String(Math.sqrt(value));
  } catch {
    display.value = "Error";
  }
}

function squareNumber() {
  try {
    const value = getCurrentNumber();
    display.value = String(value * value);
  } catch {
    display.value = "Error";
  }
}

function reciprocal() {
  try {
    const value = getCurrentNumber();

    if (value === 0) throw new Error();

    display.value = String(1 / value);
  } catch {
    display.value = "Error";
  }
}

function toggleSign() {
  try {
    let value = getCurrentNumber();

    display.value = String(value * -1);
  } catch {
    display.value = "Error";
  }
}

buttons.addEventListener("click", function(event) {
  const button = event.target.closest("button");

  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value !== undefined) {
    appendValue(value);
    return;
  }

  switch (action) {
    case "clear":
      clearDisplay();
      break;

    case "delete":
      deleteLast();
      break;

    case "calculate":
      calculate();
      break;

    case "sqrt":
      squareRoot();
      break;

    case "square":
      squareNumber();
      break;

    case "reciprocal":
      reciprocal();
      break;

    case "sign":
      toggleSign();
      break;
  }
});

document.addEventListener("keydown", function(event) {
  const key = event.key;

  if (/^[0-9.+\-*/()%]$/.test(key)) {
    appendValue(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
