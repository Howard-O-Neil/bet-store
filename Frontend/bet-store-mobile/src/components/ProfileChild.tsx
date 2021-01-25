import { AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { showMessage } from 'react-native-flash-message';
import { SvgUri } from 'react-native-svg';
import { CDNAPI, GolangAPI } from '../../define';
import { Profile } from '../types/profile';
import { ReponseAPI } from '../types/ReponseAPI';
import { WalletInfoType } from '../types/walletInfoType';

const initProfile: Profile = {
  avatar: "",
  name: "",
  sex: "",
  surname: "",
  tel: "",
  username: ""
}

const ChildProfile: React.FC<{ idProfile: String }> = ({ idProfile }) => {
  const [ProfileOwn, setProfileOwn] = useState<Profile>(initProfile);
  const [IsLoadingProfile, setIsLoadingProfile] = useState(true);
  const [IsAvatarSVG, setIsAvatarSVG] = useState(false);


  const ChatWithSeller = ()=>{
    // Khôi xử lý cái này nhé
    // ID user idProfile 
    showMessage({
      message: "Khôi xử lý cái này nhé",
      type: "success",
      icon: "success",
    });
  }

  useEffect(() => {
    axios.get<ReponseAPI<Profile>>(
      `${GolangAPI}/profile/getinfo/?id=${idProfile}`
    ).then(
      response => {
        if (response.data.status === 200) {
          setProfileOwn(response.data.data)
          if (response.data.data.avatar.slice(-4) === ".svg")
            setIsAvatarSVG(true);
        } else {
          showMessage({
            message: response.data.message,
            type: "danger",
            icon: "danger",
          });
        }
      }
    ).catch(
      err => {
        console.log("vdfvdfvdfvdfv")
        showMessage({
          message: "Lỗi kết nối",
          type: "danger",
          icon: "danger",
        });
      }
    ).finally(
      () => {
        setIsLoadingProfile(false)
      }
    )
  }, [])

  return (
    <View style={styles.Container}>
      {
        IsLoadingProfile
          ? <View>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
          :

          <TouchableOpacity
            activeOpacity={0.8}
            style={{ flex: 0 }}
            onPress={ChatWithSeller}
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
                    source={{ uri: `${CDNAPI}/cdn/${ProfileOwn.avatar}` }}
                  />
                ) : (
                    <SvgUri
                      width={64}
                      height={64}
                      uri={`${CDNAPI}/cdn/${ProfileOwn.avatar}`}
                    />
                  )}
              </View>

              <View style={styles.TitleProfile}>
                <Text style={styles.Name}>
                  {ProfileOwn.name} {ProfileOwn.surname}
                </Text>
                <Text style={styles.Username}>@{ProfileOwn.username}</Text>
              </View>
              <View style={styles.IconTitleContainer}>
                <AntDesign style={styles.IconItemList} name="message1" size={30} color="black" />
                <Text style={styles.BodyItemList}>Liên hệ với người bán</Text>
              </View>
            </View>
          </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
  },
  AvatarImg: {
    width: 64,
    height: 64,
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
    marginRight: 20,
  },
  Username: {
    opacity: 0.5,
  },
  BodyItemList: {
    textAlign: "right",
    marginRight: 20,
    opacity: .5,
    fontSize: 10
  }
});

export default ChildProfile;