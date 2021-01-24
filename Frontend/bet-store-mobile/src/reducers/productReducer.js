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
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  SORT_BY_ALPHABET,
  SORT_BY_PRICE,
  FILTER_BY_PRICE,
  FILTER_BY_VALUE,
  LOAD_NEW_PAGE,
  LOAD_EXACT_PAGE,
  LOAD_DATA_INTO_FILTER,
  SHUFFLE_PRODUCT,
  PRODUCT_LIST_RESET,
  PRODUCT_DELETE_RESET,
} from "../constants/productConstants";

export const productListReducer = (
  state = { products: [], filteredProducts: [], appliedFilters: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_RESET:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case SORT_BY_ALPHABET:
    case SORT_BY_PRICE:
    case FILTER_BY_PRICE:
    case FILTER_BY_VALUE:
    case LOAD_NEW_PAGE:
    case LOAD_EXACT_PAGE:
    case SHUFFLE_PRODUCT:
    case LOAD_DATA_INTO_FILTER:
      return { ...action.payload };

    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: { image: [], properties: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productFilterReducer = (
  state = {
    filteredProducts: {},
    appliedFilters: {},
  },
  action
) => {
  switch (action.type) {
    case SORT_BY_ALPHABET:
      return {
        ...action.payload,
      };
    case SORT_BY_PRICE:
      return { ...action.payload };
    case FILTER_BY_PRICE:
      return { ...action.payload };
    case FILTER_BY_VALUE:
      return { ...action.payload };
    case LOAD_NEW_PAGE:
      return {
        ...action.payload,
      };
    case LOAD_EXACT_PAGE:
      return { ...action.payload };
    case LOAD_DATA_INTO_FILTER:
      return { ...action.payload };
    default:
      return state;
  }
};
