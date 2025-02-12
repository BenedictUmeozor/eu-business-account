import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import { pdfjs } from "react-pdf";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store.ts";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#036BDD",
            fontFamily: "inherit",
          },
          components: {
            Input: {
              controlHeight: 44,
            },
            InputNumber: {
              controlHeight: 44,
            },
            Select: {
              controlHeight: 44,
            },
            DatePicker: {
              controlHeight: 44,
            },
            Button: {
              fontSize: 12,
            },
          },
        }}>
        <App />
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
