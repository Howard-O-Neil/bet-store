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
        id: "",
        avatar: ChatApiUtils.randomImg(),
        user: "fuck",
      },
      {
        id: "",
        avatar: ChatApiUtils.randomImg(),
        user: "mingkhoi",
      },
      {
        id: "",
        avatar: ChatApiUtils.randomImg(),
        user: "MrSnoop",
      },
      {
        id: "",
        avatar: ChatApiUtils.randomImg(),
        user: "ert",
      }
    );

    let index = Math.floor(Math.random() * userList.length)
    let res = userList[index];
    res.id = id;
    
    return res;
  };
}
