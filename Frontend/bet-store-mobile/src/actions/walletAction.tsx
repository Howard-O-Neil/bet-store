import Axios from 'axios';
import { GolangAPI } from '../../define';
import { GetItemInStorage } from '../components/AsyncStorageUtls';
import {
  GET_INFO_WALLET,
  GET_INFO_WALLET_FAIL,
  GET_INFO_WALLET_SUCCESS,
  GET_TRANS_DETAIL_WALLET,
  GET_TRANS_DETAIL_WALLET_FAIL,
  GET_TRANS_DETAIL_WALLET_SUCCESS,
} from '../constants/walletContants';
import {ActionType} from '../types/actionType';
import {ReponseAPI as ResponseAPI} from '../types/ReponseAPI';
import { TransDetailWallet } from '../types/transDetailWallet';
import {WalletInfoType} from '../types/walletInfoType';

export const InfoWallet = () => async (
  dispatch: React.Dispatch<ActionType<WalletInfoType>>,
) => {
  dispatch(GetInfoWallet());

  Axios.defaults.headers.common.Authentication =
    'Bearer ' + await GetItemInStorage('token'); // for all requests
  let response = await Axios.get<ResponseAPI<WalletInfoType>>(`${GolangAPI}/wallet/`);
  if (response.status === 200) {
    if (response.data.status === 200) {
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


export const TransDetailWallets = () => async (
  dispatch: React.Dispatch<ActionType<TransDetailWallet[]>>,
) => {
  dispatch(GetTransDetailWallet());
  let response = await Axios.get<ResponseAPI<TransDetailWallet[]>>(`${GolangAPI}/wallet/detailtrans/`);
  if (response.status === 200) {
    if (response.data.status === 200) {
      dispatch(GetTransDetailWallet_SUCCESS(response.data.data));
    } else {
      dispatch(GetTransDetailWallet_FAIL(response.data.message));
    }
  } else {
    dispatch(GetTransDetailWallet_FAIL(response.statusText));
  }
};


const GetTransDetailWallet = (): ActionType<any> => {
  return {
    type: GET_TRANS_DETAIL_WALLET,
    payload: null,
  };
};

const GetTransDetailWallet_SUCCESS = (
  wallet: TransDetailWallet[],
): ActionType<TransDetailWallet[]> => {
  return {
    type: GET_TRANS_DETAIL_WALLET_SUCCESS,
    payload: wallet,
  };
};

const GetTransDetailWallet_FAIL = (msg: string): ActionType<any> => {
  return {
    type: GET_TRANS_DETAIL_WALLET_FAIL,
    payload: msg,
  };
};