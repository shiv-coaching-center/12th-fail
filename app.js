(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const expression = $("#expression");
  const answerPreview = $("#answer-preview");
  const message = $("#calculator-message");
  const homeScreen = $("#home-screen");
  const solutionScreen = $("#solution-screen");
  const sheet = $("#explanation-sheet");
  const stepList = $("#step-list");
  const stepsHeading = $("#steps-heading");
  let currentExpression = "";
  let currentResult = null;
  let reasons = null;
  let selectedStep = null;

  const math = window.TwelfthFailMath;
  const reasonsReady = fetch("./reasons_hi.json?v=0.3.0", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("REASONS_UNAVAILABLE");
      return response.json();
    })
    .then((data) => {
      reasons = data;
      return data;
    })
    .catch(() => {
      reasons = null;
      message.textContent = "हल अभी उपलब्ध नहीं है";
      return null;
    });

  function renderExpression() {
    expression.textContent = currentExpression || "0";
  }

  function resetAnswer() {
    currentResult = null;
    answerPreview.textContent = "—";
    answerPreview.classList.remove("is-message");
    answerPreview.closest(".answer-result")?.classList.remove("has-message");
    message.textContent = "";
  }

  function showUnavailable() {
    currentResult = null;
    answerPreview.textContent = "हल उपलब्ध नहीं";
    answerPreview.classList.add("is-message");
    answerPreview.closest(".answer-result")?.classList.add("has-message");
    message.textContent = "हल उपलब्ध नहीं";
  }

  function insert(value) {
    if (currentExpression.length >= 48) {
      message.textContent = "अभी अधिकतम 48 अक्षर लिख सकते हैं";
      return;
    }
    currentExpression += value;
    resetAnswer();
    renderExpression();
  }

  function clearExpression() {
    currentExpression = "";
    resetAnswer();
    renderExpression();
  }

  function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    resetAnswer();
    renderExpression();
  }

  function insertParentheses() {
    const opens = (currentExpression.match(/\(/g) || []).length;
    const closes = (currentExpression.match(/\)/g) || []).length;
    insert(opens > closes ? ")" : "(");
  }

  async function calculate() {
    await reasonsReady;
    const isEquation = currentExpression.includes("=");
    const solver = isEquation ? math?.solveEquation : math?.solve;
    if (!math || typeof solver !== "function" || !reasons) {
      showUnavailable();
      return null;
    }
    const result = solver(currentExpression, reasons);
    if (!result.ok || result.verified !== true) {
      showUnavailable();
      return null;
    }
    currentResult = result;
    answerPreview.textContent = result.answer;
    message.textContent = "उत्तर सत्यापित है";
    return result;
  }

  function renderSteps(steps) {
    stepList.replaceChildren();
    stepsHeading.classList.toggle("hidden", steps.length === 0);
    steps.forEach((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "step-button";
      button.dataset.stepIndex = String(index);

      const number = document.createElement("span");
      number.className = "step-number";
      number.textContent = String(index + 1);

      const copy = document.createElement("span");
      copy.className = "step-copy";
      const strong = document.createElement("strong");
      strong.textContent = step.display || (step.expression + " = " + step.result);
      copy.append(strong);

      const arrow = document.createElement("span");
      arrow.className = "step-arrow";
      arrow.textContent = "›";
      button.append(number, copy, arrow);
      stepList.append(button);
    });
  }

  async function showSolution() {
    const result = currentResult || await calculate();
    $("#solution-question").textContent = currentExpression || "—";
    const solutionAnswer = $("#solution-answer");
    solutionAnswer.textContent = result ? result.answer : "हल उपलब्ध नहीं";
    solutionAnswer.classList.toggle("is-message", !result);
    renderSteps(result ? result.steps : []);
    homeScreen.classList.add("hidden");
    solutionScreen.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  function showHome() {
    solutionScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    sheet.classList.add("hidden");
    window.scrollTo(0, 0);
  }

  function openStep(index) {
    if (!currentResult || !currentResult.steps[index]) return;
    selectedStep = currentResult.steps[index];
    $("#sheet-title").textContent = selectedStep.display || (selectedStep.expression + " = " + selectedStep.result);
    $("#sheet-reason").textContent = selectedStep.reason;
    $("#sheet-easier").classList.add("hidden");
    sheet.classList.remove("hidden");
  }

  $("#keypad").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.action === "clear") clearExpression();
    else if (button.dataset.action === "backspace") backspace();
    else if (button.dataset.action === "parentheses") insertParentheses();
    else if (button.dataset.action === "equals") {
      if (/[xX]/.test(currentExpression) && !currentExpression.includes("=")) insert("=");
      else calculate();
    }
    else if (button.dataset.key) insert(button.dataset.key);
  });

  $("#show-solution").addEventListener("click", showSolution);
  $("#back-home").addEventListener("click", showHome);
  stepList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-step-index]");
    if (button) openStep(Number(button.dataset.stepIndex));
  });
  $("#close-sheet").addEventListener("click", () => sheet.classList.add("hidden"));
  $("#easier-button").addEventListener("click", () => $("#sheet-easier").classList.toggle("hidden"));
  sheet.addEventListener("click", (event) => {
    if (event.target === sheet) sheet.classList.add("hidden");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") sheet.classList.add("hidden");
  });

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("./sw.js?v=10", { scope: "./" }).catch(() => {
      message.textContent = "ऑफलाइन अपडेट के लिए पेज दोबारा खोलें";
    });
  }
  renderExpression();
})();