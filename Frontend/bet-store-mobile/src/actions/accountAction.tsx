import {
  LOGIN,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
} from '../constants/accountConstants';
import {AccountReduxType} from '../types/accountType';
import {ActionType} from '../types/actionType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileRemove} from './profileAction';
import { EraseItemInStorage } from '../components/AsyncStorageUtls';

// export const GetProfile =()=> async (dispatch:React.Dispatch<ActionType<AccountReduxType>>) => {
//     dispatch(setStateLogin())

// }

export const setLoginSuccess = (
  token: string,
): ActionType<AccountReduxType> => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      Token: token,
      IsLogin: true,
    },
  };
};

export const setStateLogin = (): ActionType<AccountReduxType> => {
  return {
    type: LOGIN,
    payload: null!,
  };
};

export const setStateErrorLogin = (): ActionType<AccountReduxType> => {
  return {
    type: LOGIN_FAIL,
    payload: {
      Token: '',
      IsLogin: false,
    },
  };
};

export const LogoutAccount = () => (
  dispatch: React.Dispatch<ActionType<AccountReduxType>>,
) => {
  console.log('Logout!!!');
  dispatch(Logout());

  EraseItemInStorage("token");
  //ProfileRemove();
  console.log('Logout!!!');
  dispatch(LogoutSuccess());
};

export const Logout = (): ActionType<AccountReduxType> => {
  return {
    type: LOGOUT,
    payload: {
      Token: '',
      IsLogin: false,
    },
  };
};

export const LogoutSuccess = (): ActionType<AccountReduxType> => {
  return {
    type: LOGOUT_SUCCESS,
    payload: {
      Token: '',
      IsLogin: false,
    },
  };
};
