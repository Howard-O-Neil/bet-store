import Axios from "axios";
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

import { ChatAccountInfo, Conversation, ConversationControl,Message } from "../reducers/chatBoxReducer";
import style from "../styles/ChatBox.module.scss";
import { ChatApiUtils } from "./ChatApiUtils";
import { CONTENT_FILE, CONTENT_GIF, CONTENT_IMAGE, CONTENT_NONE } from "./ChatMessage";
import SocketManager from "./SocketManager";

import noAvatar from "../resource/images/icons/noAvatar.png";
import { Button } from "react-bootstrap";


export var searchString = "";

const ChatConversation = React.memo(() => {
  // state + dispatch
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );
  const conversationState = useSelector(
    (state: { conversationControl: ConversationControl }) => state.conversationControl
  );
  
  const [conversationFilter, setConversationFilter] = useState<Conversation[]>([]);

  const dispatch = useDispatch();

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

  const listConversationHandle = () => {
    let res: JSX.Element[] = [];
    for (let i = 0; i < conversationState.conversationList.length; i++) {
      let x = conversationState.conversationList[i];
      res.push(
        <ChatConversationBox
          id={x.id}
          receiverId={x.receiverId}
          senderId={x.senderId}
        ></ChatConversationBox>
      );
    }
    return res;
  }

  useEffect(() => {
    if (accountState.id == "") return;
    
    getConversationThunk(dispatch, () => null, {
      senderId: accountState.id,
      index: 0,
      loadPrev: false,
    });
    
  }, [accountState]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className={style.conversationHeader}>
        <h1>Message</h1>
        <div className={style.searchBar}>
          <i className="fas fa-search fa-2x"></i>
          <input type="text" placeholder="Search" spellCheck="false"
            onChange={e => {
              // filterConversation(e.target.value);
            }}></input>
        </div>
      </div>
      <div className={style.conversationBody} onScroll={onscrollDown}>
        {listConversationHandle()}
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
  const [messageThumpnail, setMessageThumbnail] = useState<string>("Loading...");
  const dispatch = useDispatch();

  const getReceiverInfo = async () : Promise<ChatAccountInfo> => {
    let response = await Axios.get(`/java/api/profile/get?accountid=${conversation.receiverId}`);

    if (response.data.data == null) {
      return null;
    }

    return {
      id: conversation.receiverId,
      avatar: response.data.data.avatar,
      user: response.data.data.username
    } 
  }

  const loadThumbnailTextMessage = () => {
    Axios.get(
      `/java/api/message/get?senderid=${conversation.senderId}&receiverid=${conversation.receiverId}&index=${0}`
    ).then(res => {
      let result: Message[] = res.data.data;

      if (result.length == 0) {
        setMessageThumbnail("Bạn chưa có tin nhắn");
        return;
      }

      if (result[0].fileContentType != CONTENT_NONE) {
        if (result[0].fileContentType == CONTENT_IMAGE) {
          setMessageThumbnail("Bạn đã gửi 1 ảnh");
        }
        else if (result[0].fileContentType == CONTENT_GIF) {
          setMessageThumbnail("Bạn đã gửi 1 ảnh động");
        }
        else if (result[0].fileContentType == CONTENT_FILE) {
          setMessageThumbnail("Bạn đã gửi 1 File");
        }
        else setMessageThumbnail("File không nhận dạng");
      }
      else setMessageThumbnail(result[0].textContent);
    })
  }

  useEffect(() => {
    getReceiverInfo().then(x => {
      setUserInfo(x);
      loadThumbnailTextMessage();
    });
  }, []);

  const textHandle = (text: string) => {
    const maxCharacter = 30;
    if (text.length >= maxCharacter) {
      return text.substring(0, maxCharacter - 1) + "...";
    }
    return text;
  };

  const handleAvatar = () => {
    if (userInfo.avatar == "") {
      return noAvatar;
    } 
    return `/cdn/cdn/${userInfo.avatar}`;
  }

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
      <img src={handleAvatar()}></img>
      <div>
        <h4>{userInfo.user}</h4>
        <p> {textHandle(messageThumpnail)}</p>
        <hr></hr>
        <h5>2 gio truoc</h5>
      </div>
    </div>
  );
};

export default ChatConversation;
