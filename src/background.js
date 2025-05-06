//.la base de l'extention
chrome.webNavigation.onCompleted.addListener((details) => {
  let url = new URL(details.url);
  checkUrlSafety(url.href);
});
//..la fonction primaire de l'extention 
function checkUrlSafety(url) {
  fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyBIxikndngGPM6o7jB3qRnQahf_IU5m_tM`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          client: {
              clientId: "SafeClick",
              clientVersion: "0.1"
          },
          threatInfo: {
              threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
              platformTypes: ["ANY_PLATFORM"],
              threatEntryTypes: ["URL"],
              threatEntries: [{ url: url }]
          }
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.matches) {
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                  type: "PHISHING_WARNING",
                  url: url
              });
          });
  }
})
  .catch(error => console.error("Error checking URL safety:", error));
}

let adBlockCount = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TOGGLE_ADBLOCK") {
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: message.enabled ? ["adblock_rules"] : [],
      disableRulesetIds: message.enabled ? [] : ["adblock_rules"]
    });
  } else if (message.type === "GET_ADBLOCK_COUNTER") {
    sendResponse({ count: adBlockCount });
  }
  return true;
});

// Use onRuleMatchedDebug to count blocked ads
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  if (info.rule.ruleId >= 1) {
    adBlockCount++;
    chrome.runtime.sendMessage({
      type: "UPDATE_ADBLOCK_COUNTER",
      count: adBlockCount
    });
  }
});
