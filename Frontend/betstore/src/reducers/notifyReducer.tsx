import {POP_NOTIFY, PUSH_NOTIFY} from '../constants/notifyConstants';
import {ActionType} from '../types/actionType';
import {NotifyType, NotifyTypes} from '../types/notifyType';
import {StateType} from '../types/stateType';

const initNotify: StateType<NotifyTypes> = {
  IsFetching: false,
  Error: '',
  Payload: {
    notifies: [],
  },
};

export const notifyReducer: React.Reducer<
  StateType<NotifyTypes>,
  ActionType<NotifyType>
> = (state = initNotify, action) => {
  switch (action.type) {
    case PUSH_NOTIFY:
      var renotifies = {...state.Payload};
      renotifies.notifies.push(action.payload);
      return {
        ...state,
        Payload: renotifies,
      };
    case POP_NOTIFY:
      var renotifies = {...state.Payload};
      renotifies.notifies.pop();
      return {...state, Payload: renotifies};
    default:
      return {...state};
  }
};
