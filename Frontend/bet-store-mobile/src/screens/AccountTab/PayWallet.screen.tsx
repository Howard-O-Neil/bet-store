import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { DataTable } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { TransDetailWallets } from '../../actions/walletAction';
import { Text, View } from '../../components/Themed';
import { initTransDetailWallet } from '../../reducers/walletReducer';
import { AppState } from '../../store';
import { AccountTabStackParamList } from '../../types';
import { TransDetailWallet } from '../../types/transDetailWallet';

export default function PayWalletScreen() {
    const navigation = useNavigation<StackNavigationProp<AccountTabStackParamList, "Account">>();

    const account = useSelector((state: AppState) => state.profile)
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.Info}>
                Để nạp tiền qua momo bạn vui lòng chuyển tiền tới tài khoản momo theo cú pháp
            </Text>
            <View style={styles.ViewPayInfo}>
                <Text style={styles.Texttitle}>
                    Tên tài khoản
                </Text>
                <Text style={styles.content}>
                    Đoàn Công Minh
                </Text>
                <Text style={styles.Texttitle}>
                    Số tài khoản momo
                </Text>
                <Text style={styles.content}>
                    0979.647.421
                </Text>
                <Text style={styles.Texttitle}>
                    Nội dung chuyển khoản
                </Text>
                <Text style={styles.content}>
                    {account.Payload.username}
                </Text>
            </View>
            
            <View  style = {{display:'flex', alignItems:'center'}}>
                <TouchableOpacity activeOpacity={.7} style={styles.BtnAction} onPress={async () => { navigation.replace("Wallet") }} >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}> Kiểm tra giao dịch</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ViewPayInfo: {
        backgroundColor: '#f5f6fa',
        margin: 20,
        padding: 20,
        borderRadius: 5
    },
    Texttitle: {

    },
    content: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10
    },
    Info: {
        margin: 20
    },
    BtnAction: {
      margin: 'auto',
      padding: 10,
      height: 36,
      width: 250,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#487eb0',
      borderRadius:300
    },

});
