import React, { useEffect } from "react";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import "../../styles/Header.scss";
import HeaderLeft from "./HeaderLeft";
import { AppState } from "../../store";
import { GetProfile } from "../../actions/profileAction";
import { initProfile } from "../../reducers/profileReducer";
import { Link } from "react-router-dom";
import { Logout, LogoutAccount } from "../../actions/accountAction";
import SearchBox from "../SearchBox";
import { Route } from "react-router-dom";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  //const account = useSelector((state:AppState)=> state.account)

  var [IsLogin, SetIsLogin] = React.useState<boolean>(false);

  const profile = useSelector((state: AppState) => state.profile);
  useEffect(() => {
    dispatch(GetProfile());
  }, [dispatch]);

  useEffect(() => {
    console.log(profile);
    if (profile.Error === null) {
      SetIsLogin(true);
    } else {
      SetIsLogin(false);
    }
  }, [dispatch, profile.IsFetching]);

  var [isLeftNavBar, setLeftNavBar] = React.useState<boolean>(false);

  //const accountStatus = useSelector((state: AppState) => state.account);

  const handleOffNav = () => {
    setLeftNavBar(false);
  };
  const handleOnNavLeft = () => {
    setLeftNavBar(true);
  };

  return (
    <div>
      {isLeftNavBar && (
        <div className="left-header-nav" id="left-header-nav">
          <HeaderLeft HandleOffNav={handleOffNav} />
        </div>
      )}
      <nav className="white-nav-container">
        <div className="btn-nav-left">
          <a href="#" onClick={handleOnNavLeft}>
            <i className="fas fa-caret-square-right"></i>
          </a>
        </div>

        <Link to="/">
          <div className="logo-container">
            <img src="/static/media/logo.png" alt="logo-betstore" />
            <h2>BetStore</h2>
          </div>
        </Link>
        <Route render={(props) => <SearchBox {...props} />}></Route>

        <div className="buttons">
          <div className="button">
            <button className="noti-btn">
              <i className="fas fa-envelope"></i>
              <h4>Tin nhắn</h4>
            </button>
          </div>

          <div className="button">
            <button className="noti-btn">
              <i className="fas fa-bell"></i>
              <h4>Thông báo</h4>
            </button>
          </div>

          {!IsLogin && (
            <div className="button dropdown-hover">
              <div className=" noti-btn drop-btn">
                <i className="fas fa-user"></i>
                <h4>Tài khoản</h4>
              </div>
              <div className="dropdown-list">
                <a href="/login">
                  <p>Đăng nhập</p>
                </a>
                <a href="/signup">
                  <p>Đăng ký</p>
                </a>
              </div>
            </div>
          )}
          {IsLogin && (
            <div className="button dropdown-hover">
              <div className="noti-btn drop-btn">
                {/* <i className="fas fa-user"></i> */}
                <img
                  src={`/cdn/cdn/${profile.Payload.avatar}`}
                  alt="avatar"
                ></img>
                <h4>{`${profile.Payload.surname} ${profile.Payload.name}`}</h4>
              </div>
              <div className="dropdown-list">
                <Link to="/profile">
                  <p>Tài khoản</p>
                </Link>
                <span onClick={LogoutAccount}>
                  <p>Đăng xuất</p>
                </span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;

// <div className= "page-wrap">
//     <div className = "nav-style">
//         <nav className="navbar navbar-expand-lg navbar-light">
//             <a className="navbar-brand" href="#">Navbar</a>

//             <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//                 <span className="navbar-toggler-icon"/>
//             </button>
//             <div className="collapse navbar-collapse" id="navbarNav">
//                 <ul className="navbar-nav ml-auto">
//                     <li className="nav-item active">
//                         <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link" href="#">Features</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link" href="#">Pricing</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">Disabled</a>
//                     </li>
//                 </ul>
//             </div>
//             {/* <div className = "btn-search">
//                 <a href = "#"><img width='20px' height = '20px' src = {searchicon} alt = "search-icon"/></a>
//             </div> */}
//         </nav>

//     </div>
// </div>
