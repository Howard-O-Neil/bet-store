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
import { NodeAPI } from "../../define";
import { uploadImage } from "../actions/imageActions";

export const listCategories = (body = "") => async (dispatch) => {
  try {
    dispatch({
      type: CATEGORY_LIST_REQUEST,
    });
    const { data } = await axios.get(`${NodeAPI}/api/categories`, {
      params: body,
    });

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

export const updateCategory = (id, category, catImg, propertyImages) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: CATEGORY_UPDATE_REQUEST,
    });
    const changedCatImage = catImg.get("files") ? true : false;
    console.log(category);
    if (changedCatImage || (propertyImages && propertyImages.length)) {
      if (propertyImages && propertyImages.length) {
        for (var x = 0; x < propertyImages.length; x++) {
          if (propertyImages[x])
            catImg.append("files", propertyImages[x], propertyImages[x].name);
        }
      }
      await dispatch(uploadImage(catImg));

      const {
        imageUpload: { images },
      } = getState();

      if (changedCatImage && propertyImages && propertyImages.length) {
        const catImage = images.splice(0, 1);
        category.image = { link: catImage[0][1], alt: catImage[0][0] };
      } else if (changedCatImage) {
        const catImage = Object.entries(images);
        console.log(Object.entries(images));
        category.image = { link: catImage[0][1], alt: catImage[0][0] };
      }

      if (propertyImages && propertyImages.length) {
        Object.entries(images).map((image) => {
          propertyImages.map((propImage, index) => {
            if (propImage && image[0] === propImage.name) {
              category.properties[index].image = {
                link: image[1],
                alt: image[0],
              };
            }
          });
        });
      }
    }

    console.log(category);
    //get user info
    //const {userLogin: {userInfo}} = getState()
    /*const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };*/
    //
    const { data } = await axios.put(`/node/api/categories/${id}`, category);

    dispatch({
      type: CATEGORY_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: CATEGORY_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
