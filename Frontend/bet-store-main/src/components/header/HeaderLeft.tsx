import React, { FunctionComponent, ReactEventHandler } from 'react'
import { Link } from 'react-router-dom';
import '../../styles/Header.scss'

interface Props{
    HandleOffNav: () => void;
}

const HeaderLeft: React.FC<Props> = (props) => {
    
    var HandleOffNav = props.HandleOffNav;
    return (
        <div className= "menu-left-container">
            <div className="menu-left">
                <div className="account-controller">
                    <a className="item-list" href="/login">
                        <p>Đăng nhập</p>
                    </a>
                    <a className = "item-list" href="/signup">
                        <p>Đăng kí</p>
                    </a>
                </div>
                <hr/>
                <div className="account-controller">
                    <Link className="item-list" to="/">
                        <p>Home</p>
                    </Link>
                    <Link className = "item-list" to="/">
                        <p >Danh mục</p>
                    </Link>
                    <Link className = "item-list" to="/">
                        <p>Tin tức</p>
                    </Link>
                    <Link className = "item-list"  to="/">
                        <p>Liên hệ</p>
                    </Link>
                </div>
            </div>
            <div className = "blur-container" onClick = {HandleOffNav}></div>
        </div>
    );
}


export default HeaderLeft;
