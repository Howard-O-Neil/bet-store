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

const MaxItemPage = 5;

interface RowTransDetail {
    index: number,
    time: string,
    partnerName: string,
    amount: string
}


export default function WalletScreen() {
    const transDetailWallet = useSelector((state: AppState) => state.transDetailWallet)
    const wallet = useSelector((state: AppState) => state.wallet)
    const [IsLoadTransDetail, setIsLoadTransDetail] = useState(true);
    const [transDetail, settransDetail] = useState<RowTransDetail[]>([]);
    const [page, setPage] = React.useState(0);
    const [pages, setPages] = React.useState(0);
    const dispatch = useDispatch();
    const navigation = useNavigation<StackNavigationProp<AccountTabStackParamList, "Account">>()
    useEffect(() => {
        dispatch(TransDetailWallets());
    }, [])

    useEffect(() => {
        if (transDetailWallet.IsFetching == false && transDetailWallet.Error == '' && transDetailWallet.Payload != undefined) {
            let rows: RowTransDetail[] = [];
            for (let i = transDetailWallet.Payload.length - 1; i >= 0; i--) {
                const element = transDetailWallet.Payload[i];
                //let d = new Date(element.ackTime * 1000);
                //     let date = element.ackTime//`${d.getDay() + 1}/${d.getMonth() + 1}/${d.getFullYear()}`
                console.log(element.ackTime)
                rows.push({ index: i + 1, amount: element.amount, time: element.ackTime, partnerName: element.partnerName })
            }
            settransDetail(rows);
            if (rows.length % MaxItemPage != 0) {
                setPages(Math.floor(rows.length / MaxItemPage) + 1);
            } else {
                console.log(Math.floor(rows.length / MaxItemPage));
                setPages(Math.floor(rows.length / MaxItemPage));
            }

            setIsLoadTransDetail(false);
        }
        else {
            setIsLoadTransDetail(true);
        }
    }, [dispatch, transDetailWallet.Payload, transDetailWallet.IsFetching])

    return (
        <View style={styles.Container}>
            <ScrollView>
                <View style={styles.BoxGeneral}>
                    <Text style={styles.Title}>Tổng quan</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.BoxCurrentWallet}>
                            <Ionicons name="wallet" style={styles.IconGeneral} />
                            <View >
                                <Text>{wallet.Payload.currentwallet.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}đ</Text>
                                <Text>Số dư ví</Text>
                            </View>
                        </View>
                        <View style={styles.BoxCurrentWallet} >
                            <FontAwesome name="bank" style={styles.IconGeneral} />
                            <View>
                                <Text>{wallet.Payload.sumpaid.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}đ</Text>
                                <Text>Tổng số tiền đã nạp</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.BoxGeneral}>
                    <Text style={[styles.Title, { marginBottom: 0 }]}>Giao dịch nạp tiền</Text>
                    {
                        IsLoadTransDetail
                            ? <ActivityIndicator size="large" color="#0000ff" />
                            : transDetail.length == 0
                                ? <View style={{ alignItems: 'center', margin: 20 }}>
                                    <Text>Bạn chưa có giao dịch nạp tiền</Text>
                                    <TouchableOpacity activeOpacity={.7} style={{ backgroundColor: '#ff793f', padding: 8, margin: 10, borderRadius: 10 }} onPress={() => navigation.replace('PayWallet')}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                            Nạp tiền ngay
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                : <DataTable style={{padding:0, margin: 0}}>
                                    <DataTable.Header>
                                        <DataTable.Title style={{ flex: 0.4 }}>    </DataTable.Title>
                                        <DataTable.Title style={{ flex: 1.5 }} numberOfLines={2}>Thời gian</DataTable.Title>
                                        <DataTable.Title style={{ flex: 2 }} numberOfLines={2}>Người nạp</DataTable.Title>
                                        <DataTable.Title style={{ flex: 1 }}>Số tiền (đ)</DataTable.Title>
                                    </DataTable.Header>
                                    {transDetail.map(
                                        (item, index) => {
                                            if ((index >= page * MaxItemPage && index < (page + 1) * MaxItemPage))
                                                return (
                                                    <DataTable.Row >
                                                        <DataTable.Cell style={{ flex: 0.4}}>
                                                            
                                                            <Text numberOfLines={2} >
                                                            {item.index}
                                                                </Text>
                                                            </DataTable.Cell>
                                                        <DataTable.Cell style={{ flex: 1.5}}>
                                                                <Text numberOfLines={2} style={{flex:1,flexWrap:'wrap', fontSize:10, minHeight:40}}>
                                                                    {item.time}
                                                                </Text>
                                                        </DataTable.Cell>
                                                        <DataTable.Cell style={{ flex: 2 }}>

                                                            <Text style={{ flexWrap: 'wrap', fontSize: 10 }}>
                                                                {item.partnerName}
                                                            </Text>
                                                        </DataTable.Cell>
                                                        <DataTable.Cell style={{ flex: 1 }}>
                                                            <Text style={{ flexWrap: 'wrap', fontSize: 10 }}>
                                                                {Number(item.amount).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                                                            </Text>
                                                        </DataTable.Cell>
                                                    </DataTable.Row>
                                                );
                                        }
                                    )
                                    }

                                    <DataTable.Pagination
                                        page={page}
                                        numberOfPages={pages}
                                        onPageChange={page => {
                                            setPage(page)
                                        }}
                                        label={`${page + 1} of ${pages}`}
                                    />
                                </DataTable>
                    }
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        backgroundColor: 'transparent'
    },
    BoxCurrentWallet: {
        flexDirection: 'row',
        width: '50%',
        alignItems: 'center'
    },
    Title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 2,
        borderBottomWidth: 2,
        borderColor: 'grey',
        marginBottom: 20,
        alignSelf: 'flex-start'
    },
    BoxGeneral: {
        padding: 20,
        margin: 10,
        borderRadius: 5
    },
    IconGeneral: {
        fontSize: 25,
        padding: 5,
        backgroundColor: '#ecf0f1',
        borderRadius: 5,
        marginRight: 10,
        color: '#d35400'
    }
});
