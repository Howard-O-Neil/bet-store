import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
} from "./reducers/productReducer";
import {
  categoryListReducer,
  categoryDetailsReducer,
  categoryCreateReducer,
  categoryUpdateReducer,
} from "./reducers/categoryReducer";
import { profileReducer } from "./reducers/profileReducer";
import { accountReducer, confirmTelAccount } from "./reducers/accountReducer";
import { notifyReducer } from "./reducers/notifyReducer";
import { walletReducer } from "./reducers/walletReducer";
import { imagesUploadReducer } from "./reducers/imageReducer";
import { addsliderReducer, editSliderReducer, getsliderReducer, removeSliderReducer } from "./reducers/sliderReducer";
import { uploadImageReducer } from "./reducers/imageReducerts";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productCreateReducer,
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categoryCreate: categoryCreateReducer,
  categoryUpdate: categoryUpdateReducer,
  imageUpload: imagesUploadReducer,
  uploadImage: uploadImageReducer,
  profile:profileReducer,
  account:accountReducer,
  notify:notifyReducer,
  wallet:walletReducer,
  getSlider:getsliderReducer,
  addSlider:addsliderReducer,
  removeSlider:removeSliderReducer,
  editSlider:editSliderReducer,
  confirmTelAccount:confirmTelAccount
});
export type AppState = ReturnType<typeof reducer>;

const initialState = {};

const middleWare = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleWare))
);

export default store;
