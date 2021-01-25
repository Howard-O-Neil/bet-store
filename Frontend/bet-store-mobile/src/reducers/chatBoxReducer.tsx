import {
  ChatActionType,
  SET_ACCOUNT_INFO,
  LOAD_CONVERSATION,
  SWITCH_TO_CONVERSATION,
  SWITCH_TO_MESSAGE,
  OPEN_CHAT_BOX,
  CLOSE_CHAT_BOX,
  REPLACE_CURRENT_RECEIVER,
  SET_SOCKET_INFO,
  LOAD_PREV_CONVERSATION,
  LOAD_MESSAGE,
  RECEIVE_MESSAGE,
  RECEIVE_CONVERSATION,
  LOAD_PREV_MESSAGE,
} from '../actions/chatBoxAction';
import {ISocket} from '../components/SocketManager';
import { Reducer } from 'redux';

// view
export const EMPTY_VIEW = -1;
export const CONVERSATION_VIEW = 1;
export const MESSAGE_VIEW = 2;
export const WELCOME_VIEW = 3;

// socket controller
export const CHAT_HANDLER = '/chat/handle';

// ====================================

export interface ChatAccountInfo {
  id: string;
  user: string;
  avatar: string;
}

export interface ChatViewControl {
  viewId: number;
  isOpen: boolean;
  currentReceiver: string;
}

export interface Conversation {
  id: string;
  senderId: string;
  receiverId: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  textContent: string;
  fileContent: string;
  fileContentType: string;
}

export interface ConversationControl {
  conversationList: Conversation[];
  requestIndex: number;
}

export interface MessageControl {
  messageList: Message[];
  requestIndex: number;
  appendMessage: boolean;
}

const initConversationControl: ConversationControl = {
  conversationList: [],
  requestIndex: 0,
};
const initMessageControl: MessageControl = {
  messageList: [],
  requestIndex: 0,
  appendMessage: false,
};
const initAccountInfo: ChatAccountInfo = {
  id: '',
  user: '',
  avatar: '',
};

export const accountInfoReducer: Reducer<
  ChatAccountInfo,
  ChatActionType<any>
> = (state = initAccountInfo, action) => {
  switch (action.type) {
    case SET_ACCOUNT_INFO: {
      return {
        ...action.value,
      };
    }
    default:
      return state;
  }
};

export const conversationControlReducer: Reducer<
  ConversationControl,
  ChatActionType<any>
> = (state = initConversationControl, action) => {
  switch (action.type) {
    case LOAD_CONVERSATION: {
      let list = action.value as Conversation[];
      return {
        conversationList: list,
        requestIndex: list.length,
      };
    }
    case LOAD_PREV_CONVERSATION: {
      let list = action.value as Conversation[];
      state.conversationList.push(...list);

      return {
        conversationList: state.conversationList,
        requestIndex: state.requestIndex + list.length,
      };
    }
    case RECEIVE_CONVERSATION: {
      state.conversationList.splice(0, 0, action.value);

      return {
        conversationList: state.conversationList,
        requestIndex: state.requestIndex + 1,
      };
    }
    default:
      return state;
  }
};

export const messageControlReducer: Reducer<
  MessageControl,
  ChatActionType<any>
> = (state = initMessageControl, action) => {
  switch (action.type) {
    case LOAD_MESSAGE: {
      let list = action.value as Message[];
      return {
        messageList: list,
        requestIndex: list.length,
        appendMessage: false,
      };
    }
    case LOAD_PREV_MESSAGE: {
      let list = action.value as Message[];
      state.messageList.push(...list);

      return {
        messageList: state.messageList,
        requestIndex: state.requestIndex + list.length,
        appendMessage: false,
      };
    }
    case RECEIVE_MESSAGE: {
      state.messageList.splice(0, 0, action.value);

      return {
        messageList: state.messageList,
        requestIndex: state.requestIndex + 1,
        appendMessage: true,
      };
    }
    default:
      return state;
  }
};

export const viewControlReducer: Reducer<
  ChatViewControl,
  ChatActionType<any>
> = (
  state = {viewId: CONVERSATION_VIEW, isOpen: false, currentReceiver: ''},
  action,
) => {
  switch (action.type) {
    case SWITCH_TO_CONVERSATION:
      return {...state, viewId: CONVERSATION_VIEW};
    case SWITCH_TO_MESSAGE:
      return {...state, viewId: MESSAGE_VIEW};
    case OPEN_CHAT_BOX:
      return {...state, isOpen: true};
    case CLOSE_CHAT_BOX:
      return {...state, isOpen: false};
    case REPLACE_CURRENT_RECEIVER:
      return {...state, currentReceiver: action.value};
    default:
      return state;
  }
};

export const socketInfoReducer: Reducer<ISocket, ChatActionType<any>> = (
  state = {key: '', socketUrl: '', brockers: null!},
  action,
) => {
  switch (action.type) {
    case SET_SOCKET_INFO:
      return {
        key: action.value.key,
        socketUrl: action.value.socketUrl,
        brockers: action.value.brockers,
      };
    default:
      return state;
  }
};

export default null;
