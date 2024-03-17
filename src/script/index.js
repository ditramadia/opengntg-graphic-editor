// try {
//   helloTriangle();
// } catch (err) {
//   showError(`Uncaught JavaScript Exception: ${err}`);
// }

try {
  initCanvas();
} catch {
  showError("Failed initializing canvas");
}
