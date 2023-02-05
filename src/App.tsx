import React, { useReducer } from "react";
import "./App.css";
import { INITIAL_STATE, apiReducer, ApiNames, apisMeta } from "./apiStates";
import Draggable from "react-draggable";
const worker = new Worker("/my.worker.js");

const getClassesByName = (name: ApiNames): string => {
  return `api-box ${apisMeta[name].color}`;
};

function App() {
  const [state, dispatch] = useReducer(apiReducer, INITIAL_STATE);

  worker.onmessage = (event: any) => {
    dispatch({ type: "FINISH_API", payload: "Web Worker" });
  };

  const handleCheckboxChange = (name: ApiNames) => {
    dispatch({ type: "ENABLE_API", payload: name });
  };

  const onDragHandler = (event: any, button: any, index: number) => {
    if (!state.activeDragging) {
      dispatch({ type: "START_DRAG" });
    }
    const buttonRect = button.node.getBoundingClientRect();
    const offset = button.y / buttonRect.height;
    if (Math.abs(offset) >= 1) {
      // next line is in order to achieve the desired offser number (math.floor(-0.5) should be 0, not -1)
      const adjustedOffset = Math.floor(offset) + (offset > 0 ? 0 : 1);
      dispatch({
        type: "MOVE",
        payload: {
          dragOffset: { x: buttonRect.width, y: buttonRect.height },
          offset: adjustedOffset,
          index,
        },
      });
    }
  };

  const start = (name: string) =>
    dispatch({ type: "START_API", payload: name });
  const finish = (name: string) =>
    dispatch({ type: "FINISH_API", payload: name });

  const handleDemoClick = () => {
    dispatch({ type: "CLEAR_ALL" });
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
      <div className="box">
        {state.apis.map((api, index) => {
          let classes = api.checked ? getClassesByName(api.name) : "api-box";
          return (
            <Draggable
              onDrag={(a, b) => onDragHandler(a, b, index)}
              onStop={() => dispatch({ type: "STOP_DRAG" })}
              key={"d-" + api.name}
              position={api.dragOffset}
              // positionOffset={api.dragOffset}
            >
              <button
                type="button"
                key={api.name}
                className={classes}
                onClick={() => handleCheckboxChange(api.name)}
                title={api.name}
              >
                {api.name}
              </button>
            </Draggable>
          );
        })}
      </div>
      <button onClick={handleDemoClick} className="api-box">
        Execute Demo
      </button>
      <br />
      Initiation sequence
      <div className="box">
        {state.started.map((name) => (
          <button
            type="button"
            key={"s-" + name}
            className={getClassesByName(name)}
          >
            {name}
          </button>
        ))}
      </div>
      Fulfilled sequence
      <div className="box">
        {state.finished.map((name) => (
          <button
            type="button"
            key={"f-" + name}
            className={getClassesByName(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
