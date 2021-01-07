import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
import { TransDetailWallet } from '../../types/transDetailWallet';

export default function PayWalletScreen() {
    return (
        <View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    
});
