import axios from "axios";
import { userInfo } from "os";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
} from "../constants/productConstants";

import {
  IMAGE_UPLOAD_REQUEST,
  IMAGE_UPLOAD_SUCCESS,
  IMAGE_UPLOAD_FAIL,
} from "../constants/imageConstants";

import { uploadImage } from "../actions/imageActions";

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });

    const { data } = await axios.get("/node/api/products");

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_DETAILS_REQUEST,
    });

    const { data } = await axios.get(`/node/api/products/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });

    //get user info
    //const {userLogin: {userInfo}} = getState()
    /*const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };*/
    //
    await axios.delete(`/node/api/products/${id}`);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProduct = (product, imagesToUpload) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });

    await dispatch(uploadImage(imagesToUpload));

    const {
      imageUpload: { images },
    } = getState();

    Object.entries(images).map((filename) => {
      product.image.push({
        link: filename[1],
        alt: filename[0],
      });
    });

    //get user info
    //const {userLogin: {userInfo}} = getState()
    /*const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };*/
    //
    const { data } = await axios.post(`/node/api/products/`, product);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProduct = (id, product, imagesToUpload) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });

    await dispatch(uploadImage(imagesToUpload));

    const {
      imageUpload: { images },
    } = getState();

    Object.entries(images).map((filename) => {
      product.image.push({
        link: filename[1],
        alt: filename[0],
      });
    });

    //get user info
    //const {userLogin: {userInfo}} = getState()
    /*const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };*/
    //
    //const { data } = await axios.put(`/node/api/products/${id}`, product);

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      //payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
