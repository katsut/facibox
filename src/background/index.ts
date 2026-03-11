chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_MODAL" });
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/content/index.ts"],
    });
    await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_MODAL" });
  }
});
