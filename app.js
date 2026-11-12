(() => {
  "use strict";
  const connectionStatus = document.getElementById("connection-status");
  const offlineState = document.getElementById("offline-state");
  function updateConnectionStatus() {
    const online = navigator.onLine;
    connectionStatus.textContent = online ? "ऑनलाइन · Online" : "ऑफलाइन · Offline";
    connectionStatus.classList.toggle("online", online);
    connectionStatus.classList.toggle("offline", !online);
  }
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  updateConnectionStatus();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .then(() => { offlineState.textContent = "कैश सक्रिय · Cache enabled"; })
      .catch(() => { offlineState.textContent = "फिर कोशिश करें · Retry needed"; });
  } else {
    offlineState.textContent = "HTTPS जरूरी · HTTPS required";
  }
})();
