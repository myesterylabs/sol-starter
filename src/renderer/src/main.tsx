import "./assets/css/app.css";
import "@/stores/sol-settings"
import "@/stores/saved-store"

import App from "./App";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);
root.render(<App />);
