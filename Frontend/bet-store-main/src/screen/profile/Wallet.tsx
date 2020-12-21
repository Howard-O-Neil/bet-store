import React, { createRef, EventHandler, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { InfoWallet } from '../../actions/walletAction';
import { AppState } from '../../store';
import styles from '../../styles/Wallet.module.scss'


interface QRMomoStruct {
    IsCreated:boolean,
    src:string
}

const Wallet: React.FC = () => {

    const wallet = useSelector((state:AppState) => state.wallet)
    const profile = useSelector((state:AppState) => state.profile)

    const [srcQR, setsrcQR] = useState<QRMomoStruct>({IsCreated:false,src:""})

    let refInputMonney = createRef<HTMLInputElement>();

    const HandleCreateMomo = (evt:React.FormEvent):void=>{
        evt.preventDefault();
        //console.log("1234567");
        ////dispatch(InfoWallet());
        let linkStruct = `https://momofree.apimienphi.com/api/QRCode?phone=0979647421&amount=${refInputMonney.current.value}&note=${profile.Payload.username}`;
        setsrcQR({IsCreated:true, src:linkStruct});
    }

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(InfoWallet());
    }, [profile.IsFetching,dispatch])
    return (
        <div className={styles.WalletContainer}>
            <div className={styles.InfoWallet}>
                <div className={styles.Title}>
                    <h4>Báo cáo</h4>
                </div>
                <div className={styles.Body}>
                    <div className={styles.Amount}>
                        <i className="fas fa-wallet"></i>
                        <div>
                            <strong>
                                {wallet.Payload.currentwallet}
                            </strong>
                            Số tiền hiện có
                        </div>
                    </div>
                    <div className={styles.SumAmount}>
                        <i className="fas fa-university"></i>
                        <div>
                            <strong>
                                {wallet.Payload.sumpaid}
                            </strong>
                            Số tiền đã nạp
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.QrWallet}>
                <div className={styles.Title}>
                    <h4>Nạp tiền</h4>
                </div>
                <div className={styles.Body}>
                    <div className = {styles.ChildBodyTitle}>
                        <h5>Nạp qua MoMo</h5>
                        <div className={styles.InfoMomo}>
                            <div className={styles.Row}>
                                <div className={styles.Label}>
                                    <h6>Số điện thoại:</h6>
                                </div>
                                <div className={styles.Value}>
                                    <h6>
                                        <span>0979.647.421</span>
                                    </h6>
                                </div>
                            </div>
                            <div className={styles.Row}>
                                <div className={styles.Label}>
                                    <h6>Tên tài khoản:</h6>
                                </div>
                                <div className={styles.Value}>
                                    <h6>
                                        <span>Đoàn Công Minh</span>
                                    </h6>
                                </div>
                            </div>
                            <div className={styles.Row}>
                                <div className={styles.Label}>
                                    <h6>Nội dung chuyển tiền:</h6>
                                </div>
                                <div className={styles.Value}>
                                    <h6>
                                        <span>{profile.Payload.username}</span>
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h5 >Quét thanh toán qua MoMoQR</h5>
                        { !srcQR.IsCreated && <form onSubmit = {HandleCreateMomo} className={styles.FormMomo} >
                            <input type="number" ref = {refInputMonney} placeholder = "Nhập số tiền muốn nạp"></input>
                            <input type="submit" value = "Create MOMO QR"></input>
                        </form>}
                        { srcQR.IsCreated && <div className={styles.InfoMomo}>
                            <div className={styles.Row}>
                                <div className  = {styles.QRContainer}> 
                                    <img alt= "qrmomo" src = {srcQR.src}></img>                                   
                                </div>
                            </div>
                        </div>}
                    </div>
                    
                </div>
            </div>
        </div >
    );
}

export default Wallet;