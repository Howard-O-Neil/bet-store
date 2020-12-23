import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import reactElementToJSXString from "react-element-to-jsx-string";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatActionType,
  getAccountInfoThunk,
  getConversationThunk,
  repalceCurrentReceiver,
  switchToConversation,
  switchToMessage,
} from "../actions/chatBoxAction";
import { ChatAccountInfo, Conversation, ConversationControl } from "../reducers/chatBoxReducer";
import style from "../styles/ChatBox.module.scss";
import { ChatApiUtils } from "./ChatApiUtils";
import SocketManager from "./SocketManager";

const ChatConversation = React.memo(() => {
  // state + dispatch
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );
  const conversationState = useSelector(
    (state: { conversationControl: ConversationControl }) => state.conversationControl
  );
  const [conversationFilter, setConversationFilter] = useState<Conversation[]>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (accountState.id == "") return;
    getConversationThunk(dispatch, () => null, {
      senderId: accountState.id,
      index: 0,
      loadPrev: false,
    });
  }, [accountState]);

  const onscrollDown = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    let targetDiv = e.target as HTMLDivElement;

    if (targetDiv.scrollHeight - targetDiv.scrollTop === targetDiv.clientHeight) {
      targetDiv.scrollTop -= 10;

      getConversationThunk(dispatch, () => null, {
        senderId: accountState.id,
        index: conversationState.requestIndex,
        loadPrev: true,
      });
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className={style.conversationHeader}>
        <h1>Message</h1>
        <div className={style.searchBar}>
          <i className="fas fa-search fa-2x"></i>
          <input type="text" placeholder="Search" spellCheck="false"></input>
        </div>
      </div>
      <div className={style.conversationBody} onScroll={onscrollDown}>
        {conversationState.conversationList.map((x) => (
          <ChatConversationBox
            id={x.id}
            receiverId={x.receiverId}
            senderId={x.senderId}
          ></ChatConversationBox>
        ))}
        {() => {
          if (conversationState.conversationList.length <= 0) {
            return <h5>Bạn chưa có cuộc hội thoại nào</h5>;
          }
        }}
      </div>
    </div>
  );
});

export const ChatConversationBox: React.FC<Conversation> = (conversation) => {
  const [userInfo, setUserInfo] = useState<ChatAccountInfo>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // get info from an api
    setUserInfo(ChatApiUtils.requestUser(conversation.receiverId));
  }, []);

  const textHandle = (text: string) => {
    const maxCharacter = 30;
    if (text.length >= maxCharacter) {
      return text.substring(0, maxCharacter - 1) + "...";
    }
    return text;
  };

  if (userInfo == null) {
    return <div></div>;
  }
  return (
    <div
      className={style.conversationBox}
      onClick={() => {
        dispatch(repalceCurrentReceiver(conversation.receiverId));
        dispatch(switchToMessage());
      }}
    >
      <img src={userInfo.avatar}></img>
      <div>
        <h4>{userInfo.user}</h4>
        <p> {textHandle("Bạn: Ohaiyo Itadakimashu ouohueiuheiufh")}</p>
        <hr></hr>
        <h5>2 gio truoc</h5>
      </div>
    </div>
  );
};

export default ChatConversation;
