import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SvgUri } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { CDNAPI, JavaAPI } from "../../define";
import { getMessageThunk, switchToConversation } from "../actions/chatBoxAction";
import { ChatAccountInfo, ChatViewControl, CHAT_HANDLER, Message, MessageControl, MESSAGE_VIEW } from "../reducers/chatBoxReducer";
import { CDN_SERVER_PREFIX, CHAT_KEY } from "./ChatView";
import Axios, { AxiosRequestConfig } from 'axios';
import SocketManager from "./SocketManager";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faBackward, faFileArchive, faFileImage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../types";
import { ImagePicker } from "expo";

export const CONTENT_NONE = "CONTENT_NONE";
export const CONTENT_PRODUCT_INFO = "CONTENT_PRODUCT_INFO";
export const CONTENT_FILE = "CONTENT_FILE";
export const CONTENT_GIF = "CONTENT_GIF";
export const CONTENT_IMAGE = "CONTENT_IMAGE";

var noAvatarUrl = "../../assets/images/noAvatar.png";


const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 5,
    width: "100%", height: "100%"
  },
  messageViewHeader: {
    backgroundColor: '#2980B9',
    flexDirection: "row",
    alignItems: 'center',
    padding: 5,
  },
  messageViewBody: {
    padding: 5,
    width: '100%',
    height: '78%',
  },
  messageViewToolbar: {
    padding: 5,
    height: 45,
    width: '100%',
    alignItems: 'center',
    marginBottom: -5,
    backgroundColor: "#F7F7F7"
  },
  messageAvatar: {
    backgroundColor: '#ffffff',
    width: 65, height: 65,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "blue"
  },
  messageFromMe: {
    marginBottom: 5,
    alignSelf: "flex-end",
    textAlign: "right",
    backgroundColor: '#9ADAFF',
    borderRadius: 10,
    maxWidth: '80%',
    flexWrap: "wrap",
    padding: 5,
  },
  messageFromOther: {
    marginBottom: 5,
    alignSelf: "flex-start",
    textAlign: "left",
    backgroundColor: '#E3E3E3',
    borderRadius: 10,
    maxWidth: '80%',
    flexWrap: "wrap",
    padding: 5,
  }
});

