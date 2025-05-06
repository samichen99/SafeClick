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
 function displayThreatInfo (info){
    const statusDiv = document.getElementById("threatStatus");
    if(!statusDiv) return;
    
    if(info && threatInfo) {
        statusDiv.innerHTML = `
        <div style=" red ;font-weight= bold;">
            Ce site est dangereux !
        </div>;
        <div >
            <strong>Type de Menace :</strong> ${info.threatInfo.ThreatType}
        </div>`;  
    }
    else if(info && threatInfo) {
        statusDiv.innerHTML = `
        <div style=" color:green; font-weight: bold> Aucune Menace est Detecté
        </div>
        <div><strong> URL Verifiée :</strong> ${info.url} </div>
        `
    }
 }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "PHISHING_WARNING") {
        displayPhishingBanner(message.url);
    }
});
