import Axios from 'axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ConfirmTelAccount, setLoginSuccess, setStateErrorLogin, setStateLogin } from '../actions/accountAction';
import { AddNotify } from '../actions/notifyAction';
import { GetProfile } from '../actions/profileAction';
import { AppState } from '../store';
import "../styles/Login.css"

let regexpTel: RegExp = /(09|01[2|6|8|9])+([0-9]{8})\b/;

interface ProfileEntity {
	name: string,
	surname: string,
}

interface AccountEntity {
	username: string,
	password: string,
	tel: string,
	profile: ProfileEntity,
	key: string
}

const initAccount: AccountEntity = {
	profile: {
		name: "",
		surname: ""
	},
	username: '',
	password: '',
	tel: '',
	key: ''
}

interface AccountAction {
	type: string,
	value: string
}

const Accountreducer: React.Reducer<AccountEntity, AccountAction> = (state, action) => {
	switch (action.type) {
		case "name":
			var temp: ProfileEntity = {
				name: action.value,
				surname: state.profile.surname
			}
			return { ...state, profile: temp }
		case "surname":
			var temp: ProfileEntity = {
				name: state.profile.name,
				surname: action.value
			}
			return { ...state, profile: temp }
		case "username":
			return { ...state, username: action.value }
		case "tel":
			return { ...state, tel: action.value }
		case "password":
			return { ...state, password: action.value }
		case "key":
			return { ...state, key: action.value }

	}
	return { ...state }
}

