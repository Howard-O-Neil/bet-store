import Axios from "axios";
import { CONFIRM_TEL_ACCOUNT, CONFIRM_TEL_ACCOUNT_FAIL, CONFIRM_TEL_ACCOUNT_SUCCESS, LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, LOGOUT_SUCCESS } from "../constants/accountConstants";
import { AccountReduxType } from "../types/accountType";
import { ActionType } from "../types/actionType";
import { FormConfirmTel } from "../types/formConfirmTel";
import { ProfileRemove } from "./profileAction";
import { ReponseAPI as ResponseAPI } from "../types/ReponseAPI";



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

export const ConfirmTelAccount = (data:FormConfirmTel) =>async (dispatch: React.Dispatch<ActionType<any>>) => {
    dispatch(ConfirmTelAccount_Request())
    let response = await Axios.post<ResponseAPI<any>>(
        `/go/api/account/sendsms`,
        data
    );
    if (response.status === 200) {
        if (response.data.status === 200) {
            dispatch(ConfirmTelAccount_SUCCESS());
        }
        else {
            dispatch(ConfirmTelAccount_FAIL(response.data.message))
        }
    } else {
        dispatch(ConfirmTelAccount_FAIL(response.statusText))
    }
}

const ConfirmTelAccount_Request = (): ActionType<any> => {
    return {
        type: CONFIRM_TEL_ACCOUNT,
        payload: null
    }
}

const ConfirmTelAccount_SUCCESS = (): ActionType<any> => {
    return {
        type: CONFIRM_TEL_ACCOUNT_SUCCESS,
        payload: true
    }
}

const ConfirmTelAccount_FAIL = (msg:string): ActionType<any> => {
    return {
        type: CONFIRM_TEL_ACCOUNT_FAIL,
        payload: msg
    }
}

