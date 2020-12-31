import Axios from 'axios';
import { GolangAPI } from '../../define';
import {
  GET_INFO_WALLET,
  GET_INFO_WALLET_FAIL,
  GET_INFO_WALLET_SUCCESS,
} from '../constants/walletContants';
import {ActionType} from '../types/actionType';
import {ReponseAPI as ResponseAPI} from '../types/ReponseAPI';
import {WalletInfoType} from '../types/walletInfoType';

export const InfoWallet = () => async (
  dispatch: React.Dispatch<ActionType<WalletInfoType>>,
) => {
  //console.log("response");
  dispatch(GetInfoWallet());
  let response = await Axios.get<ResponseAPI<WalletInfoType>>(`${GolangAPI}/wallet/`);
  console.log(response);
  if (response.status === 200) {
    if (response.data.status === 200) {
      console.log(response.data.data);
      dispatch(GetInfoWallet_SUCCESS(response.data.data));
    } else {
      dispatch(GetInfoWallet_FAIL(response.data.message));
    }
  } else {
    dispatch(GetInfoWallet_FAIL(response.statusText));
  }
};

const GetInfoWallet = (): ActionType<any> => {
  return {
    type: GET_INFO_WALLET,
    payload: null,
  };
};

const GetInfoWallet_SUCCESS = (
  wallet: WalletInfoType,
): ActionType<WalletInfoType> => {
  return {
    type: GET_INFO_WALLET_SUCCESS,
    payload: wallet,
  };
};

const GetInfoWallet_FAIL = (msg: string): ActionType<any> => {
  return {
    type: GET_INFO_WALLET_FAIL,
    payload: msg,
  };
};
