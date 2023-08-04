import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/*
 * The main entry point of the application.
 * @function
 * @returns {void}
 * @see https://reactjs.org/docs/react-dom.html#render
 */
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
