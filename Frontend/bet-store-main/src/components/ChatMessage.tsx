import { EmojiData, Picker } from "emoji-mart";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearGif, getMessageThunk, switchToConversation } from "../actions/chatBoxAction";
import {
  ChatAccountInfo,
  ChatViewControl,
  CHAT_HANDLER,
  Message,
  MessageControl,
  MESSAGE_VIEW,
} from "../reducers/chatBoxReducer";
import "emoji-mart/css/emoji-mart.css";
import style from "../styles/ChatBox.module.scss";
import SocketManager from "./SocketManager";
import { CDN_SERVER_PREFIX, CHAT_KEY } from "./ChatBox";
import Axios, { AxiosRequestConfig } from "axios";
import { GifPicker, gifWidthDisplay, giphyFetch } from "./GifPicker";
import { getMeta } from "./Utils";

const TEXT_EDITOR_MAX_ROW = 5;
const INPUT_TEXT_HANDLER_DELAY = 5;

const imageThumbnailMessageWidth = 320;
const imageThumbnailMessageHeight = 266;

export const CONTENT_NONE = "CONTENT_NONE";
export const CONTENT_PRODUCT_INFO = "CONTENT_PRODUCT_INFO";
export const CONTENT_FILE = "CONTENT_FILE";
export const CONTENT_GIF = "CONTENT_GIF";
export const CONTENT_IMAGE = "CONTENT_IMAGE";


