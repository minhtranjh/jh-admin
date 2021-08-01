import { createStore, applyMiddleware } from "redux";
import rootReducers from "../reducers/index";
import thunk from "redux-thunk";
const store = createStore(
  rootReducers,
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;