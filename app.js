(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const expression = $("#expression");
  const answerPreview = $("#answer-preview");
  const message = $("#calculator-message");
  const homeScreen = $("#home-screen");
  const solutionScreen = $("#solution-screen");
  const sheet = $("#explanation-sheet");
  let currentExpression = "";

  const connectionStatus = $("#connection-status");
  function updateConnectionStatus() {
    const online = navigator.onLine;
    connectionStatus.textContent = online ? "ऑनलाइन · Online" : "ऑफलाइन · Offline";
    connectionStatus.classList.toggle("online", online);
    connectionStatus.classList.toggle("offline", !online);
  }
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  updateConnectionStatus();

  function renderExpression() {
    expression.textContent = currentExpression || "0";
    answerPreview.textContent = currentExpression ? "हल Phase 2 में आएगा · Solving in Phase 2" : "अपना सवाल लिखें · Enter a question";
  }
  function insert(value) {
    if (currentExpression.length >= 48) {
      message.textContent = "अभी अधिकतम 48 अक्षर लिख सकते हैं · 48 character limit";
      return;
    }
    currentExpression += value;
    renderExpression();
    message.textContent = "सवाल तैयार करें · Build your expression";
  }
  function clearExpression() {
    currentExpression = "";
    renderExpression();
    message.textContent = "साफ़ किया गया · Cleared";
  }
  function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    renderExpression();
  }
  function insertParentheses() {
    const opens = (currentExpression.match(/\(/g) || []).length;
    const closes = (currentExpression.match(/\)/g) || []).length;
    insert(opens > closes ? ")" : "(");
  }
  function showSolution() {
    $("#solution-question").textContent = currentExpression || "—";
    homeScreen.classList.add("hidden");
    solutionScreen.classList.remove("hidden");
    window.scrollTo(0, 0);
  }
  function showHome() {
    solutionScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    window.scrollTo(0, 0);
  }
  function openStep(step) {
    const first = step === "1";
    $("#sheet-title").textContent = first ? "पहला चरण · Step one" : "दूसरा चरण · Step two";
    $("#sheet-reason").textContent = first
      ? "यह UI नमूना है। असली सवाल में यहाँ बताया जाएगा कि यह गणितीय कदम क्यों उठाया गया।"
      : "यह UI नमूना है। असली सवाल में यहाँ अगले कदम का आसान हिंदी कारण दिखेगा।";
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
      message.textContent = "सत्यापित हल Engine v1 में आएगा · Verified solving arrives in Phase 2";
    } else if (button.dataset.key) insert(button.dataset.key);
  });

  $("#show-solution").addEventListener("click", showSolution);
  $("#back-home").addEventListener("click", showHome);
  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => openStep(button.dataset.step));
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
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {
      message.textContent = "ऑफलाइन अपडेट के लिए पेज दोबारा खोलें · Reload to refresh offline files";
    });
  }
  renderExpression();
})();
