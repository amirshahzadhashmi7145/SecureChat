import authReducer from "./authReducer.js";
import {combineReducers} from "@reduxjs/toolkit";
import selectedRecipientReducer from "./selectedRecipientReducer.js";

const rootReducer = combineReducers({
    auth: authReducer,
    selectedRecipient: selectedRecipientReducer
})

export default rootReducer;