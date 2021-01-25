import Axios from 'axios';
import {ThunkAction} from 'redux-thunk';
import { JavaAPI } from '../../define';
import SocketManager, {ISocket} from '../components/SocketManager';
import {
  ChatAccountInfo,
  Conversation,
  ConversationControl,
  Message,
  MessageControl,
} from '../reducers/chatBoxReducer';

export const OPEN_CHAT_BOX = 'OPEN_CHAT_BOX';
export const CLOSE_CHAT_BOX = 'CLOSE_CHAT_BOX';
export const SET_ACCOUNT_INFO = 'SET_ACCOUNT_INFO';
export const LOAD_CONVERSATION = 'LOAD_CONVERSATION';
export const LOAD_PREV_CONVERSATION = 'LOAD_PREV_CONVERSATION';
export const RECEIVE_CONVERSATION = 'RECEIVE_CONVERSATION';
export const LOAD_MESSAGE = 'LOAD_MESSAGE';
export const LOAD_PREV_MESSAGE = 'LOAD_PREV_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const GET_MESSAGE = 'GET_MESSAGE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const SWITCH_TO_CONVERSATION = 'SWITCH_TO_CONVERSATION';
export const SWITCH_TO_MESSAGE = 'SWITCH_TO_MESSAGE';
export const REPLACE_CURRENT_RECEIVER = 'REPLACE_CURRENT_RECEIVER';
export const SET_SOCKET_INFO = 'SET_SOCKET_INFO';

export interface ChatActionType<T> {
  type: string;
  value: T;
}

export const getAccountInfoThunk: ThunkAction<
  void,
  ChatAccountInfo,
  string,
  ChatActionType<ChatAccountInfo>
> = async (dispatch, getState, token) => {
  //
  let response = await Axios.get(`${JavaAPI}/api/account/jwt?token=${token}`);  
  dispatch(setAccountInfo(response.data.data));
};

export const setAccountInfo = (
  account: ChatAccountInfo,
): ChatActionType<ChatAccountInfo> => {
  return {
    type: SET_ACCOUNT_INFO,
    value: account,
  };
};

export const getConversationThunk: ThunkAction<
  void,
  ConversationControl,
  {senderId: string; index: number; loadPrev: boolean},
  ChatActionType<Conversation[]>
> = async (dispatch, getState, param) => {
  let result: Conversation[] = [];

  let response = await Axios.get(
    `${JavaAPI}/api/conversation/get?senderid=${param.senderId}&index=${param.index}`,
  );
  result = response.data.data;

  if (!param.loadPrev) {
    dispatch(loadConversation(result));
  } else {
    dispatch(loadPrevConversation(result));
  }
};

export const loadConversation = (
  conversationList: Conversation[],
): ChatActionType<Conversation[]> => {
  return {
    type: LOAD_CONVERSATION,
    value: conversationList,
  };
};

export const loadPrevConversation = (
  conversationList: Conversation[],
): ChatActionType<Conversation[]> => {
  return {
    type: LOAD_PREV_CONVERSATION,
    value: conversationList,
  };
};

export const conversationReceive = (
  conversation: Conversation,
): ChatActionType<Conversation> => {
  return {
    type: RECEIVE_CONVERSATION,
    value: conversation,
  };
};

export const getMessageThunk: ThunkAction<
  void,
  MessageControl,
  {senderId: string; receiverId: string; index: number; loadPrev: boolean},
  ChatActionType<Message[]>
> = async (dispatch, getState, param) => {
  let result: Message[] = [];

  console.log(
    `${JavaAPI}/api/message/get?senderid=${param.senderId}&receiverid=${param.receiverId}&index=${param.index}`,
  );
  let response = await Axios.get(
    `${JavaAPI}/api/message/get?senderid=${param.senderId}&receiverid=${param.receiverId}&index=${param.index}`,
  );
  result = response.data.data;

  if (!param.loadPrev) {
    dispatch(loadMessage(result));
  } else {
    dispatch(loadPrevMessage(result));
  }
};

export const loadMessage = (
  messageList: Message[],
): ChatActionType<Message[]> => {
  return {
    type: LOAD_MESSAGE,
    value: messageList,
  };
};

export const loadPrevMessage = (
  messageList: Message[],
): ChatActionType<Message[]> => {
  return {
    type: LOAD_PREV_MESSAGE,
    value: messageList,
  };
};

export const messageReceive = (message: Message): ChatActionType<Message> => {
  return {
    type: RECEIVE_MESSAGE,
    value: message,
  };
};

export const openChatBox = (flag: boolean): ChatActionType<boolean> => {
  if (flag === true) {
    return {
      type: OPEN_CHAT_BOX,
      value: null!,
    };
  } else {
    return {
      type: CLOSE_CHAT_BOX,
      value: null!,
    };
  }
};

export const switchToConversation = (): ChatActionType<any> => {
  return {
    type: SWITCH_TO_CONVERSATION,
    value: null,
  };
};

export const switchToMessage = (): ChatActionType<any> => {
  return {
    type: SWITCH_TO_MESSAGE,
    value: null,
  };
};

export const repalceCurrentReceiver = (
  accountId: string,
): ChatActionType<any> => {
  return {
    type: REPLACE_CURRENT_RECEIVER,
    value: accountId,
  };
};

export const setSocketInfo = (socketInfo: ISocket): ChatActionType<ISocket> => {
  SocketManager.addSocket(socketInfo.key, socketInfo);
  SocketManager.connect(socketInfo.key);
  return {
    type: SET_SOCKET_INFO,
    value: socketInfo,
  };
};
