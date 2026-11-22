
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
  if (!/^[0-9+\-*/.%() ]+$/.test(expression.replace(/\*\*/g, ""))) {
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
    li.style.cursor = "pointer";

    li.addEventListener("click", function() {
      const result = item.split(" = ").pop();
      display.value = result;
    });

    historyList.appendChild(li);
  });
}

function addToHistory(expression, result) {
  calculationHistory.unshift(expression + " = " + result);

  calculationHistory = calculationHistory.slice(0, 30);

  saveHistory();
  showHistory();
}

// Previous Answer
let lastAnswer = "0";
function calculate() {
  try {
    const expression = display.value;
    const result = evaluateExpression(expression);
    const answer = String(Number(result.toPrecision(12)));

    display.value = answer;
    lastAnswer = answer;
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
// Memory Calculator

let memoryValue = 0;

const memoryAddButton = document.getElementById("memoryAdd");
const memorySubtractButton = document.getElementById("memorySubtract");
const memoryRecallButton = document.getElementById("memoryRecall");
const memoryClearButton = document.getElementById("memoryClear");

memoryAddButton.addEventListener("click", function() {
  const number = getCurrentNumber();
  if (number !== null) memoryValue += number;
});

memorySubtractButton.addEventListener("click", function() {
  const number = getCurrentNumber();
  if (number !== null) memoryValue -= number;
});

memoryRecallButton.addEventListener("click", function() {
  display.value = String(memoryValue);
});

memoryClearButton.addEventListener("click", function() {
  memoryValue = 0;
});
// Scientific Calculator Functions
// DEG / RAD Mode

let angleMode = "DEG";

const angleModeButton = document.getElementById("angleMode");

angleModeButton.addEventListener("click", function() {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  angleModeButton.textContent = angleMode;
});

function applyScientificFunction(fn) {
  const number = getCurrentNumber();
  if (number === null) return;

  const result = fn(number);

  if (!Number.isFinite(result)) {
    display.value = "Error";
    return;
  }

  replaceCurrentNumber(Number(result.toPrecision(12)));
}
function insertPi() {
  const pi = String(Math.PI);

  if (display.value === "0" || display.value === "Error" || display.value === "") {
    display.value = pi;
  } else {
    display.value += pi;
  }
}

function insertEuler() {
  const e = String(Math.E);

  if (display.value === "0" || display.value === "Error" || display.value === "") {
    display.value = e;
  } else {
    display.value += e;
  }
}
function calculateFactorial() {
  const number = getCurrentNumber();

  if (number === null || number < 0 || !Number.isInteger(number) || number > 170) {
    display.value = "Error";
    return;
  }

  let result = 1;

  for (let i = 2; i <= number; i++) {
    result *= i;
  }

  replaceCurrentNumber(result);
}

// Standard and Scientific Mode Switch

const standardModeButton = document.getElementById("standardMode");
const scientificModeButton = document.getElementById("scientificMode");

const standardPanel = document.getElementById("standardPanel");
const scientificPanel = document.getElementById("scientificPanel");

standardPanel.style.display = "grid";
scientificPanel.style.display = "none";
scientificPanel.hidden = false;

standardModeButton.addEventListener("click", function() {
  standardPanel.style.display = "grid";
  scientificPanel.style.display = "none";
});

scientificModeButton.addEventListener("click", function() {
  standardPanel.style.display = "none";
  scientificPanel.style.display = "grid";
});
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
      case "answer":
  display.value = lastAnswer;
  break;
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
          case "sin":
  applyScientificFunction(n =>
    Math.sin(angleMode === "DEG" ? n * Math.PI / 180 : n)
  );
  break;

case "cos":
  applyScientificFunction(n =>
    Math.cos(angleMode === "DEG" ? n * Math.PI / 180 : n)
  );
  break;

case "tan":
  applyScientificFunction(n =>
    Math.tan(angleMode === "DEG" ? n * Math.PI / 180 : n)
  );
  break;
    case "log":
      applyScientificFunction(Math.log10);
      break;
    case "ln":
      applyScientificFunction(Math.log);
      break;
    case "pi":
      insertPi();
      break;
      case "e":
  insertEuler();
  break;
    case "power":
      appendValue("**");
      break;
    case "factorial":
      calculateFactorial();
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
      localStorage.setItem("calculatorTheme", "light");
    } else {
        themeToggle.textContent = "☀️ Light Mode";
      localStorage.setItem("calculatorTheme", "dark");
    }
});
// Save Theme Preference
const savedTheme = localStorage.getItem("calculatorTheme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "🌙 Dark Mode";
}
showHistory();
// Copy Calculator Result
const copyButton = document.getElementById("copyResult");

