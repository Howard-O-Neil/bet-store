import {POP_NOTIFY, PUSH_NOTIFY} from '../constants/notifyConstants';
import {ActionType} from '../types/actionType';
import {NotifyType} from '../types/notifyType';

export const AddNotify = (notify: NotifyType): ActionType<NotifyType> => {
  return {
    type: PUSH_NOTIFY,
    payload: notify,
  };
};

export const DelNotify = (): ActionType<NotifyType> => {
  return {
    type: POP_NOTIFY,
    payload: null!,
  };
};
