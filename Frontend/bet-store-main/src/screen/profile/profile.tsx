import React from "react";

import styles from "../../styles/Profile.module.scss";
import InfoProfile from "./InfoProfile";
import { NavLeft } from "./NavLeft";

const INFORMATION_SCENE = "Information"
const WALLET_SCENE = "Wallet"
const STOREMANAGER_SCENE = "StoreManager"
const SUPPORT_SCENE = "Support"

export default function Profile() {

    const [scene, setScene] = React.useState<string>(INFORMATION_SCENE);

    const OnInputRation =(value:string):void=>{
        setScene(value);
    }

    return (
        <div className = {styles.ProfileContainer}>
            <div className = {"container " + styles.Profile}>
                <div className = {styles.NavLeftContainer}>
                    <NavLeft OnInputRation = {OnInputRation}></NavLeft>
                </div>
                <div className = {styles.InfoProfileContainer}>
                    {scene === INFORMATION_SCENE && <InfoProfile/> }
                    {scene === WALLET_SCENE && <div></div>}
                    {scene === STOREMANAGER_SCENE && <div></div>}
                    {scene === SUPPORT_SCENE && <div></div>}                    
                </div>
            </div>
            
        </div>
    );
}
