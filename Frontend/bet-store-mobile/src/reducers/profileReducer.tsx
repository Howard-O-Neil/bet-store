import { Reducer } from 'redux';
import {
  CHANGE_AVATAR,
  CHANGE_AVATAR_FAIL,
  CHANGE_AVATAR_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAIL,
  CHANGE_PASSWORD_SUCCESS,
  EDIT_PROFILE,
  EDIT_PROFILE_FAIL,
  EDIT_PROFILE_SUCCESS,
  GET_PROFILE,
  GET_PROFILE_FAIL,
  GET_PROFILE_SUCCESS,
  REMOVE_PROFILE,
} from '../constants/profileConstants';
import {ActionType} from '../types/actionType';
import {Profile} from '../types/profile';
import {StateType} from '../types/stateType';

export const initProfile: StateType<Profile> = {
  IsFetching: false,
  Error: '',
  Payload: {
    name: '',
    avatar: '',
    username: '',
    surname: '',
    sex: '',
    tel: '',
  },
};

export const profileReducer: Reducer<
  StateType<Profile>,
  ActionType<any>
> = (state = initProfile, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {...state, IsFetching: true};
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        IsFetching: false,
        Payload: action.payload,
        Error: null,
      };
    case GET_PROFILE_FAIL:
      return {...state, IsFetching: false, Error: 'GET_PROFILE_FAIL'};
    case REMOVE_PROFILE:
      return {...state, Payload: action.payload};
    case CHANGE_AVATAR:
      return {...state, IsFetching: true};
    case CHANGE_AVATAR_SUCCESS:
      var payloadnew: Profile = {
        ...state.Payload,
        avatar: action.payload,
      };
      return {...state, IsFetching: false, Payload: payloadnew};
    case CHANGE_AVATAR_FAIL:
      return {...state, IsFetching: false};
    case EDIT_PROFILE:
      return {...state, IsFetching: true};
    case EDIT_PROFILE_SUCCESS:
      return {...state, IsFetching: false, Payload: action.payload};
    case EDIT_PROFILE_FAIL:
      return {...state, IsFetching: false};
    case CHANGE_PASSWORD:
      return {...state, IsFetching: true};
    case CHANGE_PASSWORD_SUCCESS:
      return {...state, IsFetching: false, Error: ''};
    case CHANGE_PASSWORD_FAIL:
      return {...state, IsFetching: false, Error: action.payload};

    default:
      return state;
  }
};
