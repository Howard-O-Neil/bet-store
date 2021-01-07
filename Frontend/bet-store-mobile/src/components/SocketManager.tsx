import {CompatClient, IMessage, Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ISocket {
  key: string;
  socketUrl: string;
  brockers: IBrocker[];
}

export interface IBrocker {
  brocker: string;
  receiveHandler: {(message: IMessage): void};
}

class SocketManager {
  private static stompClient: Map<string, CompatClient> = new Map();
  private static clientInfo: Map<String, ISocket> = new Map();

  public static addSocket(key: string, socketInfo: ISocket) {
    if (
      this.clientInfo.get(key) != null &&
      this.clientInfo.get(key)?.socketUrl === socketInfo.socketUrl
    ) {
      return false;
    }

    let _client = SocketManager.stompClient.get(key);
    if (_client != null) {
      _client.onConnect = () => {
        for (let i = 0; i < socketInfo.brockers.length; i++) {
          client.subscribe(
            socketInfo.brockers[i].brocker,
            socketInfo.brockers[i].receiveHandler,
          );
        }
      };
      return true;
    }
    let socket = new SockJS(socketInfo.socketUrl);
    let client = Stomp.over(socket);

    client.onConnect = () => {
      for (let i = 0; i < socketInfo.brockers.length; i++) {
        client.subscribe(
          socketInfo.brockers[i].brocker,
          socketInfo.brockers[i].receiveHandler,
        );
      }
    };
    SocketManager.stompClient.set(key, client);
    SocketManager.clientInfo.set(key, socketInfo);
    return true;
  }

  public static connect(key: string) {
    if (!SocketManager.stompClient.get(key)?.connected) {
      SocketManager.stompClient.get(key)?.activate();
    }
  }

  public static publish(
    key: string,
    data: {destination: string; headers: any; content: string},
  ) {
    SocketManager.stompClient.get(key)?.publish({
      destination: data.destination,
      headers: data.headers,
      body: data.content,
    });
  }
}

export default SocketManager;
