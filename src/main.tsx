import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Validate environment variables before bootstrapping React
import "./config/env";

createRoot(document.getElementById("root")!).render(<App />);
