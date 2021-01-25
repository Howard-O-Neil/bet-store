import { IMessage } from "@stomp/stompjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Text } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { JavaAPI, JavaSOCKET as JavaSocket } from "../../define";
import { conversationReceive, getAccountInfoThunk, messageReceive, setSocketInfo } from "../actions/chatBoxAction";
import { ChatAccountInfo, ChatViewControl, CONVERSATION_VIEW, EMPTY_VIEW, MESSAGE_VIEW } from "../reducers/chatBoxReducer";
import { GetItemInStorage } from "./AsyncStorageUtls";
import { ConversationView } from "./ConversationView";
import { MessageView } from "./MessageView";
import SocketManager, { ISocket } from "./SocketManager";

export const CHAT_KEY = "CHAT_BOX";
export const CDN_SERVER_PREFIX = "http://10.0.2.2:8082/cdn/";
export const CHAT_HANDLER = "/chat/handle";

export const ChatView: React.FC = () => {
  const accountState = useSelector((state: { chatAccountInfo: ChatAccountInfo }) => state.chatAccountInfo);
  const view = useSelector((state: { viewControl: ChatViewControl }) => state.viewControl);
  const [intervalId, setIntervalId] = useState<number>(-1);
  
  const accountToken = useRef<string>("");

  const dispatch = useDispatch();
  
  const messageReceiveHandler = (payload: IMessage) => {
    dispatch(messageReceive(JSON.parse(payload.body).data));
  };

  const conversationReceiveHandler = (payload: IMessage) => {
    dispatch(conversationReceive(JSON.parse(payload.body).data));
  };

  const testReceiveHandler = (payload: IMessage) => {
    console.log("socket ======================= \n");
    console.log(payload.body);
    console.log("socket ======================= \n");
  }
  
  const initSocketConnectionString = (): ISocket => {
    return {
      key: CHAT_KEY,
      socketUrl: `${JavaSocket}/chat-socket`,
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
          brocker: `/chat/room/${accountState.id}`,
          receiveHandler: conversationReceiveHandler,
        },
        {
          brocker: '/testChannel',
          receiveHandler: testReceiveHandler
        }
      ],
    };
  };

  useEffect(() => {
    console.log("Java Chat Client");

    setIntervalId(
      setInterval(() => {
        GetItemInStorage("token").then(x => {
          if (x != null) {
            accountToken.current = x;
          }
        });
        
        if (accountToken.current != "") {
          clearInterval(intervalId);
          setIntervalId(null);
        }
      }, 500)
    );
  }, []);

  useEffect(() => {
    if (intervalId == null && accountToken.current != "") {
      getAccountInfoThunk(dispatch, () => null, accountToken.current);
    }
  }, [intervalId])

  useEffect(() => {
    if (accountState.id == "") return;
    dispatch(setSocketInfo(initSocketConnectionString()));
  }, [accountState]);

  const renderView = () => {
    if (view.viewId == CONVERSATION_VIEW) {
      console.log("hello conversaiton");
      return (
        <View style={styles.componentView}>
          <ConversationView></ConversationView>
        </View>
      );
    } else if (view.viewId == MESSAGE_VIEW) {
      return (
        <View style={styles.componentView}>
          <MessageView></MessageView>
        </View>
      );
    } else return (
      <View style={styles.componentView}>
        <Text>Bạn phải đăng nhập trước</Text>
      </View>
    )
  }

  return (
    <View style={styles.mainView}>
      {renderView()}
    </View>
  ) 
}

const styles = StyleSheet.create({
  mainView: {
    flex:1,
    backgroundColor: "#ffffff"
  },
  componentView: {
    flex:1,
  }
});