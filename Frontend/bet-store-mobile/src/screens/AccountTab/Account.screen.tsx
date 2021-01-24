import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Button,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { AccountTabStackParamList } from "../../types";
import { StatusBar } from "expo-status-bar";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { GetProfile } from "../../actions/profileAction";
import { EraseItemInStorage } from "../../components/AsyncStorageUtls";
import { Logout, LogoutAccount } from "../../actions/accountAction";
import { CDNAPI } from "../../../define";
import { InfoWallet } from "../../actions/walletAction";
import Svg, { Ellipse, SvgCssUri, SvgUri } from "react-native-svg";

const WALLET = "wallet";
const PAY = "pay";
const LOGOUT = "logout";
const PROFILE = "profile";
const SUPPORT = "support";
const SALE = "sale";

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<
    StackNavigationProp<AccountTabStackParamList, "Account">
  >();
  const [IsAvatarSVG, setIsAvatarSVG] = useState<Boolean>(false);
  const [Islogin, setIslogin] = useState(false);
  const profile = useSelector((state: AppState) => state.profile);
  const account = useSelector((state: AppState) => state.account);
  const wallet = useSelector((state: AppState) => state.wallet);

  const dispatch = useDispatch();
  useEffect(() => {
    if (account.Payload.IsLogin === true) {
      //console.log(account.Payload);

      dispatch(GetProfile());
      dispatch(InfoWallet());
      //console.log(`${CDNAPI}/cdn/${profile.Payload.avatar}`);
    }
  }, [dispatch, account.Payload.IsLogin]);

  useEffect(() => {
    if (profile.IsFetching == false && profile.Payload.avatar != "") {
      if (profile.Payload.avatar.slice(-4) === ".svg") setIsAvatarSVG(true);
    }
  }, [dispatch, profile.IsFetching]);

  const HandleBTN = (key: string) => {
    switch (key) {
      case LOGOUT:
        dispatch(LogoutAccount());
        break;

      case WALLET:
        navigation.navigate("Wallet");
        break;
      case PAY:
        navigation.navigate("PayWallet");
        break;
      case SALE:
        navigation.navigate("Sale");
        break;
      default:
        break;
    }
  };
  return (
    <View style={{ backgroundColor: "transparent", flex: 1 }}>
      {account.Payload.IsLogin ? (
        <View style={{}}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ flex: 0 }}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={styles.HeaderProfile}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 40,
                  margin: 10,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#ededed",
                  //backgroundColor:'red',
                  //backgroundColor: '#989898'
                }}
              >
                {IsAvatarSVG === false ? (
                  <Image
                    style={styles.AvatarImg}
                    width={64}
                    height={64}
                    source={{ uri: `${CDNAPI}/cdn/${profile.Payload.avatar}` }}
                  />
                ) : (
                  <SvgUri
                    width={64}
                    height={64}
                    uri={`${CDNAPI}/cdn/${profile.Payload.avatar}`}
                  />
                )}
              </View>

              <View style={styles.TitleProfile}>
                <Text style={styles.Name}>
                  {profile.Payload.name} {profile.Payload.surname}
                </Text>
                <Text style={styles.Username}>@{profile.Payload.username}</Text>
              </View>
              <View style={styles.IconTitleContainer}>
                <Ionicons
                  style={styles.IconTitle}
                  name="chevron-forward-outline"
                ></Ionicons>
              </View>
            </View>
          </TouchableOpacity>

          <ScrollView>
            <FlatList
              style={{ marginTop: 10 }}
              data={[
                { key: "Bán hàng", detail: "Quản lý sản phẩm", typeBtn: SALE }, //${wallet.Payload.currentwallet.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}đ
                {
                  key: "Chi tiết ví",
                  detail: `Trong ví của bạn còn ${wallet.Payload.currentwallet
                    .toFixed(0)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}đ`,
                  typeBtn: WALLET,
                },
                { key: "Nạp tiền", detail: `Nạp tiền qua momo`, typeBtn: PAY },
                {
                  key: "Hỗ trợ",
                  detail: `Gặp vấn đề về tài khoản, v.v..`,
                  typeBtn: SUPPORT,
                },
                { key: "Đăng xuất", typeBtn: LOGOUT },
              ]}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    borderColor: "#ecf0f1",
                    borderWidth: 1,
                  }}
                  onPress={() => HandleBTN(item.typeBtn)}
                >
                  <View
                    style={{
                      height: 55,
                      justifyContent: "center",
                      paddingLeft: 20,
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "400" }}>
                      {item.key}
                    </Text>
                    {item.detail && (
                      <Text style={{ opacity: 0.5 }}>{item.detail}</Text>
                    )}
                  </View>
                  <View style={styles.IconTitleContainer}>
                    <Ionicons
                      style={styles.IconItemList}
                      name="chevron-forward-outline"
                    ></Ionicons>
                  </View>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>Để sử dụng bạn cần đăng nhập vào tài khoản</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.BtnAction}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ fontSize: 20, fontWeight: "600", color: "white" }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.BtnAction}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={{ fontSize: 20, fontWeight: "600", color: "white" }}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sttBar: {
    backgroundColor: "red",
  },
  AvatarImg: {
    width: 64,
    height: 64,
    // borderRadius: 40,
    // margin: 10
  },
  HeaderProfile: {
    flexDirection: "row",
  },
  TitleProfile: {
    justifyContent: "center",
    paddingLeft: 8,
  },
  Name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  IconTitleContainer: {
    justifyContent: "center",
    flex: 1,
  },
  IconTitle: {
    textAlign: "right",
    marginRight: 10,
    fontSize: 30,
    opacity: 0.2,
  },
  IconItemList: {
    textAlign: "right",
    marginRight: 10,
    fontSize: 16,
    opacity: 0.2,
  },
  Username: {
    opacity: 0.5,
  },
  BtnAction: {
    borderRadius: 24,
    backgroundColor: "#fa8231",
    width: 160,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
});

export default AccountScreen;
