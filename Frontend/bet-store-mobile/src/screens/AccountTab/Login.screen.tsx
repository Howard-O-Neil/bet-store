import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import Constants from 'expo-constants';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { GolangAPI } from '../../../define';
import { setLoginSuccess, setStateErrorLogin, setStateLogin } from '../../actions/accountAction';
import { GetProfile } from '../../actions/profileAction';
import { GetItemInStorage, SetItemInStorage } from '../../components/AsyncStorageUtls';
import { Text, View } from '../../components/Themed';
import { AppState } from '../../store';
import { AccountTabStackParamList } from '../../types';

interface AccountEntity {
  username: string | undefined,
  password: string | undefined,
}

export default function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<AccountTabStackParamList, "Account">>();
  const dispatch = useDispatch();
  const [username, setusername] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const accountRedux = useSelector((state: AppState) => state.account);
  const [IsLogging, setIsLogging] = useState<boolean>(false);
  const HandleLogin = () => {

    if (username == "") {
      showMessage({
        message: "Chưa nhập username",
        type: "danger",
        icon: "danger",
      });
      return;
    } else if (password == "") {
      showMessage({
        message: "Chưa nhập password",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    let account: AccountEntity = {
      username: username,
      password: password
    }

    setIsLogging(true);
    dispatch(setStateLogin())
    //console.log(Constants.manifest.debuggerHost?.split(`:`).shift()?.concat(`:3000`));
    axios.post(`${GolangAPI}/api/account/login`, account)
      .then(

        res => {
          //console.log(res);
          if (res.data["status"] === 200) {
            dispatch(setLoginSuccess(res.data["data"]["token"]))
            SetItemInStorage("token", res.data["data"]["token"]);

            showMessage({
              message: "Đăng nhập thành công",
              type: "success",
              icon: "success",
            });
            navigation.goBack();
          } else {

            dispatch(setStateErrorLogin());
            showMessage({
              message: "Đăng nhập thất bại",
              type: "danger",
              icon: "danger",
            });
          }
        }
      ).catch(
        err => {
          dispatch(setStateErrorLogin());
          console.log(err);
          showMessage({
            message: "Đăng nhập thất bại",
            description: err,
            type: "danger",
            icon: "danger",
          });
        }
      ).finally(
        () => setIsLogging(false)
      );

  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image source={require('../../../assets/images/logo.jpg')} style={styles.Logo} />
      <View>
        <TextInput value={username} onChangeText={(val) => { setusername(val) }} style={styles.InputStyle} placeholder="Tên đăng nhập" />
        <TextInput value={password} onChangeText={(val) => { setpassword(val) }} style={styles.InputStyle} placeholder="Mật khẩu" secureTextEntry={true} />
        {IsLogging ? <TouchableOpacity activeOpacity={.8} style={[styles.BtnAction, styles.disable]} onPress={HandleLogin} disabled>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 10 }}>Đăng nhập</Text>
        </TouchableOpacity> :
          <TouchableOpacity activeOpacity={.8} style={styles.BtnAction} onPress={HandleLogin} >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Đăng nhập</Text>
          </TouchableOpacity>
        }
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text>
            Chưa có tài khoản?
          </Text>
          <TouchableOpacity onPress={async () => { console.log(await AsyncStorage.getItem("token")); navigation.navigate("Signup") }} >
            <Text style={{ color: '#99c1a4' }} > Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Logo: {
    width: 400,
    height: 200,
  },
  InputStyle: {
    fontSize: 20,
    height: 48,
    width: 300,
    textAlign: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#f2f2f2'
  },
  BtnAction: {
    flexDirection: "row",
    marginTop: 20,
    margin: 10,
    padding: 10,
    height: 48,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#01b241'
  },
  disable: {
    opacity: .5
  }

});
