import { createBrowserHistory } from "history";

/**
 * @description Allows direct manipulation of history outside of React components (typically inside of an async function call,
 * like a thunk in Redux)
 */
export default createBrowserHistory();
