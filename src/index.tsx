import { ConsolePosition, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { AppProvider } from "./Providers/AppContext";
import App from "./App";

const isDev = process.env.RUNTIME === "dev";

const renderer = await createCliRenderer(
    isDev
        ? {
              consoleOptions: {
                  position: ConsolePosition.BOTTOM,
                  sizePercent: 30,
                  startInDebugMode: true,
              },
          }
        : undefined
);

if (isDev) {
    renderer.keyInput.on("keypress", (key) => {
        if (key.ctrl && key.name === "t") {
            renderer.console.toggle();
        }
    });
}

createRoot(renderer).render(
    <AppProvider>
        <App />
    </AppProvider>
);
