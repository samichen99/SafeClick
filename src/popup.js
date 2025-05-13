document.addEventListener("DOMContentLoaded", function () {
  const protectBtn = document.querySelector(".protect-btn");
  const reportBtn = document.querySelector(".report-btn");
  const adBlockToggle = document.getElementById("toggleAdBlock");
  const adCountDisplay = document.getElementById("adBlockCountDisplay");

  // Initialize counter display
  adCountDisplay.textContent = "Ads bloquées: 0";

  // === Protection button state ===
  chrome.storage.local.get(["adBlockEnabled"], function (data) {
    const enabled = data.adBlockEnabled || false;
    adBlockToggle.checked = enabled;
    protectBtn.textContent = enabled ? "Protection active ✅" : "Activer la protection";
    protectBtn.style.background = enabled ? "#00c853" : 'linear-gradient(to right, #00c6ff, #327dd8)';
    protectBtn.style.cursor = enabled ? "default" : "pointer";
  });

  // === Toggle protection button===
  protectBtn.addEventListener("click", function () {
    const isActive = protectBtn.textContent === "Protection active ✅";
    const newState = !isActive;

    adBlockToggle.checked = newState;
    protectBtn.textContent = newState ? "Protection active ✅" : "Activer la protection";
    protectBtn.style.background = newState ? "#00c853" : 'linear-gradient(to right, #00c6ff, #327dd8)';
    protectBtn.style.cursor = newState ? "default" : "pointer";

    chrome.storage.local.set({ adBlockEnabled: newState });
    chrome.runtime.sendMessage({ type: "TOGGLE_ADBLOCK", enabled: newState });
  });

  // === Toggle protection switch===
  adBlockToggle.addEventListener("change", function () {
    const enabled = adBlockToggle.checked;
    chrome.storage.local.set({ adBlockEnabled: enabled });
    chrome.runtime.sendMessage({ type: "TOGGLE_ADBLOCK", enabled });

    protectBtn.textContent = enabled ? "Protection active ✅" : "Activer la protection";
    protectBtn.style.background = enabled ? "#00c853" : 'linear-gradient(to right, #00c6ff, #327dd8)';
    protectBtn.style.cursor = enabled ? "default" : "pointer";
  });

  // === Update ad counter ===

  function updateCounterDisplay(count) {
    adCountDisplay.textContent = `Ads bloquées: ${count}`;
    adCountDisplay.classList.add('counter-update');
    setTimeout(() => {
      adCountDisplay.classList.remove('counter-update');
    }, 300);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "UPDATE_ADBLOCK_COUNTER") {
      updateCounterDisplay(message.count);
    }
    return true;
  });

  chrome.runtime.sendMessage({ type: "GET_ADBLOCK_COUNTER" }, (response) => {
    if (response && typeof response.count !== "undefined") {
      updateCounterDisplay(response.count);
    }
  });

  // === Report function ===
  function reportSuspiciousSite(url, reason = "User reported as suspicious") {
    fetch("http://localhost:8080/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: url, reason: reason })
    })
    .then(response => {
      if (response.ok) {
        alert("Site successfully reported!");
      } else {
        alert("Failed to report site.");
      }
    })
    .catch(error => {
      console.error("Error reporting site:", error);
      alert("Error contacting the reporting server.");
    });
  }

  reportBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
      reportSuspiciousSite(url);
    });
  });

  // === Threat detail ===

const loadDetailsBtn = document.getElementById("loadDetailsBtn");
const detailsDropdown = document.getElementById("detailsDropdown");
const urlDisplay = document.getElementById("checkedUrl");
const threatTypeDisplay = document.getElementById("threatType");
const platformDisplay = document.getElementById("platformType");
const statusDisplay = document.getElementById("threatStatus");
const threatDetailBox = document.getElementById("threatDetails");
const labels = document.getElementsByClassName("label");
document.getElementById('threatStatus').innerHTML = '<span id="errorIcon"></span>Erreur lors du chargement.';


  loadDetailsBtn.addEventListener("click", function () {
    chrome.runtime.sendMessage({ type: "GET_THREAT_INFO" }, function (response) {
      console.log("Réponse reçue :", response);

      if( detailsDropdown.style.display === "block" ) {
        detailsDropdown.style.display = "none";
        return;
      }

      if (response && response.url) {
        urlDisplay.textContent = response.url;

        if (response.threatInfo) {
          threatTypeDisplay.textContent = response.threatInfo.threatType || "inconnu";
          platformDisplay.textContent = response.threatInfo.platformType || "inconnu";
          statusDisplay.textContent = "🚨 Menace détectée !";
          statusDisplay.style.color = "red";

          for( label of labels ) {
            label.style.color = "red";
          }
        } else {
          threatTypeDisplay.textContent = "-";
          platformDisplay.textContent = "-";
          statusDisplay.textContent = "✅ Aucun problème détecté.";
          statusDisplay.style.color = "green";

          for( label of labels ) {
            label.style.color = "green";
          }
        }

        detailsDropdown.style.display = "block";
      } else {
        urlDisplay.textContent = "-";
        threatTypeDisplay.textContent = "-";
        platformDisplay.textContent = "-";
        statusDisplay.textContent = "⚠️ Erreur lors du chargement.";
        statusDisplay.style.color = "#327dd8";
        threatDetailBox.style.color = "#327dd8";
        detailsDropdown.style.display = "block";
      }
      
    });
  });
});

