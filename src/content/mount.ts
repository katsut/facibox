import { createRoot, type Root } from "react-dom/client";
import { createElement } from "react";
import { App } from "../components/App";
import cssText from "./styles.css?inline";

let root: Root | null = null;
let shadowHost: HTMLElement | null = null;
let visible = false;

function render() {
  if (!root) return;
  root.render(
    createElement(App, {
      visible,
      onClose: () => {
        visible = false;
        render();
      },
    }),
  );
}

export function toggle() {
  if (!shadowHost) {
    shadowHost = document.createElement("div");
    shadowHost.id = "facibox-root";
    const shadow = shadowHost.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = cssText;
    shadow.appendChild(style);

    const container = document.createElement("div");
    shadow.appendChild(container);
    document.body.appendChild(shadowHost);

    root = createRoot(container);
  }

  visible = !visible;
  render();
}
