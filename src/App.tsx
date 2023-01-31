import React, { useReducer } from "react";
import "./App.css";
import { INITIAL_STATE, apiReducer, ApiNames } from "./apiStates";
const worker = new Worker("/my.worker.js");

function App() {
  const [state, dispatch] = useReducer(apiReducer, INITIAL_STATE);

  worker.onmessage = (event: any) => {
    dispatch({ type: "FINISH_API", payload: "Web Worker" });
  };

  const handleCheckboxChange = (name: ApiNames) => {
    dispatch({ type: "ENABLE_API", payload: name });
  };

  const start = (name: string) =>
    dispatch({ type: "START_API", payload: name });
  const finish = (name: string) =>
    dispatch({ type: "FINISH_API", payload: name });

  const handleDemoClick = () => {
    dispatch({ type: "CLEAR_ALL" });
    console.log(state.apis);
    state.apis.forEach((api) => {
      if (api.checked) {
        switch (api.name) {
          case "setTimeout":
            start(api.name);
            setTimeout(() => {
              finish(api.name);
            }, 0);
            break;
          case "setInterval":
            start(api.name);
            const interval = setInterval(() => {
              clearInterval(interval);
              finish(api.name);
            }, 0);
            break;
          case "requestAnimationFrame":
            start(api.name);
            requestAnimationFrame(() => {
              finish(api.name);
            });
            break;
          case "Web Worker":
            start(api.name);
            worker.postMessage({ action: "start" });
            break;
          case "Indexed DB":
            start(api.name);
            const request = indexedDB.open("myDatabase", 1);
            request.onsuccess = (event: any) => {
              finish(api.name);
            };
            break;
          case "promise":
            start(api.name);
            new Promise<void>((resolve) => {
              resolve();
            }).then(() => {
              finish(api.name);
            });
            break;
          case "Synchronous":
            start(api.name);
            finish(api.name);
            break;
          default:
            break;
        }
      }
    });
  };

  return (
    <div>
      <div>
        {state.apis.map((api, index) => (
          <li key={api.name} className="pure-button">
            <input
              type="checkbox"
              checked={api.checked}
              onChange={() => handleCheckboxChange(api.name)}
            />
            {api.name}
          </li>
        ))}
        <button onClick={handleDemoClick}>Execute Demo</button>
      </div>
      Initiation sequence
      <ol>
        {state.started.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      Fulfilled sequence
      <ol>
        {state.finished.map((response) => (
          <li key={response}>{response}</li>
        ))}
      </ol>
    </div>
  );
}

export default App;
