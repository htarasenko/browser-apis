interface BrowserApi {
  name: ApiNames;
  checked: boolean;
}

export type ApiNames =
  | "setTimeout"
  | "setInterval"
  | "Web Worker"
  | "Indexed DB"
  | "requestAnimationFrame"
  | "promise"
  | "Synchronous";

interface State {
  apis: BrowserApi[];
  started: ApiNames[];
  finished: ApiNames[];
}

const apisMeta: { [K in ApiNames]: { url: string; color: string } } = {
  setTimeout: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout",
    color: "#f0f",
  },
  setInterval: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval",
    color: "#f0f",
  },
  "Web Worker": {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API",
    color: "#f0f",
  },
  "Indexed DB": {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
    color: "#f0f",
  },
  requestAnimationFrame: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame",
    color: "#f0f",
  },
  promise: {
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
    color: "#f0f",
  },
  Synchronous: {
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/sync_function",
    color: "#f0f",
  },
};

export const INITIAL_STATE: State = {
  apis: [
    { name: "setTimeout", checked: true },
    { name: "setInterval", checked: true },
    { name: "Web Worker", checked: true },
    { name: "Indexed DB", checked: true },
    { name: "requestAnimationFrame", checked: true },
    { name: "promise", checked: true },
    { name: "Synchronous", checked: true },
  ],
  started: [],
  finished: [],
};

export const apiReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case "ENABLE_API":
      const updatedApis = state.apis.map((api) => {
        if (api.name === payload) {
          return { ...api, checked: !api.checked };
        }
        return api;
      });
      return { ...state, apis: updatedApis };
    case "CLEAR_ALL":
      return { ...state, started: [], finished: [] };
    case "START_API":
      return { ...state, started: [...state.started, payload] };
    case "FINISH_API":
      return { ...state, finished: [...state.finished, payload] };
    default:
      return state;
  }
};