const Login: React.FC<{ islogin: boolean }> = ({ islogin }) => {

	var [isLogin, changeisLogin] = React.useState<boolean>(true);
	var [isInfoWrong, setisInfoWrong] = React.useState<boolean>(false);
	var [NotiSignup, setNotiSignup] = React.useState<string[]>([]);

	const [isFormConfirmTel, setisFormConfirmTel] = useState(false);
	const [loadingConfirm, setloadingConfirm] = useState(false);
	const confirmTelAccount = useSelector((state: AppState) => state.confirmTelAccount)

	const dispatch = useDispatch();

	React.useEffect(
		() => {
			changeisLogin(islogin);
		}
		, []);

	const transForm = (stateSetter: React.Dispatch<boolean>) => {
		stateSetter(!isLogin);
	}

	var repassword = React.createRef<HTMLInputElement>();

	var [account, setaccount] = React.useReducer<React.Reducer<AccountEntity, AccountAction>>(
		Accountreducer,
		initAccount
	)

	const HandleSignupSubmit = (evt: { preventDefault: () => void; }) => {
		evt.preventDefault();


		//setisFormConfirmTel(true);
		setNotiSignup([]);
		var msgError: string[] = [];

		// if (!regexpTel.test(account.tel)) {
		// 	msgError.push("Định dạng sđt không hợp lệ!!!");
		// }

		if (repassword.current?.value != account.password) {
			msgError.push("Password chưa trùng. Nhập lại!!!");
		}
		if (msgError.length !== 0) {
			setNotiSignup(msgError);
			return;
		}
		setloadingConfirm(true);
		dispatch(ConfirmTelAccount({ tel: account.tel, username: account.username }))



		// axios.post(`/go/api/account/signup`, account)
		// 	.then(
		// 		res => {
		// 			if (res.data["status"] == 200) {
		// 				//alert("Tài khoản được tạo thành công!!!");
		// 				dispatch(AddNotify({ path: "", destination: "Tài khoản được tạo thành công!!!", title: "BetStore" }));
		// 				changeisLogin(true);
		// 			}
		// 			else {
		// 				setNotiSignup(["Username đã tồn tại trên hệ thống"]);
		// 			}
		// 			console.log(res);
		// 			console.log(res.data);
		// 		}
		// 	).catch(
		// 		err => {
		// 			console.log(err);
		// 		}
		// 	);
	}

	useEffect(() => {
		if (confirmTelAccount.IsFetching === false && loadingConfirm === true) {
			if (confirmTelAccount.Error === "")
				dispatch(AddNotify({ path: "", destination: confirmTelAccount.Error, title: "BetStore" }));
			else {
				dispatch(AddNotify({ path: "", destination: "Một mã OTP đã được gửi tới số điện thoại "+ account.tel, title: "BetStore" }));
				setloadingConfirm(false);
				setisFormConfirmTel(true);
			}
		}
	}, [confirmTelAccount.Error, confirmTelAccount.IsFetching, dispatch, loadingConfirm])

	const HandleLoginSubmit = (evt: { preventDefault: () => void }) => {
		evt.preventDefault();
		dispatch(setStateLogin())
		axios.post(`/go/api/account/login`, account)
			.then(
				res => {
					if (res.data["status"] === 200) {
						dispatch(setLoginSuccess(res.data["data"]["token"]))
						//console.log(res.data["data"]["token"]);
						sessionStorage.setItem("token", res.data["data"]["token"]);
						setisInfoWrong(false);

						dispatch(GetProfile());
						window.location.href = "/";
						dispatch(AddNotify({ path: "", destination: "Đăng nhập thành công!!!", title: "BetStore" }));
					} else {
						dispatch(setStateErrorLogin())
						setisInfoWrong(true);
					}
				}
			).catch(
				err => {
					dispatch(setStateErrorLogin())
					console.log(err);
					setisInfoWrong(true);
				}
			);
	}

	const HandleConfirmTel = (evt: React.FormEvent) => {
		evt.preventDefault();

		console.log(account)
		axios.post(`/go/api/account/signup`, account)
			.then(
				res => {
					if (res.data["status"] === 200) {
						//alert("Tài khoản được tạo thành công!!!");
						dispatch(AddNotify({ path: "", destination: "Tài khoản được tạo thành công!!!", title: "BetStore" }));
						changeisLogin(true);
					} else {
						dispatch(AddNotify({ path: "", destination: res.data["message"], title: "BetStore" }));
					}
				}
			).catch(
				err => {
					dispatch(AddNotify({ path: "", destination: err, title: "BetStore" }));
				}
			);
	}

	return (
		<div>
			{isLogin === true && <div className="Login">
				<div className="modal-dialog modal-login">
					<div className="modal-content">
						<Link to="/">
							<h4 className="modal-title">BET Store</h4>
						</Link>
						<div className="modal-body">
							<form onSubmit={HandleLoginSubmit}>
								<div className="form-group">
									<div className="input-group">
										<span className="input-group-addon"><i className="fa fa-user" /></span>
										<input type="text" className="form-control" value={account.username} onChange={(evt) => (setaccount({ type: "username", value: evt.target.value.toString() }))} name="username" placeholder="Username" required />
									</div>
								</div>
								<div className="form-group">
									<div className="input-group">
										<span className="input-group-addon"><i className="fa fa-lock" /></span>
										<input type="password" className="form-control" name="password" placeholder="Password" value={account.password} onChange={(evt) => (setaccount({ type: "password", value: evt.target.value.toString() }))} required />
									</div>
								</div>
								{isInfoWrong === true && <div className="wrong-text-div"><p className="wrong-text">Thông tin đăng nhập chưa chính xác</p></div>}
								<div className="form-group">
									<button type="submit" className="btn btn-primary btn-block btn-lg btn-login">Đăng nhập</button>
								</div>
								<p className="hint-text"><a href="#">Quên mật khẩu?</a></p>
							</form>
						</div>

						<div className="modal-footer">
							<button onClick={() => transForm(changeisLogin)} className="btn btn-primary btn-block btn-ref-signup">Tạo tài khoản mới</button>
						</div>
					</div>
				</div>
			</div>}


			{isLogin === false && <div className="Signup">
				<div className="modal-dialog modal-login">

					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Đăng kí tài khoản <Link to="/"><h4 className="modal-title">BET Store</h4></Link></h4>
						</div>
						<div className="modal-body">
							{
								!isFormConfirmTel
									? <form onSubmit={HandleSignupSubmit}>
										<div className="row form-group ">
											<div className="col input-group ">
												<span className="input-group-addon"><i className="fa fa-user" /></span>
												<input type="text" className="form-control" name="surname" placeholder="Họ" value={account.profile.surname} onChange={(evt) => (setaccount({ type: "surname", value: evt.target.value.toString() }))} required />
											</div>
											<div className="col input-group">
												<span className="input-group-addon"><i className="fa fa-user" /></span>
												<input type="text" className="form-control" name="name" placeholder="Tên" value={account.profile.name} onChange={(evt) => (setaccount({ type: "name", value: evt.target.value.toString() }))} required />
											</div>
										</div>

										<div className="form-group">
											<div className="input-group">
												<span className="input-group-addon"><i className="fa fa-user" /></span>
												<input type="text" className="form-control" name="username" placeholder="Tên người dùng" value={account.username} onChange={(evt) => (setaccount({ type: "username", value: evt.target.value.toString() }))} required />
											</div>
										</div>

										<div className="form-group">
											<div className="input-group">
												<span className="input-group-addon"><i className="fa fa-user" /></span>
												<input type="tel" className="form-control" name="tel" placeholder="Số điện thoại" value={account.tel} onChange={(evt) => (setaccount({ type: "tel", value: evt.target.value.toString() }))} required />
											</div>
										</div>
										<div className="form-group">
											<div className="input-group">
												<span className="input-group-addon"><i className="fa fa-lock" /></span>
												<input type="password" className="form-control" name="password" placeholder="Mật khẩu" value={account.password} onChange={(evt) => (setaccount({ type: "password", value: evt.target.value.toString() }))} required />
											</div>
										</div>
										<div className="form-group">
											<div className="input-group">
												<span className="input-group-addon"><i className="fa fa-lock" /></span>
												<input type="password" ref={repassword} className="form-control" name="repassword" placeholder="Xác nhận mật khẩu" required />
											</div>
										</div>
										<div className="wrong-text-div">
											{
												NotiSignup.map(
													i => {
														return <p className="wrong-text">{i}</p>
													}
												)
											}
										</div>
										<div className="form-group">
											<button type="submit" className="btn btn-primary btn-block btn-lg btn-signup">
												Đăng kí
                                    </button>
											<p className="p-backlogin" >Đã có tài khoản <a href="#" onClick={() => transForm(changeisLogin)}>đăng nhập ngay</a></p>
										</div>
									</form>


									: <form onSubmit={HandleConfirmTel}>
										<p>Một mã xác thực đã được gửi tới số điện thoại của bạn</p>
										<input type="text" placeholder="Mã xác nhận OTP" onChange={(evt) => (setaccount({ type: "key", value: evt.target.value.toString() }))} required />
										<input type="submit" value="Xác nhận" />
									</form>
							}
						</div>
					</div>
				</div>
			</div>}
		</div>
	);
}

export default Login;