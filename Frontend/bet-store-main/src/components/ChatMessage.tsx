import { EmojiData, Picker } from "emoji-mart";
import React, { ReactEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessageThunk, switchToConversation } from "../actions/chatBoxAction";
import {
  ChatAccountInfo,
  ChatViewControl,
  CHAT_HANDLER,
  Message,
  MessageControl,
} from "../reducers/chatBoxReducer";
import "emoji-mart/css/emoji-mart.css";
import style from "../styles/ChatBox.module.scss";
import { ChatApiUtils } from "./ChatApiUtils";
import { fromPxToOffset, getTextWidth, toDomNode } from "./Utils";
import { JsxElement } from "typescript";
import SocketManager from "./SocketManager";
import { CHAT_KEY } from "./ChatBox";

const TEXT_EDITOR_MAX_ROW = 5;
const INPUT_TEXT_HANDLER_DELAY = 5;

export const CONTENT_NONE = "CONTENT_NONE";
export const CONTENT_PRODUCT_INFO = "CONTENT_PRODUCT_INFO";
export const CONTENT_SOUND = "CONTENT_SOUND";
export const CONTENT_IMAGE = "CONTENT_IMAGE";
export const CONTENT_PLAINTEXT = "CONTENT_PLAINTEXT";
export const CONTENT_ZIP = "CONTENT_ZIP";
export const CONTENT_RAR = "CONTENT_RAR";

