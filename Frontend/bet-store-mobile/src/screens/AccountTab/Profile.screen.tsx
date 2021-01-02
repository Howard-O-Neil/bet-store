import * as React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { CDNAPI } from '../../../define';
import { Text, View } from '../../components/Themed';
import { AppState } from '../../store';
import { Table, Row, Rows } from 'react-native-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import Constants from 'expo-constants'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SvgUri } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons';
import { ChangeAvatar } from '../../actions/profileAction';



export default function ProfileScreen() {
  const profile = useSelector((state: AppState) => state.profile)
  const [tabledata, settabledata] = useState<string[][]>([[]]);
  const [IsAvatarSVG, setIsAvatarSVG] = useState<Boolean>(false);
  const [BoxSelectAvatar, setBoxSelectAvatar] = useState(false);
  const widthArray = [150, 150]
  useEffect(() => {
    settabledata(
      [
        ['Họ', profile.Payload.surname],
        ['Tên', profile.Payload.name],
        ['Số điện thoại', profile.Payload.tel],
        ['Giới tính', profile.Payload.sex == 'woman' ? 'Nữ' : profile.Payload.sex == 'man' ? 'Nam' : profile.Payload.sex == 'other' ? 'Chưa xác định' : 'Chưa cập nhật giới tính']
      ]
    )
  }, [profile])

  useEffect(() => {
    if (profile.IsFetching == false && profile.Payload.avatar != "") {
      if (profile.Payload.avatar.slice(-4) === ".svg")
        setIsAvatarSVG(true);
    }
  }, [profile.IsFetching])

  const HandleCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [1, 1]
    });

    if(result.cancelled)
      return

    let localUri = result.uri;
    let filename = localUri.split('/').pop();
    if (filename==undefined)
      return;
    let match = /\.(\w+)$/.exec(filename==undefined?"":filename);
    let type = match ? `image/${match[1]}` : `image`;

    let query = {
      uri: localUri, name: filename, type
    }
    dispatch(ChangeAvatar(query));
  };

  const dispatch = useDispatch();
  const HandleLibrary = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });

    // dispatch(ChangeAvatar(result));
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [1, 1]
    });

    if(result.cancelled)
      return

    let localUri = result.uri;
    let filename = localUri.split('/').pop();
    if (filename==undefined)
      return;
    let match = /\.(\w+)$/.exec(filename==undefined?"":filename);
    let type = match ? `image/${match[1]}` : `image`;

    let query = {
      uri: localUri, name: filename, type
    }
    dispatch(ChangeAvatar(query));
  };

  return (
    <View style={{ backgroundColor: 'transparent', flex: 1 }}>
      {BoxSelectAvatar && <View style={styles.BoxSelect}>
        
        <TouchableOpacity style={{
          height: Dimensions.get("window").height,
          }} 
          onPress = {()=>setBoxSelectAvatar(false)}
          >
          <View style={{ opacity: .5, backgroundColor: 'grey', flex: 1}}></View>
        </TouchableOpacity>

        <View
          style={{ justifyContent: 'center', position: 'absolute', alignSelf: 'center', borderRadius: 10, overflow: 'hidden', borderColor: 'grey', borderWidth: 1 }}>
          <TouchableOpacity onPress = {HandleCamera} >
            <View style={{ alignItems: 'center', flexDirection: 'row', padding: 10, alignSelf: 'center', width: 250, backgroundColor: 'white', }}>
              <Ionicons style={{ fontSize: 24, marginRight: 6 }} name="camera" color="#d35400" />
              <Text style={{ fontSize: 24 }}>Chụp ảnh</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress = {HandleLibrary} >
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
        <TouchableOpacity onPress={()=>setBoxSelectAvatar(true)}>
          <Text style={{ color: '#0d96f6', fontSize: 12, marginTop: 3 }}>Thay đổi ảnh đại diện</Text>
        </TouchableOpacity>
        <Text style={styles.TitleName}>{profile.Payload.name} {profile.Payload.surname}</Text>
        <Text>@{profile.Payload.username}</Text>
      </View>

      <ScrollView>

        <View style={{ alignItems: 'center', margin: 10 }}>
          <Table style={styles.TableStyle}>
            <Rows textStyle={{ fontSize: 16, fontWeight: '500' }} data={tabledata} widthArr={widthArray} style={styles.RowInfo} />
          </Table>

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

  }
});
