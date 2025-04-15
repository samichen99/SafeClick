document.addEventListener("DOMContentLoaded", function () {
  const protectBtn = document.querySelector(".protect-btn");
  const reportBtn = document.querySelector(".report-btn");
  const siteInput = document.querySelector('input[type="text"]');
  const blockedSitesList = document.getElementById("blockedSites");

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
      li.style.fontStyle = "italic";
      blockedSitesList.appendChild(li);
    } else {
      sites.forEach(addSiteToList);
    }
  }

  
  chrome.storage.local.get("blockedSites", function (data) {
    const sites = data.blockedSites || [];
    updateListUI(sites);
  });

  protectBtn.addEventListener("click", function () {
    protectBtn.textContent = "Protection active ✅";
    protectBtn.disabled = true;
    protectBtn.style.background = "#00c853";
    protectBtn.style.cursor = "default";
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
});
