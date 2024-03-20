// == Translate X =========================================================
// Selectors
const translateXValueSpan = document.querySelector("#translate-x-value");
const translateXInput = document.querySelector("#translate-x-input");

// Event handler
translateXInput.addEventListener("input", () => {
  translateXValueSpan.innerHTML = translateXInput.value;

  // Update the selected object
  if (selectedPointsMapped[0].length < 1) {
    showLog("Nothing is selected");
  }
});
