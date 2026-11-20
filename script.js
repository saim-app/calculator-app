
const display = document.getElementById("display");

function appendValue(value) {
  if (display.value === "0" || display.value === "Error") {
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
  if (display.value === "") {
    display.value = "0";
  }
}

function calculate() {
  try {
    let expression = display.value;

    if (!/^[0-9+\-*/.%() ]+$/.test(expression)) {
      throw new Error("Invalid input");
    }

    expression = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    const result = Function(
      '"use strict"; return (' + expression + ')'
    )();

    if (!Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    display.value = String(result);
  } catch {
    display.value = "Error";
  }
}
