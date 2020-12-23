import React, { createRef, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store';
import styles from "../../styles/Profile.module.scss"
import $ from 'jquery'


type ChildProps = {
    OnInputRation: Function
}

export const NavLeft:React.FC<ChildProps> = ({OnInputRation}) => {
    var inputRadio =  createRef<HTMLUListElement>();
    const dispatch = useDispatch();
    const profile = useSelector((state: AppState) => state.profile)


    const ChangeInputRation = ()=>{
       //console.log($('input[name = "SelectNav"]:checked').val());
       OnInputRation($('input[name = "SelectNav"]:checked').val());
    }

    return (
        <div className={styles.NavLeftContainer}>
            <div className={styles.ProfileNav}>
                <span className = {styles.Avatar}>
                    <img src={"/cdn/cdn/" + profile.Payload.avatar} alt="avatar"></img>
                </span>
                <div className = {styles.Account}>
                    Tài khoản của
                    <strong>
                        {profile.Payload.surname + " " + profile.Payload.name}
                    </strong>
                </div>
            </div>

            <ul className={styles.NavLeft} ref = {inputRadio}>
                <li className={styles.ChildNav}>
                    <label>
                        <input type="radio" name = "SelectNav" value ="Information" className ="SelectNav" onChange = {ChangeInputRation}/>
                        <span className={styles.SpanNav}>
                            <i className="fas fa-user"></i>
                            <span>Thông tin tài khoản</span>
                        </span>
                    </label>
                </li>
                <li className={styles.ChildNav}>

                    <label>
                        <input type="radio" name = "SelectNav" value ="Wallet"  className ="SelectNav" onChange = {ChangeInputRation}/>
                        <span className={styles.SpanNav}>
                            <i className="fas fa-wallet"></i>
                            <span>Ví điện tử</span>
                        </span>
                    </label>

                </li>
                <li className={styles.ChildNav}>
                    <label>
                        <input type="radio" name = "SelectNav" value ="StoreManager"  className ="SelectNav" onChange = {ChangeInputRation}/>
                        <span className={styles.SpanNav}>
                            <i className="fas fa-tasks"></i>
                            <span>Quản lý cửa hàng</span>
                        </span>
                    </label>

                </li>
                <li className={styles.ChildNav}>
                    <label>
                        <input type="radio" name = "SelectNav" value ="Support"  className ="SelectNav" onChange = {ChangeInputRation}/>
                        <span className={styles.SpanNav}>
                            <i className="fas fa-question-circle"></i>
                            <span>Hỗ trợ</span>
                        </span>
                    </label>
                </li>
            </ul>
        </div>
    );
}