const ChatMessage = React.memo(() => {
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );
  const messageControlState = useSelector(
    (state: { messageControl: MessageControl }) => state.messageControl
  );
  const view = useSelector((state: { viewControl: ChatViewControl }) => state.viewControl);

  const [chosenEmoji, setChosenEmoji] = useState<any>(null);
  const [receiverInfo, setSenderInfo] = useState<ChatAccountInfo>(null);

  const dispatch = useDispatch();

  const inputArea = useRef<HTMLElement>();
  const setInputArea = useCallback((node) => {
    inputArea.current = node;
  }, []);

  const messageBody = useRef<HTMLElement>();
  const setMessageBody = useCallback((node) => {
    messageBody.current = node;
  }, []);

  const hiddenDiv = useRef<HTMLDivElement>();
  const setHiddenDiv = useCallback((node) => {
    let node_t = inputArea.current as HTMLTextAreaElement;
    hiddenDiv.current = node;

    hiddenDiv.current.style.overflowY = "scroll";
    hiddenDiv.current.style.fontFamily = "inherit";
    hiddenDiv.current.style.fontSize = "inherit";
    hiddenDiv.current.style.lineHeight = "inherit";
    hiddenDiv.current.style.width = "290px";
    hiddenDiv.current.style.maxHeight = "130px";
    hiddenDiv.current.style.padding = "2px";
    hiddenDiv.current.style.minHeight = "20px";
    hiddenDiv.current.style.whiteSpace = "pre-wrap";
    hiddenDiv.current.style.wordWrap = "break-word";
    hiddenDiv.current.style.display = "none";
  }, []);

  const toolBar = useRef<HTMLElement>();
  const setToolBar = useCallback((node) => {
    toolBar.current = node;
  }, []);

  const emojiPicker = useRef<HTMLElement>();
  const setEmojiPicker = useCallback((node: HTMLDivElement) => {
    emojiPicker.current = node;
  }, []);

  const emojiBtn = useRef<HTMLElement>();
  const setEmojiBtn = useCallback((node) => {
    emojiBtn.current = node;
  }, []);

  const sendBtn = useRef<HTMLElement>();
  const setSendBtn = useCallback((node) => {
    sendBtn.current = node;
  }, []);

  const pickEmoji = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (emojiPicker.current.style.display == "block") {
      emojiPicker.current.style.display = "none";
    } else emojiPicker.current.style.display = "block";
  };

  const onInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    let node_t = inputArea.current as HTMLTextAreaElement;
    let content = node_t.value;

    content = content.replace(/\n/g, "<br>");
    hiddenDiv.current.innerHTML = content + "<br>";

    hiddenDiv.current.style.visibility = "hidden";
    hiddenDiv.current.style.display = "block";

    node_t.style.height = hiddenDiv.current.offsetHeight + "px";
    hiddenDiv.current.style.display = "none";

    node_t.scrollTop += node_t.scrollHeight - node_t.clientHeight;
  };

  const messageBodyScrollup = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    let node_t = e.target as HTMLDivElement;

    if (node_t.scrollTop <= 1) {
      node_t.scrollTop += 2;

      getMessageThunk(dispatch, () => null, {
        senderId: accountState.id,
        receiverId: receiverInfo.id,
        index: messageControlState.requestIndex,
        loadPrev: true
      });
    }
  }

  const textAreaKeydown = (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
    let node_t = e.target as HTMLTextAreaElement;

    if (e.key == "Enter") {
      (sendBtn.current as HTMLButtonElement).click();
      e.preventDefault();
    }
    if (e.shiftKey && e.key == "Enter") {
      node_t.value += "\n";
      onInputChange(null);
    }
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (emojiBtn.current && (emojiBtn.current as HTMLElement).contains(e.target as HTMLElement))
      return;
    if (
      emojiPicker.current &&
      !(emojiPicker.current as HTMLDivElement).contains(e.target as HTMLDivElement)
    ) {
      (emojiPicker.current as HTMLDivElement).style.display = "none";
    }
  };

  const sendMessageTxt = (e : string) => {
    if (e.length == 0) return;

    let payload: Message = {
      id: "",
      senderId: accountState.id,
      receiverId: receiverInfo.id,
      textContent: e,
      fileContent: "",
      fileContentType: CONTENT_NONE,
    }
    publishMessage(payload);
  }

  const publishMessage = (e: Message) => {
    SocketManager.publish(CHAT_KEY, {destination: CHAT_HANDLER, headers: {}, 
      content: JSON.stringify(e)});
    (inputArea.current as HTMLTextAreaElement).value = "";
    onInputChange(null);
  }

  const messageListHandle = () => {
    let result: JSX.Element[] = [];
    for (let i = messageControlState.messageList.length - 1; i >= 0; i--) {
      let x = messageControlState.messageList[i];
      result.push((
        <ChatMessageBox
          id={x.id}
          senderId={x.senderId}
          receiverId={x.receiverId}
          textContent={x.textContent}
          fileContent={x.fileContent}
          fileContentType={x.fileContentType}
        ></ChatMessageBox>
      ));
    }
    return result;
  }

  useEffect(() => {
    if (chosenEmoji) {
      let cursorPos = (inputArea.current as HTMLTextAreaElement).selectionStart;
      let txt = (inputArea.current as HTMLTextAreaElement).value;

      (inputArea.current as HTMLTextAreaElement).value =
        txt.slice(0, cursorPos) + chosenEmoji.native + txt.slice(cursorPos);
      (inputArea.current as HTMLTextAreaElement).selectionStart =
        cursorPos + (chosenEmoji.native as string).length;

      onInputChange(null);
    }
  }, [chosenEmoji]);

  useEffect(() => {
    // get info from an api
    setSenderInfo(ChatApiUtils.requestUser(view.currentReceiver));

    document.addEventListener("mousedown", handleClickOutside);      
  }, [view]);

  useEffect(() => {
    if (receiverInfo == null) return;

    getMessageThunk(dispatch, () => null, {
      senderId: accountState.id,
      receiverId: receiverInfo.id,
      index: 0,
      loadPrev: false,
    });
  }, [receiverInfo]);

  useEffect(() => {
    if (messageBody.current == null) return;

    if (messageControlState.messageList.length == 15 || messageControlState.appendMessage) {
      let node_t = messageBody.current as HTMLDivElement;
      node_t.scrollTop = node_t.scrollHeight;  
    }
  }, [messageControlState])

  if (receiverInfo == null) {
    return <div></div>;
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className={style.messageHeader}>
        <div>
          <i
            className="fa fa-arrow-left fa-2x"
            onClick={() => {
              dispatch(switchToConversation());
            }}
          ></i>
          <img src={receiverInfo.avatar}></img>
          <div>
            <h3>{receiverInfo.user}</h3>
            <br></br>
            <p>Đang hoạt động</p>
          </div>
        </div>
      </div>

      <div className={style.messageMainPanel}>
        <div 
          className={style.messageBody} ref={setMessageBody} 
          onScroll={(e) => {
            messageBodyScrollup(e);
          }}>
          {messageListHandle()}
        </div>

        <div className={style.messageToolBar}>
          <div className={style.toolBar} ref={setToolBar}>
            <div className={style.tool}>
              <i className="fa fa-image fa-2x"></i>
            </div>
            <div className={style.tool}>
              <div
                style={{ borderRadius: "5px", border: "2px solid black", padding: "0 5px 0 5px" }}
              >
                <p
                  style={{ fontWeight: "bold", fontSize: "smaller", transform: "translateY(7px)" }}
                >
                  GIF
                </p>
              </div>
            </div>
          </div>
          <div className={style.textEditor}>
            <i
              className="fa fa-plus-circle fa-2x"
              onClick={() => {
                if (toolBar.current.style.display == "none") {
                  toolBar.current.style.display = "flex";
                } else {
                  toolBar.current.style.display = "none";
                }
              }}
            ></i>
            <div className={style.inputArea}>
              <div style={{ width: "100%" }}>
                <textarea 
                  rows={1} ref={setInputArea} 
                  onKeyDown={(e) => {
                    textAreaKeydown(e);
                  }} 
                  placeholder="Aa" 
                  onInput={(e) => {
                    onInputChange(e);
                  }}>
                  
                </textarea>
                <div ref={setHiddenDiv}></div>
              </div>

              <div className={style.emojiPicker} ref={setEmojiPicker}>
                <Picker
                  title="Pick your emoji…"
                  emoji="point_up_2"
                  onSelect={(e: EmojiData) => {
                    setChosenEmoji(e);
                  }}
                />
              </div>

              <i className="fa fa-smile-o fa-2x" ref={setEmojiBtn} onClickCapture={pickEmoji}></i>
            </div>
            <i ref={setSendBtn} className="fa fa-send fa-2x" onClick={() => {
                sendMessageTxt((inputArea.current as HTMLTextAreaElement).value);
              }}>
            </i>
          </div>
        </div>
      </div>
    </div>
  );
});

const ChatMessageBox: React.FC<Message> = (message) => {
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );

  const textHandle = (txt: string) => {
    return txt.replace(/\n/g, "<br>");
  }

  if (message.senderId == accountState.id) {
    return (
      <div className={style.messageFromMe}>
        <div 
          className={style.messageTxtContent} 
          dangerouslySetInnerHTML={{__html: textHandle(message.textContent)}}>
        </div>
      </div>
    );
  } else {
    return (
      <div className={style.messageFromOther}>
        <div 
          className={style.messageTxtContent} 
          dangerouslySetInnerHTML={{__html: textHandle(message.textContent)}}>
        </div>
      </div>
    );
  }
};

export default ChatMessage;
