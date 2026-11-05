import { combineReducers } from "redux";
import { UsersReducer } from "./UsersReducer";
import { AnalyseReducer } from "./AnalyseReducer";

const rootReducer = combineReducers({
  UsersReducer,
  AnalyseReducer,
});

export default rootReducer;
