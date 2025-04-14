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