import { IMessage } from "@stomp/stompjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountInfoThunk, messageReceive, openChatBox, setSocketInfo } from "../actions/chatBoxAction";
  import { ChatAccountInfo, ChatViewControl, CONVERSATION_VIEW, EMPTY_VIEW, MESSAGE_VIEW } from "../reducers/chatBoxReducer";
import style from "../styles/ChatBox.module.scss";
import ChatConversation from "./ChatConversation";
import ChatMessage from "./ChatMessage";
import { ISocket } from "./SocketManager";

export const CHAT_KEY = "CHAT_BOX";
export const CHAT_HANDLER = "/chat/handle";

const ChatBox: React.FC = () => {
  const accountState = useSelector((state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo);
  const view = useSelector((state: { viewControl: ChatViewControl }) => state.viewControl);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const dispatch = useDispatch();

  let pannel = useRef<HTMLElement[]>(new Array(3));

  // 0 = main pannel, include all chat component
  const setMainPannel = useCallback((node) => (pannel.current[0] = node), []);
  const setConversationPannel = useCallback((node) => (pannel.current[1] = node), []);
  const setMessagePannel = useCallback((node) => (pannel.current[2] = node), []);

  const messageReceiveHandler = (payload: IMessage) => {
    dispatch(messageReceive(JSON.parse(payload.body).data));
  };
  const conversationReceiveHandler = (payload: IMessage) => {

  };
  const testReceiveHandler = (payload: IMessage) => {
    alert(payload);
  };

  const initSocketConnectionString = (): ISocket => {
    return {
      key: CHAT_KEY,
      socketUrl: `/java/chat-socket`,
      brockers: [
        {
          brocker: `/chat/message/${accountState.id}`,
          receiveHandler: messageReceiveHandler,
        },
        {
          brocker: `/chat/room/${accountState.id}`,
          receiveHandler: conversationReceiveHandler,
        },
        {
          brocker: `/testChannel`,
          receiveHandler: testReceiveHandler,
        },
      ],
    };
  };

  useEffect(() => {
    setIntervalId(
      setInterval(() => {
        if (sessionStorage.getItem("token") != null) {
          clearInterval(intervalId);
          setInterval(null);
        }
      }, 500)
    );
  }, []);

  useEffect(() => {
    if (intervalId == null) {
      getAccountInfoThunk(dispatch, () => null, sessionStorage.getItem("token"));
    }
  }, [intervalId])

  useEffect(() => {
    if (accountState.id == "") return;
    dispatch(setSocketInfo(initSocketConnectionString()));
  }, [accountState]);

  useEffect(() => {
    if (view.viewId == EMPTY_VIEW) {
      return;
    }
    if (view.viewId == CONVERSATION_VIEW) {
      (pannel.current[1] as HTMLDivElement).style.display = "block";
      (pannel.current[2] as HTMLDivElement).style.display = "none";
    } else if (view.viewId == MESSAGE_VIEW) {
      (pannel.current[1] as HTMLDivElement).style.display = "none";
      (pannel.current[2] as HTMLDivElement).style.display = "block";
    }
  }, [view]);

  if (sessionStorage.getItem("token") == null) {
    return <div />;
  }
  return (
    <div>
      <div className={style.mainPane} ref={setMainPannel}>
        <div className={style.conversationPannel} ref={setConversationPannel}>
          <ChatConversation></ChatConversation>
        </div>

        <div className={style.messagePannel} ref={setMessagePannel}>
          <ChatMessage></ChatMessage>
        </div>
      </div>
      {view.isOpen === false && (
        <div
          className={style.chatBox}
          onClick={() => {
            dispatch(openChatBox(true));
            (pannel.current[0] as HTMLDivElement).style.display = "block";
          }}
        >
          <i style={{ color: "#ffffff" }} className="fas fa-comments fa-3x"></i>
        </div>
      )}
      {view.isOpen === true && (
        <div>
          <div
            className={style.chatBox}
            onClick={() => {
              dispatch(openChatBox(false));
              (pannel.current[0] as HTMLDivElement).style.display = "none";
            }}
          >
            <i style={{ color: "#ffffff" }} className="fas fa-close fa-3x"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
