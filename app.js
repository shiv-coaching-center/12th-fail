(() => {
  "use strict";

  const status = document.getElementById("connection-status");
  const dot = document.getElementById("connection-dot");
  const updateCard = document.getElementById("update-card");
  const updateButton = document.getElementById("update-button");
  let refreshing = false;
  let registration = null;

  function renderConnection() {
    const online = navigator.onLine;
    const controlled = Boolean(navigator.serviceWorker && navigator.serviceWorker.controller);
    status.textContent = online
      ? (controlled ? "ऑनलाइन · ऑफलाइन उपयोग के लिए तैयार" : "ऑनलाइन · ऑफलाइन सेटअप हो रहा है")
      : (controlled ? "ऑफलाइन · ऐप उपलब्ध है" : "ऑफलाइन · पहली बार ऑनलाइन खोलें");
    dot.classList.toggle("is-online", online);
    dot.classList.toggle("is-offline", !online);
  }

  window.addEventListener("online", renderConnection);
  window.addEventListener("offline", renderConnection);
  renderConnection();

  if (!("serviceWorker" in navigator)) {
    status.textContent = navigator.onLine ? "इस ब्राउज़र में ऑफलाइन सुविधा उपलब्ध नहीं है" : "ऑफलाइन सुविधा के लिए Service Worker आवश्यक है";
    return;
  }

  function showUpdate(worker) {
    if (!worker) return;
    updateCard.hidden = false;
    updateButton.onclick = () => {
      updateButton.disabled = true;
      updateButton.textContent = "अपडेट हो रहा है…";
      worker.postMessage({ type: "SKIP_WAITING" });
    };
  }

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  navigator.serviceWorker.register("./sw.js")
    .then((reg) => {
      registration = reg;
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);

      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            showUpdate(reg.waiting || installing);
          }
        });
      });

      window.addEventListener("load", () => {
        if (registration) registration.update().catch(() => {});
      });
    })
    .catch(() => {
      status.textContent = navigator.onLine ? "ऐप खुला है · ऑफलाइन सेटअप पूरा नहीं हुआ" : "ऑफलाइन सेटअप उपलब्ध नहीं है";
    });
})();