const ChatMessage = React.memo(() => {
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );
  const messageControlState = useSelector(
    (state: { messageControl: MessageControl }) => state.messageControl
  );
  const view = useSelector((state: { viewControl: ChatViewControl }) => state.viewControl);
  const gifControlState = useSelector((state: {gifControl: {isClearGif: boolean}}) => state.gifControl);

  const [chosenEmoji, setChosenEmoji] = useState<any>(null);
  const [receiverInfo, setSenderInfo] = useState<ChatAccountInfo>(null);
  let prevMessageSize = 0;

  const dispatch = useDispatch();

  //#region set ref

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
    if (node == null) return;
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

  const gifPicker = useRef<HTMLElement>();
  const setGifPicker = useCallback((node : HTMLDivElement) => {
    gifPicker.current = node;
  }, []);

  const emojiBtn = useRef<HTMLElement>();
  const setEmojiBtn = useCallback((node) => {
    emojiBtn.current = node;
  }, []);

  const gifBtn = useRef<HTMLElement>();
  const setGifBtn = useCallback((node) => {
    gifBtn.current = node;
  }, []);

  const sendBtn = useRef<HTMLElement>();
  const setSendBtn = useCallback((node) => {
    sendBtn.current = node;
  }, []);

  //#endregion
  
  const pickEmojiBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (emojiPicker.current.style.display == "block") {
      emojiPicker.current.style.display = "none";
    } else {
      emojiPicker.current.style.display = "block";
      (emojiPicker.current.children[0] as HTMLElement).focus();
    } 
  };

  const pickGifBtn = (e : any) => {
    if (gifPicker.current.style.display == "block") {
      gifPicker.current.style.display = "none";
      dispatch(clearGif());
    } else {
      gifPicker.current.style.display = "block";
    }
  }

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

    if (e.key == "Enter" && !e.shiftKey) {
      (sendBtn.current as HTMLButtonElement).click();
      e.preventDefault();
    }
    if (e.shiftKey && e.key == "Enter") {
      node_t.value += "\n";
      onInputChange(null);
    }
  }

  const checkOutSideEmojiClick = (e: MouseEvent) => {
    if (emojiBtn.current && (emojiBtn.current as HTMLElement).contains(e.target as HTMLElement))
      return;
    if (
      emojiPicker.current &&
      !(emojiPicker.current as HTMLDivElement).contains(e.target as HTMLDivElement)
    ) {
      (emojiPicker.current as HTMLDivElement).style.display = "none";
    }
  }

  const checkOutSideGifClick = (e: MouseEvent) => {
    if (gifBtn.current 
      && (gifBtn.current as HTMLElement).contains(e.target as HTMLElement))
      return;

    if (!(gifPicker.current as HTMLDivElement).contains(e.target as HTMLDivElement)
    ) {
      (gifPicker.current as HTMLDivElement).style.display = "none";
      dispatch(clearGif());
    }
  }

  const handleClickOutside = (e: MouseEvent) => {
    checkOutSideEmojiClick(e);  
    checkOutSideGifClick(e);
  };

  const sendMessageTxt = (e : string) => {
    // check message first
    let lines = e.split('\n'), res = '';

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length == 0) continue;
      res += lines[i] + '\n';
    }
    if (res.length > 0) {
      let payload: Message = {
        id: "",
        senderId: accountState.id,
        receiverId: receiverInfo.id,
        textContent: res,
        fileContent: "",
        fileContentType: CONTENT_NONE,
      }
      publishMessage(payload);
    }
    (inputArea.current as HTMLTextAreaElement).value = "";
    onInputChange(null);
  }

  const sendMessageImage = (fileId: string) => {
    let payload: Message = {
      id: "",
      senderId: accountState.id,
      receiverId: receiverInfo.id,
      textContent: "",
      fileContent: fileId,
      fileContentType: CONTENT_IMAGE,
    }
    publishMessage(payload);
  }

  const sendMessageFile = (fileId: string, filename: string) => {
    let payload: Message = {
      id: "",
      senderId: accountState.id,
      receiverId: receiverInfo.id,
      textContent: filename,
      fileContent: fileId,
      fileContentType: CONTENT_FILE,
    }
    publishMessage(payload); 
  }

  const sendMessageGif = (gif: any) => {
    let payload: Message = {
      id: "",
      senderId: accountState.id,
      receiverId: receiverInfo.id,
      textContent: "",
      fileContent: gif.id,
      fileContentType: CONTENT_GIF,
    }
    publishMessage(payload);
  }

  const publishMessage = (e: Message) => {
    SocketManager.publish(CHAT_KEY, {destination: CHAT_HANDLER, headers: {}, 
      content: JSON.stringify(e)});
  }

  const messageListHandle = () => {
    const scrollScale = 1.5;

    let node_t = messageBody.current as HTMLDivElement;
    let result: JSX.Element[] = [];

    for (let i = messageControlState.messageList.length - 1; i >= 0; i--) {
      let x = messageControlState.messageList[i];
      result.push((
        <div onLoad={e => {
          let x = e.target as HTMLDivElement;

          if (messageControlState.messageList.length <= 15) 
            return
          
          if (i > prevMessageSize) {
            if (x != null)
              node_t.scrollTop += x.offsetHeight * scrollScale;
            //
          } else prevMessageSize = messageControlState.messageList.length;
        }}>
          <ChatMessageBox
            id={x.id}
            senderId={x.senderId}
            receiverId={x.receiverId}
            textContent={x.textContent}
            fileContent={x.fileContent}
            fileContentType={x.fileContentType}
          ></ChatMessageBox>
        </div>
      ));
    }
    return result;
  }

  const onToolBarClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (toolBar.current.style.display == "none") {
      toolBar.current.style.display = "flex";
    } else {
      toolBar.current.style.display = "none";
      gifPicker.current.style.display = "none";

      dispatch(clearGif());
    }
  }

  const getReceiverInfo = async () : Promise<ChatAccountInfo> => {
    let response = await Axios.get(`/java/api/profile/get?accountid=${view.currentReceiver}`);
    return {
      id: view.currentReceiver,
      avatar: response.data.data.avatar,
      user: response.data.data.username
    } 
  }

  const onChooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files[0];

    let formData = new FormData();
    formData.append('files', file);

    let axiosConf: AxiosRequestConfig = {
      method: "post",
      url:"/cdn/upload",
      data: formData
    }
    Axios(axiosConf).then(res => {
      let fileId = res.data[file.name];
      sendMessageImage(fileId);
    })
  }

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files[0];

    let formData = new FormData();
    formData.append('files', file);

    let axiosConf: AxiosRequestConfig = {
      method: "post",
      url:"/cdn/upload",
      data: formData
    }
    Axios(axiosConf).then(res => {
      let fileId = res.data[file.name];
      sendMessageFile(fileId, file.name);
    });
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
    if (view.currentReceiver == "")
      return;

    if (view.viewId == MESSAGE_VIEW) {
      getReceiverInfo().then(x => {
        setSenderInfo(x);
      });
    }
    
    document.addEventListener("mousedown", handleClickOutside);      
    prevMessageSize = 0;
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
          <img src={`/cdn/cdn/${receiverInfo.avatar}`}></img>
          <div>
            <h3>{receiverInfo.user}</h3>
            <br></br>
            <p>Đang hoạt động</p>
          </div>
        </div>
      </div>

      <div className={style.messageMainPanel}>
        <div className={style.messageBody} ref={setMessageBody} 
          onScroll={(e) => {
            messageBodyScrollup(e);
          }}>
          {messageListHandle()}
        </div>

        <div className={style.messageToolBar}>
          <div className={style.toolBar} ref={setToolBar}>

            <div className={style.gifPicker} ref={setGifPicker} >
              <GifPicker onGifChoosen={(gif: any, e: any) => {
                e.preventDefault();
                gifBtn.current.click();
                sendMessageGif(gif);
              }}>
              </GifPicker>
            </div>

            {/* gif tool */}
            <div className={style.tool} ref={setGifBtn} onClick={pickGifBtn}>
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

            {/* image tool */}
            <div className={style.tool}>
              <input id="chooseImgInput" name="send images" type="file" accept="image/png,image/jpg,image/jpeg" 
                style={{display:"none"}} 
                onChange={onChooseImage}></input>
              <i className="fa fa-image fa-2x" onClick={() => {
                document.getElementById('chooseImgInput').click();
              }}></i>
            </div>
            
            {/* file tool */}
            <div className={style.tool}>
              <input id="chooseFileInput" name="send file" type="file" style={{display:"none"}} 
                  onChange={onChooseFile}></input>
              <i className="fa fa-file fa-2x" onClick={() => {
                document.getElementById('chooseFileInput').click();
              }}></i>
            </div>
          </div>
          <div className={style.textEditor}>
            <i className="fa fa-plus-circle fa-2x" onClick={onToolBarClick}
            ></i>
            <div className={style.inputArea}>
              <div style={{ width: "100%" }}>
                <div ref={setHiddenDiv}></div>
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

              <i className="fa fa-smile-o fa-2x" ref={setEmojiBtn} onClickCapture={pickEmojiBtn}></i>
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

