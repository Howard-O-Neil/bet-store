import {
    CONFIRM_TEL_ACCOUNT,
    CONFIRM_TEL_ACCOUNT_FAIL,
    CONFIRM_TEL_ACCOUNT_SUCCESS,
    LOGIN,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS
} from "../constants/accountConstants";
import { ActionType } from "../types/actionType";
import { AccountReduxType } from "../types/accountType";
import { StateType } from "../types/stateType";
import { Logout } from "../actions/accountAction";

const initProfile: StateType<AccountReduxType> = {
    IsFetching: false,
    Error: "",
    Payload: {
        Token: "",
        IsLogin: false
    }
}

export const accountReducer: React.Reducer<StateType<AccountReduxType>, ActionType<any>> = (state = initProfile, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, IsFetching: true };
        case LOGIN_SUCCESS:
            return { ...state, IsFetching: false, Payload: action.payload };
        case LOGIN_FAIL:
            return { ...state, IsFetching: false, Error: action.payload };

        case LOGOUT:
            return { ...state, IsFetching: true };
        case LOGOUT_SUCCESS:
            return { ...state, IsFetching: false, Payload: action.payload };
        case LOGOUT_FAIL:
            return { ...state, IsFetching: false, Error: action.payload };
        default:
            return state;
    }
};



export const confirmTelAccount: React.Reducer<StateType<boolean>, ActionType<any>> = (state = { Error: "", IsFetching: false, Payload: false }, action) => {
    switch (action.type) {
        case CONFIRM_TEL_ACCOUNT:
            return { ...state, IsFetching: true };
        case CONFIRM_TEL_ACCOUNT_SUCCESS:
            return { ...state, IsFetching: false, Payload: true };
        case CONFIRM_TEL_ACCOUNT_FAIL:
            return { ...state, IsFetching: false, Error: action.payload };
        default:
            return state;
    }
};

