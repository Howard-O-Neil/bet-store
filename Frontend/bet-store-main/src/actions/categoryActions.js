import axios from "axios";
import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_CREATE_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_UPDATE_REQUEST,
  CATEGORY_UPDATE_FAIL,
  CATEGORY_UPDATE_SUCCESS,
} from "../constants/categoryConstants";

import { uploadImage } from "../actions/imageActions";

export const listCategories = (body = "") => async (dispatch) => {
  try {
    dispatch({
      type: CATEGORY_LIST_REQUEST,
    });
    console.log(body);
    const { data } = await axios.get("/node/api/categories", { params: body });

    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listCategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: CATEGORY_DETAILS_REQUEST,
    });

    const { data } = await axios.get(`/node/api/categories/${id}`);

    dispatch({
      type: CATEGORY_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createCategory = (category, imagesToUpload) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: CATEGORY_CREATE_REQUEST,
    });

    await dispatch(uploadImage(imagesToUpload));

    const {
      imageUpload: { images },
    } = getState();

    const imgArr = Object.entries(images);

    const catImage = imgArr.splice(0, 1);

    category.image = { link: catImage[0][1], alt: catImage[0][0] };

    imgArr.map((img, index) => {
      category.properties[index].image = {
        link: img[1],
        alt: img[0],
      };
    });

    //get user info
    //const {userLogin: {userInfo}} = getState()
    /*const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };*/
    //
    const { data } = await axios.post(`/node/api/categories/`, category);

    dispatch({
      type: CATEGORY_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateCategory = (id, product, imagesToUpload) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: CATEGORY_UPDATE_REQUEST,
    });
    if (imagesToUpload.get("files")) {
      await dispatch(uploadImage(imagesToUpload));

      const {
        imageUpload: { images },
      } = getState();
      console.log(images);
      Object.entries(images).map((filename) => {
        product.image.push({
          link: filename[1],
          alt: filename[0],
        });
      });
    }

    //get user info
    //const {userLogin: {userInfo}} = getState()
    /*const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };*/
    //
    const { data } = await axios.put(`/node/api/products/${id}`, product);

    dispatch({
      type: CATEGORY_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
