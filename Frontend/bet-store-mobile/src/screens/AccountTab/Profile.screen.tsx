import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { CDNAPI } from '../../../define';
import { Text, View } from '../../components/Themed';
import { AppState } from '../../store';
import { Table, Row, Rows } from 'react-native-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import Constants from 'expo-constants'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';


export default function ProfileScreen() {
  const profile = useSelector((state: AppState) => state.profile)
  const [tabledata, settabledata] = useState<string[][]>([[]]);
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

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <View style={styles.ContainerImg}>
        <Image
          style={styles.AvatarImg}
          source={{ uri: `${CDNAPI}/cdn/${profile.Payload.avatar}` }}
        />
        <TouchableOpacity>
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
    textAlign: 'center',
    backgroundColor: 'red'
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
  }
});
