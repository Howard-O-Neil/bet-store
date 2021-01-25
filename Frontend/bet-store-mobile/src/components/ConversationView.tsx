import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { getConversationThunk, repalceCurrentReceiver, switchToMessage } from "../actions/chatBoxAction";
import { ChatAccountInfo, Conversation, ConversationControl, Message } from "../reducers/chatBoxReducer";
import { CHAT_KEY } from "./ChatView";
import SocketManager from "./SocketManager";
import Axios from 'axios';
import { CONTENT_FILE, CONTENT_GIF, CONTENT_IMAGE, CONTENT_NONE } from "./MessageView";
import { CDNAPI, JavaAPI } from "../../define";
import { SvgUri } from "react-native-svg";


var noAvatarUrl = "../../assets/images/noAvatar.png";

// styles

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 5,
    width: "100%", height: "100%"
  },
  conversationHeader: {
    backgroundColor: '#2980B9',
    padding: 5,
  },
  conversationImg: {
    width: 50, height: 50,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "blue"
  },
  conversationBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5
  }
});

// view

export const ConversationView: React.FC = () => {
  const accountState = useSelector(
    (state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo
  );
  const conversationState = useSelector(
    (state: { conversationControl: ConversationControl }) => state.conversationControl
  );
  const [loadMore, setLoadMore] = useState<boolean>(true);

  const prevConversationCount = useRef<Number>(null);

  const dispatch = useDispatch();

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

  useEffect(() => {
    if (accountState.id == "") return;

    if (prevConversationCount.current == null) {
      prevConversationCount.current = conversationState.conversationList.length;

      if (prevConversationCount.current.valueOf() == 0) {
        setLoadMore(false);
      }
    } else {
      if (prevConversationCount.current.valueOf() == conversationState.conversationList.length) {
        setLoadMore(false);
      }
    }
  }, [conversationState])

  const loadMoreRender = () => {
    if (loadMore) {
      return (
        <TouchableOpacity style={{ height: 30, width: 200, marginTop: 10, backgroundColor: '#34495E', alignItems: 'center' }} 
          onPress={e => {
            getConversationThunk(dispatch, () => null, {
              senderId: accountState.id,
              index: conversationState.requestIndex,
              loadPrev: true,
            });
          }}>
          <Text style={{ color: "#ffffff", textAlignVertical: "center", height: '100%' }}>Load More</Text>
        </TouchableOpacity>
      )
    } else return <View></View>
  }

  const emptyCheckRender = () => {
    if (conversationState.conversationList.length <= 0) {
      return <Text style={{ fontSize: 15, fontWeight: 'normal' }}>Bạn chưa có cuộc hội thoại nào</Text>
    } else return <View></View>
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.conversationHeader}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#FFFFFF' }}>Conversations</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 5 }}>
          <FontAwesomeIcon icon={faSearch} style={{ color: '#FFFFFF' }} size={25}></FontAwesomeIcon>
          <TextInput style={{ marginLeft: 5, backgroundColor: '#F6F6F6', width: '60%', fontSize: 20 }} onChangeText={e => { }}></TextInput>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView>
          {[listConversationHandle()]}
          {loadMoreRender()}
          {emptyCheckRender()}
        </ScrollView>

      </View>

    </View>
  );
}

// component

export const ChatConversationBox: React.FC<Conversation> = (conversation) => {
  const [userInfo, setUserInfo] = useState<ChatAccountInfo>(null);
  const [messageThumpnail, setMessageThumbnail] = useState<string>("Loading...");
  const dispatch = useDispatch();

  const getReceiverInfo = async (): Promise<ChatAccountInfo> => {
    let response = await Axios.get(`${JavaAPI}/api/profile/get?accountid=${conversation.receiverId}`);

    if (response.data.data == null) {
      return {
        id: conversation.receiverId,
        avatar: noAvatarUrl,
        user: `User-${conversation.receiverId.substr(0, 10)}`
      }
    }

    return {
      id: conversation.receiverId,
      avatar: response.data.data.avatar,
      user: response.data.data.username
    }
  }

  const loadThumbnailTextMessage = () => {
    Axios.get(
      `${JavaAPI}/api/message/get?senderid=${conversation.senderId}&receiverid=${conversation.receiverId}&index=${0}`
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
    let fileExtension = userInfo.avatar.split('.').pop();

    if (userInfo.avatar == noAvatarUrl) {
      return <Image
        style={styles.conversationImg}
        source={require("../../assets/images/noAvatar.png")}
      />
    }
    if (fileExtension == 'svg') {
      return (
        <View style={styles.conversationImg}>
          <SvgUri width={50} height={50} uri={`${CDNAPI}/cdn/${userInfo.avatar}`}>
          </SvgUri>
        </View>
      )
    }
    return (<Image
      style={styles.conversationImg}
      source={{
        width: 50, height: 50,
        uri: `${CDNAPI}/cdn/${userInfo.avatar}`
      }}
    />);
  }

  if (userInfo == null) {
    return <View></View>;
  }
  return (
    <View>
      <TouchableOpacity
        style={styles.conversationBox}
        onPress={e => {
          dispatch(repalceCurrentReceiver(conversation.receiverId));
          dispatch(switchToMessage());
        }}>
        {handleAvatar()}
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{userInfo.user}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'normal' }}>{textHandle(messageThumpnail)}</Text>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          <Text style={{ fontSize: 15, fontWeight: 'normal' }}>1 giờ trước</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

};