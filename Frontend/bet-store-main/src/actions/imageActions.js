import axios from "axios";
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

    //get user info
    //const {userLogin: {userInfo}} = getState()
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    //
    const { data } = await axios.post(`/cdn/upload`, images, config);

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
