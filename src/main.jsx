import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NotificationProvider from "./components/NotificationProvider/NotificationProvider.jsx";

// tanstack query

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
    <NotificationProvider>
        <Toaster />
        <App />
      </NotificationProvider>
    </BrowserRouter>
  </Provider>
);
