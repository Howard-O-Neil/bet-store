import Axios from "axios";
import { ChatAccountInfo } from "../reducers/chatBoxReducer";

export class ChatApiUtils {
  static randomImg = () => {
    let imglist: string[] = [];
    imglist.push(
      `https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/123298988/original/29a3c7b058d28b4bf73172bb8769094a0e8de2e9/illustrate-you-an-anime-avatar-or-icon.png`,
      `https://avatarfiles.alphacoders.com/715/71560.jpg`,
      `https://pbs.twimg.com/profile_images/890664645740175360/ATnwBuw_.jpg`,
      `https://pbs.twimg.com/media/D_btNMQWsAA9mpM.jpg`
    );
    let index = Math.floor(Math.random() * imglist.length);
    return imglist[index];
  };

  static requestUser = (id: string) => {
    let userList: ChatAccountInfo[] = [];
    userList.push(
      {
        id: "5fbc0b21d32481017a769f16",
        avatar: ChatApiUtils.randomImg(),
        user: "fuck",
      },
      {
        id: "5fbd3a3970cb4d0161112b1d",
        avatar: ChatApiUtils.randomImg(),
        user: "mingkhoi",
      },
      {
        id: "5fbd43bb76af190165ad3f21",
        avatar: ChatApiUtils.randomImg(),
        user: "MrSnoop",
      },
      {
        id: "5fbf6df930e7f6015fbdb1a1",
        avatar: ChatApiUtils.randomImg(),
        user: "ert",
      }
    );
    return userList.find(x => x.id === id);
  };
}
