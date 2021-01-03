import * as React from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CDNAPI } from '../../../define';
import { Text, View } from '../../components/Themed';
import { AppState } from '../../store';
import { useState } from 'react';
import { useEffect } from 'react';
import { SvgUri } from 'react-native-svg';
import { Profile } from '../../types/profile';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ChangeAvatar, EditProfile } from '../../actions/profileAction';
import { showMessage } from 'react-native-flash-message';
import * as Permissions from 'expo-permissions';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const profile = useSelector((state: AppState) => state.profile)
  const [IsAvatarSVG, setIsAvatarSVG] = useState<Boolean>(false);
  const [BoxSelectAvatar, setBoxSelectAvatar] = useState(false);
  const [ModeEdit, setModeEdit] = useState(false);
  const [profileInfo, setprofileInfo] = useState<Profile>({ avatar: "", name: "", sex: "", surname: "", tel: "", username: "" });
  const editprofile = useSelector((state:AppState) => state.editprofile)
  const [editingProfile, seteditingProfile] = useState(false);

  useEffect(() => {
    if (profile.IsFetching == false && profile.Payload.avatar != "") {
      if (profile.Payload.avatar.slice(-4) === ".svg")
        setIsAvatarSVG(true);
    }
    if (profile.IsFetching == false) {
      setprofileInfo(profile.Payload);
    }
  }, [profile.IsFetching,dispatch, profile])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.log("Khoong truy cap dc")
        }
      }
    })();
  }, []);
  
  const HandleCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // let result = await ImagePicker.launchCameraAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   quality: 1,
    //   aspect: [1, 1]
    // });
    console.log("hihi")

    if (result.cancelled)
      return

    let localUri = result.uri;
    let filename = localUri.split('/').pop();
    if (filename == undefined)
      return;
    let match = /\.(\w+)$/.exec(filename == undefined ? "" : filename);
    let type = match ? `image/${match[1]}` : `image`;

    let query = {
      uri: localUri, name: filename, type
    }
    dispatch(ChangeAvatar(query));
    setBoxSelectAvatar(false)
  };

  const HandleLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1]
    });

    if (result.cancelled)
      return

    let localUri = result.uri;
    let filename = localUri.split('/').pop();
    if (filename == undefined)
      return;
    let match = /\.(\w+)$/.exec(filename == undefined ? "" : filename);
    let type = match ? `image/${match[1]}` : `image`;

    let query = {
      uri: localUri, name: filename, type
    }
    dispatch(ChangeAvatar(query));
    setBoxSelectAvatar(false)
  };

  const ChangeEditMode = () => {
    setModeEdit(true);
  }

  const HandleSaveProfile =()=>{
    seteditingProfile(true)
    dispatch(EditProfile(profileInfo));
  }

  useEffect(() => {
    if(!editingProfile) return
    if(editprofile.IsFetching == false)
    { 
      seteditingProfile(false);
      console.log(editprofile)
      if(editprofile.Error!=null&&editprofile.Error!=""){
        showMessage({
          message: editprofile.Error,
          type: "danger",
          icon: "danger",
        });
      } else {
        showMessage({
          message: "Sửa đổi tài khoản thành công",
          type: "success",
          icon: "success",
        });
      }
    }
  }, [dispatch,editprofile.IsFetching])



  return (
    <View style={{ backgroundColor: 'transparent', flex: 1 }}>
      {BoxSelectAvatar && <View style={styles.BoxSelect}>

        <TouchableOpacity style={{
          height: Dimensions.get("window").height,
        }}
          onPress={() => setBoxSelectAvatar(false)}
        >
          <View style={{ opacity: .5, backgroundColor: 'grey', flex: 1 }}></View>
        </TouchableOpacity>

        <View
          style={{ justifyContent: 'center', position: 'absolute', alignSelf: 'center', borderRadius: 10, overflow: 'hidden', borderColor: 'grey', borderWidth: 1 }}>
          <TouchableOpacity onPress={HandleCamera} >
            <View style={{ alignItems: 'center', flexDirection: 'row', padding: 10, alignSelf: 'center', width: 250, backgroundColor: 'white', }}>
              <Ionicons style={{ fontSize: 24, marginRight: 6 }} name="camera" color="#d35400" />
              <Text style={{ fontSize: 24 }}>Chụp ảnh</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={HandleLibrary} >
            <View style={{ alignItems: 'center', flexDirection: 'row', padding: 10, alignSelf: 'center', borderColor: 'grey', width: 250, borderTopWidth: 1, backgroundColor: 'white', }}>
              <Ionicons style={{ fontSize: 24, marginRight: 6 }} name="library" color="#d35400" />
              <Text style={{ fontSize: 24 }}>Lấy từ thư viện</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
      }

      <View style={styles.ContainerImg}>
        <View style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          margin: 10,
          //backgroundColor:'red',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#ededed',
          //backgroundColor: '#989898'
        }}>
          {
            IsAvatarSVG === false ?
              <Image
                style={styles.AvatarImg}
                width={150}
                height={150}
                source={{ uri: `${CDNAPI}/cdn/${profile.Payload.avatar}` }}
              /> :
              <SvgUri
                width={150}
                height={150}
                uri={`${CDNAPI}/cdn/${profile.Payload.avatar}`}
              >

              </SvgUri>

          }
        </View>
        <TouchableOpacity onPress={() => setBoxSelectAvatar(true)}>
          <Text style={{ color: '#0d96f6', fontSize: 12, marginTop: 3 }}>Thay đổi ảnh đại diện</Text>
        </TouchableOpacity>
        <Text style={styles.TitleName}>{profile.Payload.name} {profile.Payload.surname}</Text>
        <Text>@{profile.Payload.username}</Text>
      </View>

      <ScrollView>

        <View style={{ alignItems: 'center', margin: 3, marginHorizontal: 10, paddingTop: 16, paddingHorizontal: 10, zIndex: 10 }}>

          <View style={styles.RowTable}>
            <Text style={styles.TitleLable}>Họ</Text>
            {
              ModeEdit
                ? <TextInput style={[styles.DetailLabel, { borderBottomWidth: 1, padding: 0, borderColor: 'grey' }]} value={profileInfo.surname} onChangeText={(val) => setprofileInfo({ ...profileInfo, surname: val })}></TextInput>
                : <Text style={styles.DetailLabel}>{profileInfo.surname}</Text>
            }
          </View>

          <View style={styles.RowTable}>
            <Text style={styles.TitleLable}>Tên</Text>
            {
              ModeEdit
                ? <TextInput style={[styles.DetailLabel, { borderBottomWidth: 1, padding: 0, borderColor: 'grey' }]} value={profileInfo.name} onChangeText={(val) => setprofileInfo({ ...profileInfo, name: val })}></TextInput>
                : <Text style={styles.DetailLabel}>{profileInfo.name}</Text>
            }
          </View>


          <View style={styles.RowTable}>
            <Text style={styles.TitleLable}>Số điện thoại</Text>
            {
              ModeEdit
                ? <TextInput keyboardType="numeric" style={[styles.DetailLabel, { borderBottomWidth: 1, padding: 0, borderColor: 'grey' }]} value={profileInfo.tel} onChangeText={(val) => setprofileInfo({ ...profileInfo, tel: val })}></TextInput>
                : <Text style={styles.DetailLabel}>{profileInfo.tel}</Text>
            }
          </View>

          <View style={styles.RowTable}>
            <Text style={styles.TitleLable}>Giới tính</Text>
            {
              ModeEdit
                ? <DropDownPicker
                  items={[
                    { label: 'Nữ', value: 'woman', icon: () => <Ionicons name="woman" size={18} color="#6ab04c" /> },
                    { label: 'Nam', value: 'men', icon: () => <Ionicons name="man" size={18} color="#6ab04c" /> },
                    { label: 'Giới tính khác', value: 'other', icon: () => <FontAwesome5 name="robot" size={18} color="#6ab04c" /> },
                  ]}
                  style={{
                    height: 32,
                    width: 165,
                    zIndex: 1,
                    flex: 1,
                    borderBottomWidth: 1,
                    position: 'relative',
                  }}
                  defaultValue={profileInfo.sex}
                  onChangeItem={(item) => {
                    //console.log(item.value);
                    setprofileInfo({ ...profileInfo, sex: item.value })
                  }}
                  dropDownStyle={{ position: 'relative', width: 165, zIndex: 1, transform: [{ translateY: -30 }] }}
                />
                : <Text style={styles.DetailLabel}>{profileInfo.sex == 'woman' ? 'Nữ' : profile.Payload.sex == 'men' ? 'Nam' : profile.Payload.sex == 'other' ? 'Chưa xác định' : 'Chưa cập nhật giới tính'}</Text>
            }
          </View>
        </View>
        <View style={{ alignItems: 'center', backgroundColor: 'transparent', zIndex: -1 }}>
          {!ModeEdit
            ? <TouchableOpacity style={{ padding: 10 }} activeOpacity={.9} onPress={ChangeEditMode}>
              <Text style={styles.EditTitle}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>
            : <View style ={{backgroundColor:'transparent', flexDirection:'row'}}>
                <TouchableOpacity style={{ padding: 10, justifyContent:'center'}} activeOpacity={.9} onPress={()=>{setprofileInfo(profile.Payload);setModeEdit(false); }}>
                  <Feather name="x-circle" style={[styles.EditTitle,{paddingHorizontal:0,fontSize:25, paddingVertical:0},]} ></Feather>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, flexDirection:'row' }} activeOpacity={.9} onPress={HandleSaveProfile}>
                  {editingProfile&& <ActivityIndicator size="small" color="black"  /> }
                  <Text style={styles.EditTitle}> Lưu thông tin</Text>
                </TouchableOpacity>

              </View>
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ContainerImg: {
    alignItems: 'center',
    margin: 10,
    padding: 10
  },
  AvatarImg: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  TitleName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
  },
  RowInfo: {
    paddingBottom: 10,
    paddingTop: 10
  },
  TableStyle: {
    width: 300,
    //backgroundColor:'red'
  },
  BoxSelect: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 5,
    backgroundColor: 'transparent'
    //backgroundColor:'yellow',

  },
  EditTitle: {
    padding: 10, backgroundColor: 'white', paddingHorizontal: 30, borderRadius: 30, shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,

  },
  RowTable: {
    flexDirection: "row",
    paddingHorizontal: 40,
    paddingBottom: 16,
    width: '100%'
  },
  TitleLable: {
    width: '40%',
    fontSize: 16, fontWeight: '500',
    marginTop: 4
  },
  DetailLabel: {
    width: '60%',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
