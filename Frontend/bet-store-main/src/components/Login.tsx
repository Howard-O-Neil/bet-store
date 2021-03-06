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
		// 	msgError.push("?????nh d???ng s??t kh??ng h???p l???!!!");
		// }

		if (repassword.current?.value != account.password) {
			msgError.push("Password ch??a tr??ng. Nh???p l???i!!!");
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
		// 				//alert("T??i kho???n ???????c t???o th??nh c??ng!!!");
		// 				dispatch(AddNotify({ path: "", destination: "T??i kho???n ???????c t???o th??nh c??ng!!!", title: "BetStore" }));
		// 				changeisLogin(true);
		// 			}
		// 			else {
		// 				setNotiSignup(["Username ???? t???n t???i tr??n h??? th???ng"]);
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
			if (confirmTelAccount.Payload === false&&confirmTelAccount.Error === "")
				dispatch(AddNotify({ path: "", destination: confirmTelAccount.Error, title: "BetStore" }));
			else {
				dispatch(AddNotify({ path: "", destination: "M???t m?? OTP ???? ???????c g???i t???i s??? ??i???n tho???i "+ account.tel, title: "BetStore" }));
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
						dispatch(AddNotify({ path: "", destination: "????ng nh???p th??nh c??ng!!!", title: "BetStore" }));
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
						//alert("T??i kho???n ???????c t???o th??nh c??ng!!!");
						dispatch(AddNotify({ path: "", destination: "T??i kho???n ???????c t???o th??nh c??ng!!!", title: "BetStore" }));
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
								{isInfoWrong === true && <div className="wrong-text-div"><p className="wrong-text">Th??ng tin ????ng nh???p ch??a ch??nh x??c</p></div>}
								<div className="form-group">
									<button type="submit" className="btn btn-primary btn-block btn-lg btn-login">????ng nh???p</button>
								</div>
								<p className="hint-text"><a href="#">Qu??n m???t kh???u?</a></p>
							</form>
						</div>

						<div className="modal-footer">
							<button onClick={() => transForm(changeisLogin)} className="btn btn-primary btn-block btn-ref-signup">T???o t??i kho???n m???i</button>
						</div>
					</div>
				</div>
			</div>}


			{isLogin === false && <div className="Signup">
				<div className="modal-dialog modal-login">

					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">????ng k?? t??i kho???n <Link to="/"><h4 className="modal-title">BET Store</h4></Link></h4>
						</div>
						<div className="modal-body">
							{
								!isFormConfirmTel
									? <form onSubmit={HandleSignupSubmit}>
										<div className="row form-group ">
											<div className="col input-group ">
												<span className="input-group-addon"><i className="fa fa-user" /></span>
												<input type="text" className="form-control" name="surname" placeholder="H???" value={account.profile.surname} onChange={(evt) => (setaccount({ type: "surname", value: evt.target.value.toString() }))} required />
											</div>
											<div className="col input-group">
												<span className="input-group-addon"><i className="fa fa-user" /></span>
												<input type="text" className="form-control" name="name" placeholder="T??n" value={account.profile.name} onChange={(evt) => (setaccount({ type: "name", value: evt.target.value.toString() }))} required />
											</div>
										</div>

										<div className="form-group">
											<div className="input-group">
												<span className="input-group-addon"><i className="fa fa-user" /></span>
												<input type="text" className="form-control" name="username" placeholder="T??n ng?????i d??ng" value={account.username} onChange={(evt) => (setaccount({ type: "username", value: evt.target.value.toString() }))} required />
											</div>
										</div>

										<div className="form-group">
											<div className="input-group">
												<span className="input-group-addon"><i className="fa fa-user" /></span>
												<input type="tel" className="form-control" name="tel" placeholder="S??? ??i???n tho???i" value={account.tel} onChange={(evt) => (setaccount({ type: "tel", value: evt.target.value.toString() }))} required />
											</div>
										</div>
										<div className="form-group">
											<div className="input-group">
												<span className="input-group-addon"><i className="fa fa-lock" /></span>
												<input type="password" className="form-control" name="password" placeholder="M???t kh???u" value={account.password} onChange={(evt) => (setaccount({ type: "password", value: evt.target.value.toString() }))} required />
											</div>
										</div>
										<div className="form-group">
											<div className="input-group">
												<span className="input-group-addon"><i className="fa fa-lock" /></span>
												<input type="password" ref={repassword} className="form-control" name="repassword" placeholder="X??c nh???n m???t kh???u" required />
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
												????ng k??
                                    </button>
											<p className="p-backlogin" >???? c?? t??i kho???n <a href="#" onClick={() => transForm(changeisLogin)}>????ng nh???p ngay</a></p>
										</div>
									</form>


									: <form onSubmit={HandleConfirmTel}>
										<p>M???t m?? x??c th???c ???? ???????c g???i t???i s??? ??i???n tho???i c???a b???n</p>
										<input type="text" placeholder="M?? x??c nh???n OTP" onChange={(evt) => (setaccount({ type: "key", value: evt.target.value.toString() }))} required />
										<input type="submit" value="X??c nh???n" />
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