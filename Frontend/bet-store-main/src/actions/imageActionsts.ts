import Axios, { AxiosRequestConfig } from "axios";
import { UPLOAD_IMAGE, UPLOAD_IMAGE_FAIL, UPLOAD_IMAGE_SUCCESS } from "../constants/imageConstants";
import { ActionType } from "../types/actionType";

export const UploadImage = (file: File) => async (dispatch: React.Dispatch<ActionType<string>>) => {
    dispatch(UploadImage_Request());
    var data = new FormData();
    data.append('files', file);

    var config: AxiosRequestConfig = {
        method: 'post',
        url: '/cdn/upload',
        data: data
    };

    Axios(config)
        .then(
            res => {
                dispatch(UploadImage_Success(res.data[file.name]));
            }
        )
        .catch(
            err => {
                console.log(err);
                dispatch(UploadImage_Fail(err))
            }
        );
}



const UploadImage_Request = (): ActionType<any> => {
    return {
        type: UPLOAD_IMAGE,
        payload: null,
    }
}


const UploadImage_Success = (link: string): ActionType<any> => {
    return {
        type: UPLOAD_IMAGE_SUCCESS,
        payload: link,
    }
}

const UploadImage_Fail = (err: string): ActionType<any> => {
    return {
        type: UPLOAD_IMAGE_FAIL,
        payload: err,
    }
}
