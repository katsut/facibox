import { toggle } from "./mount";

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE_MODAL") {
    toggle();
  }
});
