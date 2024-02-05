import { createStore } from "redux";
import usericonReducer from "./reducers/usericonReducer";

const store = createStore(usericonReducer);

export default store;
