import auth from "./auth";
import member from "./member";
import position from "./position";
import user from "./user";

import team from "./team";
import { combineReducers } from "redux";
const myReducers = combineReducers({
  auth,
  member,
  position,
  team,
  user
});

export default myReducers;