export const MessageView: React.FC = () => {
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );
  const messageControlState = useSelector(
    (state: { messageControl: MessageControl }) => state.messageControl
  );
  const view = useSelector((state: { viewControl: ChatViewControl }) => state.viewControl);
  const gifControlState = useSelector((state: { gifControl: { isClearGif: boolean } }) => state.gifControl);

  const [chosenEmoji, setChosenEmoji] = useState<any>(null);
  const [receiverInfo, setReceiverInfo] = useState<ChatAccountInfo>(null);

  const textInput = useRef<TextInput>(null);
  const messageContent = useRef<string>("");

  const dispatch = useDispatch();

  let paddingInput = new Animated.Value(0);
  let keyboardWillShowUp = Keyboard.addListener('keyboardWillShow', e => {
    Animated.timing(paddingInput, {
      duration: e.duration,
      toValue: 60,
      useNativeDriver: false,
    }).start();
  })

  let keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', e => {
    Animated.timing(paddingInput, {
      duration: e.duration,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  })

  const sendMessageTxt = (e: string) => {
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
    SocketManager.publish(CHAT_KEY, {
      destination: CHAT_HANDLER, headers: {},
      content: JSON.stringify(e)
    });
  }

  const messageListHandle = () => {
    let result: JSX.Element[] = [];

    for (let i = messageControlState.messageList.length - 1; i >= 0; i--) {
      let x = messageControlState.messageList[i];

      result.push(
        <ChatMessageBox
          id={x.id}
          senderId={x.senderId}
          receiverId={x.receiverId}
          textContent={x.textContent}
          fileContent={x.fileContent}
          fileContentType={x.fileContentType}
        ></ChatMessageBox>
      );
    }
    return result;
  }

  const handleAvatar = () => {
    let fileExtension = receiverInfo.avatar.split('.').pop();

    if (receiverInfo.avatar == noAvatarUrl) {
      return <Image
        style={styles.messageAvatar}
        source={require("../../assets/images/noAvatar.png")}
      />
    }
    if (fileExtension == 'svg') {
      return (
        <View style={styles.messageAvatar}>
          <SvgUri width={65} height={65} uri={`${CDNAPI}/cdn/${receiverInfo.avatar}`}>
          </SvgUri>
        </View>
      )
    }
    return (<Image
      style={styles.messageAvatar}
      source={{
        width: 65, height: 65,
        uri: `${CDNAPI}/cdn/${receiverInfo.avatar}`
      }}
    />);
  }

  const getReceiverInfo = async (): Promise<ChatAccountInfo> => {
    let response = await Axios.get(`${JavaAPI}/api/profile/get?accountid=${view.currentReceiver}`);

    if (response.data.data == null) {
      return {
        id: view.currentReceiver,
        avatar: noAvatarUrl,
        user: `User-${view.currentReceiver.substr(0, 10)}`
      }
    }
    return {
      id: view.currentReceiver,
      avatar: response.data.data.avatar,
      user: response.data.data.username
    }
  }

  const sendImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (result.cancelled) return;

    let localUri = result.uri;
    let filename = localUri.split("/").pop();
    if (filename == undefined) return;
    let match = /\.(\w+)$/.exec(filename == undefined ? "" : filename);
    let type = match ? `image/${match[1]}` : `image`;

    let query = {
      uri: localUri,
      name: filename,
      type,
    };

    let formData = new FormData();
    formData.append('files', localUri);

    let axiosConf: AxiosRequestConfig = {
      method: "post",
      url:`${CDNAPI}/upload`,
      data: formData
    }
    Axios(axiosConf).then(res => {
      let fileId = res.data[filename];
      sendMessageImage(fileId);
    })
  }

  useEffect(() => {
    if (view.currentReceiver == "")
      return;

    if (view.viewId == MESSAGE_VIEW) {
      getReceiverInfo().then(x => {
        setReceiverInfo(x);
      });
    }
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
    messageListHandle();

  }, [messageControlState])

  if (receiverInfo == null) {
    return <View></View>;
  }
  return (
    <View style={styles.mainView}>
      <View style={styles.messageViewHeader}>
        <TouchableOpacity style={{ height: '80%', width: 30, marginRight: 10, backgroundColor: 'transparent', alignItems: 'center' }}
          onPress={e => {
            dispatch(switchToConversation());
          }}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: '#FFFFFF' }} size={25}></FontAwesomeIcon>
        </TouchableOpacity>
        {handleAvatar()}
        <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 25, fontWeight: 'bold', color: 'white' }}>{receiverInfo.user}</Text>
      </View>
      <ScrollView style={styles.messageViewBody}>
        <TouchableOpacity style={{ height: 45, width: '100%', marginTop: 2, backgroundColor: 'transparent', alignItems: 'center' }}
          onPress={e => {
            getMessageThunk(dispatch, () => null, {
              senderId: accountState.id,
              receiverId: receiverInfo.id,
              index: messageControlState.requestIndex,
              loadPrev: true
            });
          }}>
          <Text style={{ color: "#000000", textDecorationLine:'underline', textAlignVertical: "top", fontSize:20, height: '100%' }}>Load More</Text>
        </TouchableOpacity>
        {[messageListHandle()]}
        <View style={{height: 20}}>

        </View>
      </ScrollView>
      <View style={styles.messageViewToolbar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
          <TouchableOpacity onPress={e => {
            sendImg();
          }}>
            <FontAwesomeIcon icon={faFileImage} style={{ color: '#000000', marginRight: 5 }} size={25}></FontAwesomeIcon>
          </TouchableOpacity>
          <TextInput style={{ marginRight: 5, backgroundColor: '#EEEEEE', width: '85%', height: 30, fontSize: 18, borderRadius: 15, padding: 5 }} 
            ref={e => {textInput.current = e}}
            onChangeText={e => {messageContent.current = e}}>

          </TextInput>
          <TouchableOpacity onPress={e => {sendMessageTxt(messageContent.current); textInput.current.clear()}}>
            <FontAwesomeIcon icon={faPaperPlane} style={{ color: '#3498DB' }} size={25}></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const imageThumbnailMessageWidth = 300;
const imageThumbnailMessageHeight = 266;
// const messageInputWidth = "290px";
// const messageInputHeight = "130px";


const ChatMessageBox: React.FC<Message> = (message) => {
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );
  const [toggle, setToggle] = useState<boolean>(false);
  const imgDisplay = useRef<JSX.Element>(<View></View>);

  const longTextHandle = (text: string) => {
    const maxCharacter = 25;
    let content = text.substr(0, text.lastIndexOf('.') - 1);
    let extension = text.substr(text.lastIndexOf('.') + 1, text.length - 1);

    if (content.length >= maxCharacter) {
      return content.substring(0, maxCharacter - 1) + "..." + `[${extension}]`;
    }
    return text;
  };

  const renderOnContent = () => {
    if (message.fileContentType == CONTENT_NONE) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text style={{ color: "#000000",fontSize:20}}>{message.textContent}</Text>
        </View>
      );
    } 
    else if (message.fileContentType == CONTENT_IMAGE) {
      return (
        <View>
          <Image source={{ width: imageThumbnailMessageWidth, height: imageThumbnailMessageHeight, 
            uri: `${CDN_SERVER_PREFIX}${message.fileContent}?width=${imageThumbnailMessageWidth}&height=${imageThumbnailMessageHeight}` }}>
          </Image>
        </View>
      );
    } else if (message.fileContentType == CONTENT_FILE) {
      return (
        <View >
          <View style={{ flexDirection: "row" }}>
            <FontAwesomeIcon icon={faFileArchive} style={{ color: '#ffffff' }} size={15}></FontAwesomeIcon>
            <Text>{longTextHandle(message.textContent)}</Text>
          </View>
        </View>
      )
    } else if (message.fileContentType == CONTENT_GIF) {
      return (
        <View>
          <Image source={{
            width: imageThumbnailMessageWidth,
            height: imageThumbnailMessageHeight,
            uri: `https://media.giphy.com/media/${message.fileContent}/giphy.gif`
          }} />

        </View>
      )
    }
    else return (<View></View>)
  }

  if (message.senderId == accountState.id) {
    return (
      <View style={styles.messageFromMe}>
        {renderOnContent()}
      </View>
    );
  } else {
    return (
      <View style={styles.messageFromOther}>
        {renderOnContent()}
      </View>
    );
  }
};
