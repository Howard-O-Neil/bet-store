import { GET_INFO_WALLET, GET_INFO_WALLET_FAIL, GET_INFO_WALLET_SUCCESS } from "../constants/walletContants";
import { ActionType } from "../types/actionType";
import { StateType } from "../types/stateType";
import { WalletInfoType } from "../types/walletInfoType";


export const initWallet: StateType<WalletInfoType> = {
    IsFetching: false,
    Error: "",
    Payload: { currentwallet: 0, profileid: "", sumpaid: 0 }
}

export const walletReducer: React.Reducer<StateType<WalletInfoType>, ActionType<any>> = (state = initWallet, action) => {
    switch (action.type) {
        case GET_INFO_WALLET:
            return { ...state, IsFetching: true }
        case GET_INFO_WALLET_SUCCESS:
            return { ...state, IsFetching: false, Payload: action.payload, Error: "" }
        case GET_INFO_WALLET_FAIL:
            return { ...state, IsFetching: false, Error: action.payload }
        default:
            return state;
    }
};