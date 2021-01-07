import Axios, { AxiosRequestConfig } from "axios";
import { useDispatch } from "react-redux";
import { CHANGE_AVATAR, CHANGE_AVATAR_FAIL, CHANGE_AVATAR_SUCCESS, CHANGE_PASSWORD, CHANGE_PASSWORD_FAIL, CHANGE_PASSWORD_SUCCESS, EDIT_PROFILE, EDIT_PROFILE_FAIL, EDIT_PROFILE_SUCCESS, GET_PROFILE, GET_PROFILE_FAIL, GET_PROFILE_SUCCESS, REMOVE_PROFILE, SAVE_CHANGE_AVATAR } from "../constants/profileConstants";
import { ActionType } from "../types/actionType";
import { Profile } from "../types/profile";
import { Messenger, ReponseAPI } from "../types/ReponseAPI";
import FormData from 'form-data'
import fs from 'fs'
import { PasswordChangeType } from "../types/passwordchangeType";
import { AddNotify } from "./notifyAction";
import { NotifyType } from "../types/notifyType";



export const GetProfile = () =>async (dispatch: React.Dispatch<ActionType<Profile>>) => {
    dispatch(setStateGetProfile())
    Axios.defaults.headers.common['Authentication'] = 'Bearer ' + sessionStorage.getItem("token")// for all requests
    let response = await Axios.get<ReponseAPI<Profile>>(
        `/go/profile/`
    );
    console.log(response);
    if (response.status === 200) {
        if (response.data.status === 200) {
            dispatch(setProfile(response.data.data));
        }
        else {
            dispatch(setStateErrorProfile(response.data.message))
        }
    } else {
        dispatch(setStateErrorProfile(response.statusText))
    }
}


export const EditProfile = (profile:Profile) =>async (dispatch: React.Dispatch<ActionType<Profile>>) => {
    //console.log(profile);
    dispatch(EditProfileAction())
    //Object.entries(profile).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})

    let response = await Axios.post<ReponseAPI<Profile>>(
        `/go/profile/`,
        profile
    );
    console.log(response);
    if (response.status === 200) {
        if (response.data.status === 200) {
            dispatch(EditProfileAction_SUCCESS(profile));
        }
        else {
            dispatch(EditProfileAction_FAIL())
        }
    } else {
        dispatch(EditProfileAction_FAIL())
    }
}

const EditProfileAction = (): ActionType<Profile> => {
    return {
        type: EDIT_PROFILE,
        payload: null
    }
}

const EditProfileAction_SUCCESS = (profile: Profile): ActionType<Profile> => {
    return {
        type: EDIT_PROFILE_SUCCESS,
        payload: profile
    }
}

const EditProfileAction_FAIL = (): ActionType<Profile> => {
    return {
        type: EDIT_PROFILE_FAIL,
        payload: null
    }
}
const setProfile = (profile: Profile): ActionType<Profile> => {
    return {
        type: GET_PROFILE_SUCCESS,
        payload: profile
    }
}

const setStateGetProfile = (): ActionType<any> => {
    return {
        type: GET_PROFILE,
        payload: null
    }
}

const setStateErrorProfile = (profile: any): ActionType<any> => {
    return {
        type: GET_PROFILE_FAIL,
        payload: profile,
    }
}

export const ProfileRemove = () => {
    const dispatch = useDispatch();
    dispatch({
        type: REMOVE_PROFILE,
        payload: {},
    });
}

