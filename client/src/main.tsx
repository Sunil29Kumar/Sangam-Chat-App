import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { AppProvider } from "./context/AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <AppProvider>
      <App />
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        offset={{ top: "25px", right: "20px" }}
      />
    </AppProvider>
);
