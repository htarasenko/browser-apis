interface BrowserApi {
  name: ApiNames;
  checked: boolean;
  dragOffset: { x: number; y: number };
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
  activeDragging: boolean;
  activeIndex: number;
  offset: number;
}

export const apisMeta: { [K in ApiNames]: { url: string; color: string } } = {
  setTimeout: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout",
    color: "green",
  },
  setInterval: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval",
    color: "orange",
  },
  "Web Worker": {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API",
    color: "yellow",
  },
  "Indexed DB": {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
    color: "red",
  },
  requestAnimationFrame: {
    url: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame",
    color: "blue",
  },
  promise: {
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
    color: "indigo",
  },
  Synchronous: {
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/sync_function",
    color: "violet",
  },
};

export const INITIAL_STATE: State = {
  apis: [
    { name: "setTimeout", checked: true, dragOffset: { x: 0, y: 0 } },
    { name: "setInterval", checked: true, dragOffset: { x: 0, y: 0 } },
    { name: "Web Worker", checked: true, dragOffset: { x: 0, y: 0 } },
    { name: "Indexed DB", checked: true, dragOffset: { x: 0, y: 0 } },
    {
      name: "requestAnimationFrame",
      checked: true,
      dragOffset: { x: 0, y: 0 },
    },
    { name: "promise", checked: true, dragOffset: { x: 0, y: 0 } },
    { name: "Synchronous", checked: true, dragOffset: { x: 0, y: 0 } },
  ],
  started: [],
  finished: [],
  activeDragging: false,
  activeIndex: 0,
  offset: 0,
};

export const apiReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case "ENABLE_API": {
      if (state.activeDragging) return { ...state, activeDragging: false };
      const apis = state.apis.map((api) => {
        if (api.name === payload) {
          return { ...api, checked: !api.checked };
        }
        return api;
      });
      return { ...state, apis };
    }
    case "CLEAR_ALL":
      return { ...state, started: [], finished: [] };
    case "START_API":
      return { ...state, started: [...state.started, payload] };
    case "FINISH_API":
      return { ...state, finished: [...state.finished, payload] };
    case "START_DRAG":
      console.log("START_DRAG");
      return { ...state, activeDragging: true };
    case "MOVE": {
      const offset = payload.offset;
      const apis = state.apis.map((api, index) => {
        if (payload.index === index) {
          return api;
        }
        //moved up
        if (index >= payload.index + offset && index < payload.index) {
          return { ...api, dragOffset: { x: 0, y: payload.dragOffset.y } };
        }
        //moved up
        if (index <= payload.index + offset && index > payload.index) {
          return { ...api, dragOffset: { x: 0, y: -payload.dragOffset.y } };
        }
        return { ...api, dragOffset: { x: 0, y: 0 } };
      });
      return { ...state, apis, offset, activeIndex: payload.index };
    }
    case "STOP_DRAG": {
      const { activeIndex, offset } = state;
      if (!offset) return state;
      const destinationIndex = activeIndex + offset;
      console.log("STOP_DRAG", activeIndex, offset);
      const apis = state.apis.map((api, index) => {
        if (index === destinationIndex) {
          const a = state.apis[state.activeIndex];
          return clearDragOffset({ ...a });
        }
        if (
          offset < 0 && //moved up
          index > destinationIndex &&
          index <= activeIndex
        ) {
          const a = state.apis[index - 1];
          return clearDragOffset({ ...a });
        }
        if (
          offset > 0 && //moved down
          index >= state.activeIndex &&
          index < destinationIndex
        ) {
          const a = state.apis[index + 1];
          return clearDragOffset({ ...a });
        }

        return clearDragOffset({ ...api });
      });

      console.log("STOP", apis);
      return { ...state, apis };
    }
    default:
      return state;
  }
};

function clearDragOffset(api: BrowserApi) {
  api.dragOffset = { x: 0, y: 0 };
  return api;
}

function isDraggedMovingUp(activeIndex: number, offset: number) {
  return activeIndex + offset < activeIndex;
}