copyButton.addEventListener("click", async function () {
    const result = document.getElementById("display").value;

    try {
        await navigator.clipboard.writeText(result);
        copyButton.textContent = "✅ Copied!";
    } catch (error) {
        copyButton.textContent = "❌ Copy Failed";
    }

    setTimeout(function () {
        copyButton.textContent = "📋 Copy Result";
    }, 2000);
});
// Button Sound Feedback
const buttonSound = new Audio(
  "https://actions.google.com/sounds/v1/cartoon/pop.ogg"
);

buttons.addEventListener("click", function(event) {
  const button = event.target.closest("button");
  if (!button) return;

  buttonSound.currentTime = 0;
  buttonSound.play().catch(() => {});
});
// Sound On / Off Toggle
const soundToggle = document.getElementById("soundToggle");
let soundEnabled = true;

soundToggle.addEventListener("click", function() {
  soundEnabled = !soundEnabled;
  buttonSound.muted = !soundEnabled;

  soundToggle.textContent = soundEnabled
    ? "🔊 Sound On"
    : "🔇 Sound Off";
});
// Export Calculation History
const exportHistoryButton = document.getElementById("exportHistory");

exportHistoryButton.addEventListener("click", function() {
  const historyText = calculationHistory.join("\n");

  const file = new Blob([historyText], {
    type: "text/plain"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "Calculator-History.txt";
  link.click();

  URL.revokeObjectURL(link.href);
});
// Percentage Calculator

const percentNumber = document.getElementById("percentNumber");
const percentValue = document.getElementById("percentValue");
const calculatePercentage = document.getElementById("calculatePercentage");
const percentageResult = document.getElementById("percentageResult");

calculatePercentage.addEventListener("click", function() {
  const number = Number(percentNumber.value);
  const percentage = Number(percentValue.value);

  if (percentNumber.value === "" || percentValue.value === "") {
    percentageResult.textContent = "Please enter both numbers";
    return;
  }

  const result = (number * percentage) / 100;

  percentageResult.textContent = "Result: " + Number(result.toFixed(8));
});
// Discount Calculator

const originalPrice = document.getElementById("originalPrice");
const discountPercent = document.getElementById("discountPercent");
const calculateDiscount = document.getElementById("calculateDiscount");
const discountAmount = document.getElementById("discountAmount");
const finalPrice = document.getElementById("finalPrice");

calculateDiscount.addEventListener("click", function() {
  const price = Number(originalPrice.value);
  const discount = Number(discountPercent.value);

  if (originalPrice.value === "" || discountPercent.value === "") {
    discountAmount.textContent = "Please enter both values";
    finalPrice.textContent = "";
    return;
  }

  if (price < 0 || discount < 0 || discount > 100) {
    discountAmount.textContent = "Enter valid values (0–100% discount)";
    finalPrice.textContent = "";
    return;
  }

  const saved = (price * discount) / 100;
  const total = price - saved;

  discountAmount.textContent = "Discount: " + Number(saved.toFixed(2));
  finalPrice.textContent = "Final Price: " + Number(total.toFixed(2));
});
// Tip Calculator

const billAmount = document.getElementById("billAmount");
const tipPercent = document.getElementById("tipPercent");
const calculateTip = document.getElementById("calculateTip");
const tipAmount = document.getElementById("tipAmount");
const totalBill = document.getElementById("totalBill");

calculateTip.addEventListener("click", function() {
  const bill = Number(billAmount.value);
  const percent = Number(tipPercent.value);

  if (billAmount.value === "" || tipPercent.value === "") {
    tipAmount.textContent = "Please enter both values";
    totalBill.textContent = "";
    return;
  }

  if (bill < 0 || percent < 0) {
    tipAmount.textContent = "Please enter valid values";
    totalBill.textContent = "";
    return;
  }

  const tip = (bill * percent) / 100;
  const total = bill + tip;

  tipAmount.textContent = "Tip: " + Number(tip.toFixed(2));
  totalBill.textContent = "Total Bill: " + Number(total.toFixed(2));
});
// BMI Calculator

const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const calculateBMI = document.getElementById("calculateBMI");
const bmiResult = document.getElementById("bmiResult");
const bmiCategory = document.getElementById("bmiCategory");

calculateBMI.addEventListener("click", function() {
  const weight = Number(weightInput.value);
  const height = Number(heightInput.value);

  if (weightInput.value === "" || heightInput.value === "") {
    bmiResult.textContent = "Please enter weight and height";
    bmiCategory.textContent = "";
    return;
  }

  if (weight <= 0 || height <= 0) {
    bmiResult.textContent = "Please enter valid values";
    bmiCategory.textContent = "";
    return;
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let category = "";

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 25) {
    category = "Normal Weight";
  } else if (bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obesity";
  }

  bmiResult.textContent = "BMI: " + bmi.toFixed(1);
  bmiCategory.textContent = "Category: " + category;
});
// Age Calculator

const birthDate = document.getElementById("birthDate");
const calculateAge = document.getElementById("calculateAge");
const ageResult = document.getElementById("ageResult");

calculateAge.addEventListener("click", function() {
  if (birthDate.value === "") {
    ageResult.textContent = "Please select your date of birth";
    return;
  }

  const today = new Date();
  const dob = new Date(birthDate.value + "T00:00:00");

  if (dob > today) {
    ageResult.textContent = "Date of birth cannot be in the future";
    return;
  }

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const previousMonthDays = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += previousMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  ageResult.textContent =
    "Your Age: " + years + " Years, " +
    months + " Months, " + days + " Days";
});
// Loan Calculator

const loanAmount = document.getElementById("loanAmount");
const interestRate = document.getElementById("interestRate");
const loanYears = document.getElementById("loanYears");

const calculateLoan = document.getElementById("calculateLoan");
const monthlyPayment = document.getElementById("monthlyPayment");
const totalPayment = document.getElementById("totalPayment");
const totalInterest = document.getElementById("totalInterest");

calculateLoan.addEventListener("click", function() {
  const principal = Number(loanAmount.value);
  const annualRate = Number(interestRate.value);
  const years = Number(loanYears.value);

  if (
    loanAmount.value === "" ||
    interestRate.value === "" ||
    loanYears.value === ""
  ) {
    monthlyPayment.textContent = "Please enter all values";
    totalPayment.textContent = "";
    totalInterest.textContent = "";
    return;
  }

  if (principal <= 0 || annualRate < 0 || years <= 0) {
    monthlyPayment.textContent = "Please enter valid values";
    totalPayment.textContent = "";
    totalInterest.textContent = "";
    return;
  }

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  let monthly;

  if (monthlyRate === 0) {
    monthly = principal / numberOfPayments;
  } else {
    monthly = principal * monthlyRate /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  }

  const total = monthly * numberOfPayments;
  const interest = total - principal;

  monthlyPayment.textContent =
    "Monthly Payment: " + monthly.toFixed(2);

  totalPayment.textContent =
    "Total Payment: " + total.toFixed(2);

  totalInterest.textContent =
    "Total Interest: " + interest.toFixed(2);
});
