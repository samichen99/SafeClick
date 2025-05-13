let adBlockCount = 0;

let lastCheckResult = {
    url: "",
    threatInfo: null
};

// Vérifie chaque URL visitée
chrome.webNavigation.onCompleted.addListener((details) => {
    let url = new URL(details.url);
    checkUrlSafety(url.href);
});

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
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING","UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: url }]
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        lastCheckResult = {
            url,
            threatInfo: data.matches ? data.matches[0] : null
        };

        if (data.matches) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "PHISHING_WARNING",
                    url: url
                });
            });
        }
    })
    .catch(error => console.error("Erreur de vérification :", error));
}

// Gestion des messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_THREAT_INFO") {
        sendResponse(lastCheckResult);
    } else if (message.type === "TOGGLE_ADBLOCK") {
        chrome.declarativeNetRequest.updateEnabledRulesets({
            enableRulesetIds: message.enabled ? ["adblock_rules"] : [],
            disableRulesetIds: message.enabled ? [] : ["adblock_rules"]
        });
    } else if (message.type === "GET_ADBLOCK_COUNTER") {
        sendResponse({ count: adBlockCount });
    }

    return true;
});


// Compteur de publicités bloquées
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
    if (info.rule.ruleId >= 1) {
        adBlockCount++;
        chrome.runtime.sendMessage({
            type: "UPDATE_ADBLOCK_COUNTER",
            count: adBlockCount
        });
    }
});

