
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");
const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistory");

function appendValue(value) {
  if (display.value === "Error") display.value = "";
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
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

// Calculation History
let calculationHistory = [];

try {
  calculationHistory = JSON.parse(
    localStorage.getItem("calculatorHistory")
  ) || [];
} catch {
  calculationHistory = [];
}

function saveHistory() {
  localStorage.setItem(
    "calculatorHistory",
    JSON.stringify(calculationHistory)
  );
}

function showHistory() {
  historyList.innerHTML = "";

  calculationHistory.forEach(function(item) {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function addToHistory(expression, result) {
  calculationHistory.unshift(expression + " = " + result);

  calculationHistory = calculationHistory.slice(0, 30);

  saveHistory();
  showHistory();
}

function calculate() {
  try {
    const expression = display.value;
    const result = evaluateExpression(expression);
    const answer = String(Number(result.toPrecision(12)));

    display.value = answer;
    addToHistory(expression, answer);
  } catch {
    display.value = "Error";
  }
}

function getCurrentNumber() {
  const match = display.value.match(/-?\d*\.?\d+$/);
  return match ? Number(match[0]) : null;
}

function replaceCurrentNumber(number) {
  display.value = display.value.replace(
    /-?\d*\.?\d+$/,
    String(number)
  );
}

function squareRoot() {
  const number = getCurrentNumber();
  if (number === null || number < 0) return;

  replaceCurrentNumber(Math.sqrt(number));
}

function squareNumber() {
  const number = getCurrentNumber();
  if (number === null) return;

  replaceCurrentNumber(number * number);
}

function reciprocal() {
  const number = getCurrentNumber();
  if (number === null || number === 0) return;

  replaceCurrentNumber(1 / number);
}

function toggleSign() {
  const number = getCurrentNumber();
  if (number === null) return;

  replaceCurrentNumber(-number);
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

clearHistoryButton.addEventListener("click", function() {
  calculationHistory = [];
  saveHistory();
  showHistory();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Escape") {
    clearDisplay();
  } else if (event.key === "Backspace") {
    deleteLast();
  }
});
// Dark / Light Mode
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeToggle.textContent = "🌙 Dark Mode";
    } else {
        themeToggle.textContent = "☀️ Light Mode";
    }
});
// Save Theme Preference
const savedTheme = localStorage.getItem("calculatorTheme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "🌙 Dark Mode";
}
showHistory();
