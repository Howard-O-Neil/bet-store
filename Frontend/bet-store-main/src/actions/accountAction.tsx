import Axios from "axios";
import { LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, LOGOUT_SUCCESS } from "../constants/accountConstants";
import { AccountReduxType } from "../types/accountType";
import { ActionType } from "../types/actionType";
import { ProfileRemove } from "./profileAction";



// export const GetProfile =()=> async (dispatch:React.Dispatch<ActionType<AccountReduxType>>) => {
//     dispatch(setStateLogin())
   
// }

export const setLoginSuccess = (token: string): ActionType<AccountReduxType>=>{
    return {
        type:LOGIN_SUCCESS,
        payload:{
            Token:token,
            IsLogin:true
        }
    }
}

export const setStateLogin = (): ActionType<AccountReduxType>=>{
    return {
        type:LOGIN,
        payload:null        
    }
}

export const setStateErrorLogin = (): ActionType<AccountReduxType>=>{
    return {
        type:LOGIN_FAIL,
        payload:{
            Token:"",
            IsLogin:false
        } 
    }
}

export const LogoutAccount =()=> (dispatch:React.Dispatch<ActionType<AccountReduxType>>) => {
    console.log("hahahaha");
    dispatch(Logout());

   localStorage.removeItem("token");
   ProfileRemove()
   dispatch(LogoutSuccess())
}




export const Logout = (): ActionType<AccountReduxType>=>{
    return {
        type:LOGOUT,
        payload:{
            Token:"",
            IsLogin:false
        } 
    }
}


export const LogoutSuccess = (): ActionType<AccountReduxType>=>{
    return {
        type:LOGOUT_SUCCESS,
        payload:{
            Token:"",
            IsLogin:false
        } 
    }
}