export const ChangeAvatar = (file: File) => async (dispatch: React.Dispatch<ActionType<Profile>>) => {
    dispatch(ChangeAvatar_Request());
    var data = new FormData();
    // console.log(path);
    // fs.createReadStream(path);
    data.append('files', file);

    var config: AxiosRequestConfig = {
        method: 'post',
        url: '/cdn/upload',
        // headers: {
        //     ...data.getHeaders()
        // },
        data: data
    };

    Axios(config)
        .then(
            res1 => {
                var data = JSON.stringify({ "avatar": res1.data[file.name] });
                Axios.post<ReponseAPI<string>>(
                    '/go/profile/',
                    data
                ).then(
                    res => {
                        if (res.data.status === 200) {
                            dispatch(ChangeAvatar_Success(res1.data[file.name]))
                            return true;
                        } else {
                            dispatch(ChangeAvatar_Fail(res1.data[file.name]))
                            return false;
                        }
                    }
                ).catch(
                    res => {
                        console.log(res);
                        dispatch(ChangeAvatar_Fail(res.data))
                    }
                )
            }
        )
        .catch(
            res => {
                console.log(res);
                dispatch(ChangeAvatar_Fail(res.data))
            }
        );

}

const ChangeAvatar_Request = (): ActionType<any> => {
    return {
        type: CHANGE_AVATAR,
        payload: null,
    }
}


const ChangeAvatar_Success = (link: string): ActionType<any> => {
    return {
        type: CHANGE_AVATAR_SUCCESS,
        payload: link,
    }
}

const ChangeAvatar_Fail = (err: string): ActionType<any> => {
    return {
        type: CHANGE_AVATAR_FAIL,
        payload: err,
    }
}

export const SaveChangeAvatarBackend = (avatar: string) => (dispatch: React.Dispatch<ActionType<Profile>>) => {
    dispatch(SaveChangeAvatar())
    console.log("teststeste");
    var data = JSON.stringify({ "avatar": avatar });
    Axios.post<ReponseAPI<string>>(
        '/go/profile',
        data
    ).then(
        res => {
            if (res.data.status === 200) {
                dispatch(SaveChangeAvatarSuccess());
                return true;
            } else {
                dispatch(SaveChangeAvatarFail());
                return false;
            }
        }
    ).catch(
        res => {
            console.log(res);
            dispatch(SaveChangeAvatarFail())
        }
    )
}

const SaveChangeAvatar = (): ActionType<any> => {
    return {
        type: SAVE_CHANGE_AVATAR,
        payload: null
    }
}

const SaveChangeAvatarSuccess = (): ActionType<any> => {
    return {
        type: SAVE_CHANGE_AVATAR,
        payload: null
    }
}

const SaveChangeAvatarFail = (): ActionType<any> => {
    return {
        type: SAVE_CHANGE_AVATAR,
        payload: null
    }
}


export const ChangePassword = (pass:PasswordChangeType) => async (dispatch: React.Dispatch<ActionType<Profile>>,
    dispatchnoti: React.Dispatch<ActionType<NotifyType>>) => {
    dispatch(ChangePasswordAction());

    let res = await Axios.post<ReponseAPI<Messenger>>(
        `/go/api/account/password`,
        pass
    )


    if (res.status === 200) {
        if (res.data.status === 200) {
            dispatch(ChangePasswordAction_SUCCESS());
            alert("Password đã được thay đổi");
            //dispatchnoti(AddNotify({ title: "betstore", destination: "Password đã được thay đổi", path: "#" }))
        }
        else {
            dispatch(ChangePasswordAction_FAIL(res.data.message));
            alert(res.data.message);
            //dispatchnoti(AddNotify({ title: "betstore", destination: res.data.message, path: "#" }))
        }
    } else {
        dispatch(ChangePasswordAction_FAIL(res.data.message));
        alert(res.data.message);
        //dispatchnoti(AddNotify({ title: "betstore", destination: res.data.message, path: "#" }))
    }


}


const ChangePasswordAction = (): ActionType<any> => {
    return {
        type: CHANGE_PASSWORD,
        payload: null
    }
}

const ChangePasswordAction_SUCCESS = (): ActionType<any> => {
    return {
        type: CHANGE_PASSWORD_SUCCESS,
        payload: null
    }
}

const ChangePasswordAction_FAIL = (msg:string): ActionType<any> => {
    return {
        type: CHANGE_PASSWORD_FAIL,
        payload: msg
    }
}

