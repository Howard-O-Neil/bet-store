import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View } from '../../components/Themed';
import { AccountTabStackParamList } from '../../types';

export default function SignupScreen() {
  const navigation = useNavigation<StackNavigationProp<AccountTabStackParamList, "Account">>()
  
  //const [AccountSignup, setAccountSignup] = useState<>()
  
  const HandleLogin = () => {

  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <ScrollView style={{flex: 1}}>
        <Image source={require('../../../assets/images/logo.jpg')} style={styles.Logo} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TextInput style={styles.InputStyle} placeholder="Tên" />
          <TextInput style={styles.InputStyle} placeholder="Họ" />
          <TextInput style={styles.InputStyle} placeholder="Số điện thoại" />
          <TextInput style={styles.InputStyle} placeholder="Tên đăng nhập" />
          <TextInput style={styles.InputStyle} placeholder="Mật khẩu" secureTextEntry={true}/>
          <TextInput style={styles.InputStyle} placeholder="Xác nhận mật khẩu"secureTextEntry={true} />
          <TouchableOpacity activeOpacity={.8} style={styles.BtnAction} onPress={HandleLogin}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Đăng nhập</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text>
              Đã có tài khoản?
            </Text>
            <TouchableOpacity onPress={()=>{navigation.replace("Login")}} >
              <Text style={{ color: '#99c1a4' }} > Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: '#f2f2f2'
  },
  BtnAction: {
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
