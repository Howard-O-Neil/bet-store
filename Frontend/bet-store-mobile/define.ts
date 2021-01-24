import Constants from "expo-constants";
import { Platform } from "react-native";

const HOST_LOCAL_EMU = "http://10.0.3.2";
const HOST_LOCAL = "http://localhost";
const Host_WIFI = "http://192.168.1.135";

export const GolangAPI = `${
  Platform.OS == "web" ? HOST_LOCAL : HOST_LOCAL_EMU
}:8081`;
export const CDNAPI = `${
  Platform.OS == "web" ? HOST_LOCAL : HOST_LOCAL_EMU
}:8082`;
export const JavaAPI = `${HOST_LOCAL}:8085`;
export const NodeAPI = "https://betstore.tk/api/node";
