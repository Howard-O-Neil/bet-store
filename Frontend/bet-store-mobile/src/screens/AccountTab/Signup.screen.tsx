import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { Image, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { showMessage } from 'react-native-flash-message';
import { ScrollView } from 'react-native-gesture-handler';
import { GolangAPI } from '../../../define';
import { Text, View } from '../../components/Themed';
import { AccountTabStackParamList } from '../../types';



let regexpTel: RegExp = /84+(7|8|3|9|1[1|2|3|4|5|6|7|8|9])+([0-9]{8})\b/;

interface ProfileEntity {
  name: string,
  surname: string,
  sex: string
}

interface AccountEntity {
  username: string,
  password: string,
  profile: ProfileEntity,
  tel: string,
  key: string,
}

const initAccount: AccountEntity = {
  profile: {
    name: "",
    surname: "",
    sex: "",
  },
  tel: "",
  key: "",
  username: "",
  password: "",
}

export default function SignupScreen() {
  const navigation = useNavigation<StackNavigationProp<AccountTabStackParamList, "Account">>()

  const [AccountSignup, setAccountSignup] = useState<AccountEntity>(initAccount);
  const [RePassword, SetRePassword] = useState<string>("");
  const [AcceptActionSignup, setAcceptActionSignup] = useState<boolean>(false);
  const [IsSigning, setIsSigning] = useState(false);
  const [IsConfirmTel, SetISConfirmTel] = useState(false);
  const CheckAccount = (account: AccountEntity) => {
    switch (true) {
      case account.profile.name === "":
        return {
          invalid: false,
          msg: "Chưa nhập tên"
        }
      case account.profile.surname === "":
        return {
          invalid: false,
          msg: "Chưa nhập họ"
        }
      case !regexpTel.test(account.tel):
      return {
        invalid: false,
        msg: "Số điện thoại phải bao gồm cả mã vùng quốc tế!!!"
      }
      case account.username === "":
        return {
          invalid: false,
          msg: "Chưa nhập tên tài khoản"
        }
      case account.password === "":
        return {
          invalid: false,
          msg: "Chưa nhập mật khẩu"
        }

      case RePassword === "":
        return {
          invalid: false,
          msg: "Chưa xác nhận lại mật khẩu"
        }
      case RePassword != account.password:
        return {
          invalid: false,
          msg: "Password chưa trùng. Nhập lại!!!"
        }

      default:
        return {
          invalid: true,
          msg: ""
        };
    }
  }

  const HandleSignup = () => {
    console.log(AccountSignup);
    let { invalid, msg } = CheckAccount(AccountSignup);
    if (!invalid) {
      setAcceptActionSignup(false);
      showMessage({
        message: msg,
        type: "danger",
        icon: "danger",
      });
    }
    else {
      //SetISConfirmTel(true);
      setAcceptActionSignup(true);
      setIsSigning(true)

      axios.post(`${GolangAPI}/api/account/sendsms`, AccountSignup)
        .then(
          res => {
            // console.log(res.data)
            if (res.data["status"] == 200) {
            showMessage({
              message: "Mã xác nhận đã được gửi đến số điện thoại " + AccountSignup.tel,
              type: 'success',
              icon: 'success',
            });
            SetISConfirmTel(true);
            setIsSigning(false)
            }
            else {
              showMessage({
                message: "Username đã tồn tại",
                type: 'warning',
                icon: 'warning',
              });
              setIsSigning(false)
            }
          }
        ).catch(
          err => {
            setIsSigning(false)
            showMessage({
              message: "Username đã tồn tại hoặc số điện thoai chưa chinh xác",
              type: "danger",
              icon: "danger",
            });
          }
        );
    }
  }


  const HandleSignupConfirm = () => {
    setAcceptActionSignup(true);
    setIsSigning(true)
    //console.log(AccountSignup);
    console.log(AccountSignup)
    axios.post(`${GolangAPI}/api/account/signup`, AccountSignup)
      .then(

        res => {
          if (res.data["status"] == 200) {
            showMessage({
              message: "Tài khoản được tạo thành công!!!",
              type: 'success',
              icon: 'success',
            });
            navigation.replace('Login')
          }
          else {
            showMessage({
              message: "Mã xác thực không chính xác hoặc đã hết hạn!!!",
              type: 'warning',
              icon: 'warning',
            });
            setIsSigning(false)
          }
        }
      ).catch(
        err => {
          showMessage({
            message: err,
            type: "danger",
            icon: "danger",
          });
        }
      );
  }
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {IsConfirmTel == false
        ? <ScrollView style={{ flex: 1 }}>

          <Image source={require('../../../assets/images/logo.jpg')} style={styles.Logo} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TextInput onChangeText={val => setAccountSignup({ ...AccountSignup, profile: { ...AccountSignup.profile, name: val } })} style={styles.InputStyle} placeholder="Tên" />
            <TextInput onChangeText={val => setAccountSignup({ ...AccountSignup, profile: { ...AccountSignup.profile, surname: val } })} style={styles.InputStyle} placeholder="Họ" />
            <TextInput onChangeText={val => setAccountSignup({ ...AccountSignup, tel: val })} style={styles.InputStyle} placeholder="Số điện thoại" />
            <DropDownPicker
              items={[
                { label: 'Nữ', value: 'woman', icon: () => <Ionicons name="woman" size={18} color="#900" /> },
                { label: 'Nam', value: 'men', icon: () => <Ionicons name="man" size={18} color="#900" /> },
                { label: 'Giới tính khác', value: 'other', icon: () => <FontAwesome5 name="robot" size={18} color="#900" /> },
              ]}
              style={{
                height: 44,
                width: 300,
                backgroundColor: '#f2f2f2',
                zIndex: 1,
                flex: 1, borderWidth: 0
              }}
              placeholder="Giới tính"
              itemStyle={{
                borderRadius: 0,
                borderWidth: 0,
                flex: 1
              }}

              placeholderStyle={{
                opacity: 0.1,
                flex: 1
              }}
              labelStyle={{
                fontSize: 20,
                textAlign: 'center',
                flex: 1,
                color: 'grey'
              }}

              dropDownStyle={{ width: 300, zIndex: 10, marginTop: 2 }}

              containerStyle={{
                flex: 1,
              }}
              onChangeItem={(item) => {
                if (["woman", "men", "other"].includes(item.value)) {
                  setAccountSignup({ ...AccountSignup, profile: { ...AccountSignup.profile, sex: item.value } });
                }
              }}
            />
            <TextInput onChangeText={val => setAccountSignup({ ...AccountSignup, username: val })} style={styles.InputStyle} placeholder="Tên đăng nhập" />
            <TextInput onChangeText={val => setAccountSignup({ ...AccountSignup, password: val })} style={styles.InputStyle} placeholder="Mật khẩu" secureTextEntry={true} />
            <TextInput onChangeText={val => SetRePassword(val)} value={RePassword} style={styles.InputStyle} placeholder="Xác nhận mật khẩu" secureTextEntry={true} />
            {/* <TouchableOpacity activeOpacity={.8} style={styles.BtnAction} onPress={HandleSignup}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Đăng ký</Text>
          </TouchableOpacity> */}
            {IsSigning ? <TouchableOpacity activeOpacity={.8} style={[styles.BtnAction, { opacity: .5 }]} onPress={HandleSignup} disabled>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 10 }}>Đăng ký</Text>
            </TouchableOpacity> :
              <TouchableOpacity activeOpacity={.8} style={styles.BtnAction} onPress={HandleSignup} >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Đăng ký</Text>
              </TouchableOpacity>
            }
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text>
                Đã có tài khoản?
              </Text>
              <TouchableOpacity onPress={() => { navigation.replace("Login") }} >
                <Text style={{ color: '#99c1a4' }} > Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>


        </ScrollView>
        : <ScrollView style={{ flex: 1 }}>
          <Image source={require('../../../assets/images/logo.jpg')} style={styles.Logo} />

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ marginBottom: 50 }}>Mã xác nhận đã được gửi tới sđt {AccountSignup.tel} của bạn</Text>
            <TextInput onChangeText={
              val =>
                setAccountSignup({
                  ...AccountSignup,
                  key: val
                })}
              style={styles.InputStyle}
              placeholder="Mã xác nhận" />
            {/* <TouchableOpacity activeOpacity={.8} style={styles.BtnAction} onPress={HandleSignupConfirm} >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Xác nhận</Text>
            </TouchableOpacity> */}

            {IsSigning ? <TouchableOpacity activeOpacity={.8} style={[styles.BtnAction, { opacity: .5 }]} onPress={HandleSignupConfirm} disabled>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 10 }}>Xác nhận</Text>
            </TouchableOpacity> :
              <TouchableOpacity activeOpacity={.8} style={styles.BtnAction} onPress={HandleSignupConfirm} >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Xác nhận</Text>
              </TouchableOpacity>
            }
          </View>
        </ScrollView>
      }
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
    height: 44,
    width: 300,
    textAlign: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#f2f2f2',
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
  }
});
