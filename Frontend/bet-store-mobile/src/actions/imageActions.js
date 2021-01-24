import axios from "axios";
import { CDNAPI } from "../../define";
import {
  IMAGE_UPLOAD_REQUEST,
  IMAGE_UPLOAD_SUCCESS,
  IMAGE_UPLOAD_FAIL,
} from "../constants/imageConstants";

export const uploadImage = (images) => async (dispatch, getState) => {
  try {
    dispatch({
      type: IMAGE_UPLOAD_REQUEST,
    });
    var uploadImg = new FormData();
    // console.log(path);
    // fs.createReadStream(path);
    uploadImg.append("files", images);
    //get user info
    //const {userLogin: {userInfo}} = getState()
    /*const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };*/
    //
    const { data } = await axios.post(`${CDNAPI}/upload`, uploadImg);
    console.log(data);
    dispatch({
      type: IMAGE_UPLOAD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: IMAGE_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
