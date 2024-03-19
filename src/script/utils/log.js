console.log("Import utils/log.js successfully");

// Show error message inside the page error box
const errorBoxDiv = document.getElementById("error-box");
function showError(errorText) {
  const errorTextP = document.createElement("p");
  errorTextP.innerText = errorText;
  errorBoxDiv.appendChild(errorTextP);
  console.log(errorText);
}

// Show log messages inside the page log box
const logBoxDiv = document.getElementById("log-box");
function showLog(logMessage) {
  const logMessageP = document.createElement("p");
  logMessageP.innerText = logMessage;
  logBoxDiv.appendChild(logMessageP);
  console.log(logMessage);
}
