function displayPhishingBanner(url) {
    const banner = document.createElement("div");

    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = "red";
    banner.style.color = "white";
    banner.style.textAlign = "center";
    banner.style.padding = "15px";
    banner.style.zIndex = "9999";
    banner.style.fontSize = "18px";
    banner.style.fontWeight = "bold";
    banner.innerText = `⚠️ Attention ! Ce site (${url}) est potentiellement dangereux !`;

    const closeBtn = document.createElement("span");
    closeBtn.innerText = "X";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.marginLeft = "15px";
    closeBtn.onclick = () => banner.remove();

    banner.appendChild(closeBtn);

    document.body.prepend(banner);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "PHISHING_WARNING") {
        displayPhishingBanner(message.url);
    }
});