const ImageThumpnailToolbox: React.FC<{index: number}> = (param) => {
  return (
    <div></div>
  ) 
}

const ChatMessageBox: React.FC<Message> = (message) => {
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );
  const [toggle, setToggle] = useState<boolean>(false);
  const imgDisplay = useRef<JSX.Element>();

  const longTextHandle = (text: string) => {
    const maxCharacter = 25;
    let content = text.substr(0, text.lastIndexOf('.') - 1);
    let extension = text.substr(text.lastIndexOf('.') + 1, text.length - 1);

    if (content.length >= maxCharacter) {
      return content.substring(0, maxCharacter - 1) + "..." + `[${extension}]` ;
    }
    return text;
  };

  const textHandle = (txt: string) => {
    return txt.replace(/\n/g, "<br>");
  }

  const renderOnContent = () => {
    if (message.fileContentType == CONTENT_NONE) {
      return (
        <div 
          className={style.messageTxtContent} 
          dangerouslySetInnerHTML={{__html: textHandle(message.textContent)}}>
        </div>
      );
    } else if (message.fileContentType == CONTENT_IMAGE) {
      return (
        <div className={style.messageImgContent} onClick={() => {
          let win = window.open(`${CDN_SERVER_PREFIX}${message.fileContent}`, '_blank');
          win.focus();
        }}> 
          {(() => {
            let fullSizeUrl = `${CDN_SERVER_PREFIX}${message.fileContent}`;
            let displayWidth = imageThumbnailMessageWidth;
            let displayHeight = imageThumbnailMessageHeight;

            getMeta(fullSizeUrl, (width: number, height: number) => {
              if (height < displayHeight) {
                displayHeight = height * (displayWidth / width);
              } else if (width < displayWidth) {
                displayWidth = displayHeight * (width / height);
              }
              imgDisplay.current = (
                <img src={`${fullSizeUrl}?width=${displayWidth}&height=${displayHeight}`} alt={CONTENT_IMAGE}>
                </img>
              )
              setToggle(!toggle);
            });

            if (imgDisplay.current == null) {
              return (
                <div style={{height:`${imageThumbnailMessageHeight}px`}}> Image is loading...</div>
              )
            } else {
              return imgDisplay.current;
            }
          })()}
        </div>
      );
    } else if (message.fileContentType == CONTENT_FILE) {
      return (
        <div className={style.messageTxtContent} style={{cursor:"pointer"}} onClick={() => {
          let win = window.open(`${CDN_SERVER_PREFIX}${message.fileContent}`, '_blank');
          win.focus();
        }}>
          <div style={{display: "flex"}}>
            <i className="fa fa-file-archive-o fa-2x"></i>
            <strong>&nbsp;&nbsp; <u>{longTextHandle(message.textContent)}</u></strong>
          </div>
        </div>
      )
    } else if (message.fileContentType == CONTENT_GIF) {
      return (
        <div className={style.messageImgContent} 
          style={{width:`${imageThumbnailMessageWidth.toString()}px`, height:`${imageThumbnailMessageHeight.toString()}px`}} 
          onClick={() => {
            let win = window.open(`https://media.giphy.com/media/${message.fileContent}/giphy.gif`);
            win.focus();
          }}
        >
          <img src={`https://media.giphy.com/media/${message.fileContent}/giphy.gif`}
            width={imageThumbnailMessageWidth.toString()}
            height={imageThumbnailMessageHeight.toString()}
            alt={CONTENT_GIF}>
          </img>
        </div>
      )
    }
    else return (<div></div>)
  }

  if (message.senderId == accountState.id) {
    return (
      <div className={style.messageFromMe}>
        {renderOnContent()}
      </div>
    );
  } else {
    return (
      <div className={style.messageFromOther}>
        {renderOnContent()}
      </div>
    );
  }
};

export default ChatMessage;
