import { 
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
  
const initProfile:StateType<AccountReduxType> = {
    IsFetching:false,
    Error:"",
    Payload:{
        Token:"",
        IsLogin:false
    }
}
  
export const accountReducer:React.Reducer<StateType<AccountReduxType>, ActionType<any>> = (state = initProfile, action) => {
    switch (action.type) {
    case LOGIN:
        return { ...state, IsFetching:true};
    case LOGIN_SUCCESS:
        return { ...state, IsFetching:false, Payload:action.payload};
    case LOGIN_FAIL:
        return { ...state, IsFetching:false, Error:action.payload};

    case LOGOUT:
        return { ...state, IsFetching:true};
    case LOGOUT_SUCCESS:
        return { ...state, IsFetching:false, Payload:action.payload};
    case LOGOUT_FAIL:
        return { ...state, IsFetching:false, Error:action.payload};
    default:
        return state;
    }
};