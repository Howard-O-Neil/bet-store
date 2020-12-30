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
  SORT_BY_PRICE,
  SORT_BY_ALPHABET,
  FILTER_BY_VALUE,
  LOAD_NEW_PAGE,
  LOAD_EXACT_PAGE,
  LOAD_DATA_INTO_FILTER,
  SHUFFLE_PRODUCT,
} from "../constants/productConstants";

import { uploadImage } from "../actions/imageActions";
import { param } from "jquery";

export const listProducts = ({ body = "", countPerPage }) => async (
  dispatch
) => {
  try {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });

    const { data } = await axios.get("/node/api/products", { params: body });

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
    await dispatch(loadDataIntoFilter({ countPerPage }));
    dispatch(shuffleProduct());
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
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
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

export const sortByPrice = ({ direction }) => async (dispatch, getState) => {
  const { productList: state } = getState();
  let sortedPriceArr =
    direction === "asc"
      ? sortAsc(state.filteredProducts, "price")
      : sortDesc(state.filteredProducts, "price");

  state.filteredProducts = sortedPriceArr;
  state.appliedFilters = addFilterIfNotExists(
    SORT_BY_ALPHABET,
    state.appliedFilters
  );
  state.appliedFilters = removeFilter(SORT_BY_PRICE, state.appliedFilters);
  dispatch({
    type: SORT_BY_PRICE,
    payload: { ...state },
  });
};

export const filterByValue = ({ value }) => async (dispatch, getState) => {
  const { productList: state } = getState();
  let filteredValues = state.products.filter((product) => {
    return (
      product.name.toLowerCase().includes(value) ||
      product.description.toLowerCase().includes(value)
    );
  });

  let appliedFilters = state.appliedFilters;

  if (value) {
    appliedFilters = addFilterIfNotExists(FILTER_BY_VALUE, appliedFilters);

    state.filteredProducts = filteredValues;
    state.filteredCount = state.filteredProducts.length;
    state.filteredPages = Math.ceil(state.filteredCount / state.countPerPage);
  } else {
    appliedFilters = removeFilter(FILTER_BY_VALUE, appliedFilters);

    if (appliedFilters.length === 0) {
      state.filteredProducts = state.products;
      state.filteredCount = state.filteredProducts.length;
      state.filteredPages = Math.ceil(state.filteredCount / state.countPerPage);
    }
  }
  dispatch({
    type: FILTER_BY_VALUE,
    payload: { ...state },
  });
};

export const sortByAlphabet = ({ direction }) => async (dispatch, getState) => {
  const { productList: state } = getState();

  let sortedAlphabetArr =
    direction === "asc"
      ? sortAsc(state.filteredProducts, "name")
      : sortDesc(state.filteredProducts, "name");

  state.filteredProducts = sortedAlphabetArr;
  state.appliedFilters = addFilterIfNotExists(
    SORT_BY_ALPHABET,
    state.appliedFilters
  );
  state.appliedFilters = removeFilter(SORT_BY_ALPHABET, state.appliedFilters);
  dispatch({
    type: SORT_BY_ALPHABET,
    payload: { ...state },
  });
};

export const loadNewPage = ({ page }) => async (dispatch, getState) => {
  const { productList: state } = getState();
  state.currentPage += page;

  let perPage = state.countPerPage; //20 by default

  let nextProducts;
  if (page === 1) {
    //Moving from page 1 to 2 will cause ‘upperCount’ to be 40
    let upperCount = state.currentCount + perPage;
    let lowerCount = state.currentCount; //This hasn’t been changed. It will remain 20.

    state.currentCount += state.countPerPage;
    nextProducts = state.products.slice(lowerCount, upperCount);
  }

  if (page === -1) {
    let upperCount = state.currentCount; //40
    let lowerCount = state.currentCount - perPage; //20

    state.currentCount -= state.countPerPage;
    nextProducts = state.products.slice(
      lowerCount - perPage,
      upperCount - perPage
    );
  }

  state.filteredProducts = nextProducts;

  // Don't use window.history.pushState() here in production
  // It's better to keep redirections predictable
  //window.history.pushState({page: 1}, "title 1", `?page=${loadNewPageState.currentPage}`);
  dispatch({
    type: LOAD_NEW_PAGE,
    payload: { ...state },
  });
};

export const loadExactPage = ({ page }) => async (dispatch, getState) => {
  const { productList: state } = getState();

  let upperCountExact = state.countPerPage * page;
  let lowerCountExact = upperCountExact - state.countPerPage;

  let exactProducts = state.products.slice(lowerCountExact, upperCountExact);
  state.filteredProducts = exactProducts;
  state.currentCount = upperCountExact;
  state.currentPage = page;
  //window.history.pushState({page: 1}, "title 1", `?page=${currentPage}`);

  dispatch({
    type: LOAD_EXACT_PAGE,
    payload: { ...state },
  });
};

export const loadDataIntoFilter = ({ countPerPage = 10 }) => async (
  dispatch,
  getState
) => {
  const { productList: state } = getState();
  const { products } = state;
  let count = state.products.length;

  let totalPages = Math.ceil(count / countPerPage);

  dispatch({
    type: LOAD_DATA_INTO_FILTER,
    payload: {
      ...state,
      appliedFilters: [],
      filteredProducts: products.slice(0, countPerPage),
      currentCount: countPerPage,
      countPerPage,
      totalCount: count,
      currentPage: 1,
      totalPages: totalPages,
      filteredPages: totalPages,
    },
  });
};

export const shuffleProduct = () => async (dispatch, getState) => {
  const { productList: state } = getState();
  const { products } = state;
  const shuffledProducts = products.sort(() => Math.random() - 0.5);
  state.filteredProducts = shuffledProducts;
  dispatch({
    type: SHUFFLE_PRODUCT,
    payload: { ...state },
  });
};

function sortAsc(arr, field) {
  return arr.sort(function (a, b) {
    if (a[field] > b[field]) return 1;

    if (b[field] > a[field]) return -1;

    return 0;
  });
}

function sortDesc(arr, field) {
  return arr.sort(function (a, b) {
    if (a[field] > b[field]) return -1;

    if (b[field] > a[field]) return 1;

    return 0;
  });
}

function addFilterIfNotExists(filter, appliedFilters) {
  let index = appliedFilters.indexOf(filter);
  if (index === -1) appliedFilters.push(filter);

  return appliedFilters;
}

function removeFilter(filter, appliedFilters) {
  let index = appliedFilters.indexOf(filter);
  appliedFilters.splice(index, 1);
  return appliedFilters;
}
