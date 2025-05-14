chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "PHISHING_WARNING") {
      // Clear the page
      document.documentElement.innerHTML = '';
  
      const warningHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>⚠️ Unsafe Website Blocked</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              background: linear-gradient(135deg,rgb(47, 62, 128),rgb(18, 38, 90));
              color: #ffffff;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              text-align: center;
              padding: 2rem;
            }
            .container {
              max-width: 600px;
              background-color: #2b2b2b;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
              animation: fadeIn 0.5s ease-in-out;
            }
            .icon {
              font-size: 80px;
              color: #ff4c4c;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 2.2em;
              margin-bottom: 16px;
              color: #ff4c4c;
            }
            p {
              font-size: 1.2em;
              margin-bottom: 32px;
              color: #dddddd;
            }
            button {
              background-color: #ff4c4c;
              color: white;
              border: none;
              padding: 14px 28px;
              font-size: 1em;
              border-radius: 6px;
              cursor: pointer;
              transition: background 0.3s ease;
            }
            button:hover {
              background-color: #e04343;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🚫</div>
            <h1>Website Blocked</h1>
            <p>This website has been identified as potentially harmful (phishing or malicious). For your safety, access has been blocked by SAFE CLICK</p>
            <img src=></img>
            <button id="goBack">Go Back to Safety</button>
          </div>
  
          <script>
            document.getElementById("goBack").addEventListener("click", () => {
              history.back();
            });
          </script>
        </body>
        </html>
      `;
  
      document.open();
      document.write(warningHTML);
      document.close();
    }
  });
  
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

