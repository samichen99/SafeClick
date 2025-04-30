document.addEventListener("DOMContentLoaded", function () {
  const protectBtn = document.querySelector(".protect-btn");
  const reportBtn = document.querySelector(".report-btn");
  const siteInput = document.querySelector('input[type="text"]');
  const blockedSitesList = document.getElementById("blockedSites");
  const adBlockToggle = document.getElementById("toggleAdBlock");
  const adCountDisplay = document.getElementById("adBlockCountDisplay");

  function addSiteToList(site) {
    const li = document.createElement("li");
    li.textContent = site;
    blockedSitesList.appendChild(li);
  }

  function updateListUI(sites) {
    blockedSitesList.innerHTML = "";
    if (sites.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Aucun site bloqué pour le moment.";
      li.style.fontFamily = "Segoe UI";
      li.style.fontWeight = "bold";
      li.style.color = "#327dd8";
      blockedSitesList.appendChild(li);
    } else {
      sites.forEach(addSiteToList);
    }
  }

  chrome.storage.local.get("blockedSites", function (data) {
    const sites = data.blockedSites || [];
    updateListUI(sites);
  });

  // Sync UI with current state
  chrome.storage.local.get(["adBlockEnabled"], function (data) {
    const enabled = data.adBlockEnabled || false;
    adBlockToggle.checked = enabled;
    protectBtn.textContent = enabled ? "Protection active ✅" : "Activer la protection";
    protectBtn.style.background = enabled ? "#00c853" : 'linear-gradient(to right, #00c6ff, #327dd8)';
    protectBtn.style.cursor = enabled ? "default" : "pointer";
  });

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

  adBlockToggle.addEventListener("change", function () {
    const enabled = adBlockToggle.checked;
    chrome.storage.local.set({ adBlockEnabled: enabled });
    chrome.runtime.sendMessage({ type: "TOGGLE_ADBLOCK", enabled });

    protectBtn.textContent = enabled ? "Protection active ✅" : "Activer la protection";
    protectBtn.style.background = enabled ? "#00c853" : 'linear-gradient(to right, #00c6ff, #327dd8)';
    protectBtn.style.cursor = enabled ? "default" : "pointer";
  });

  reportBtn.addEventListener("click", function () {
    const site = siteInput.value.trim().toLowerCase();
    if (site) {
      chrome.storage.local.get("blockedSites", function (data) {
        let sites = data.blockedSites || [];
        if (!sites.includes(site)) {
          sites.push(site);
          chrome.storage.local.set({ blockedSites: sites }, function () {
            updateListUI(sites);
            siteInput.value = "";
          });
        } else {
          alert("⚠️ Ce site est déjà signalé.");
        }
      });
    }
  });

  // Update counter display
  function updateCounterDisplay(count) {
    adCountDisplay.textContent = `Ads bloquées: ${count}`;
  }

  // Initial counter update
  chrome.runtime.sendMessage({ type: "GET_ADBLOCK_COUNTER" }, function (res) {
    updateCounterDisplay(res.count);
  });

  // Listen for counter updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "UPDATE_ADBLOCK_COUNTER") {
      updateCounterDisplay(message.count);
    }
  });
});
