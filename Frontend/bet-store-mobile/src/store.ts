import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
} from "./reducers/productReducer";
import {
  categoryListReducer,
  categoryDetailsReducer,
} from "./reducers/categoryReducer";
import { editprofileReducer, profileReducer } from "./reducers/profileReducer";
import { accountReducer } from "./reducers/accountReducer";
import { notifyReducer } from "./reducers/notifyReducer";
import {
  transDetailWalletReducer,
  walletReducer,
} from "./reducers/walletReducer";
import { imagesUploadReducer } from "./reducers/imageReducer";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  imageUpload: imagesUploadReducer,
  profile: profileReducer,
  account: accountReducer,
  notify: notifyReducer,
  wallet: walletReducer,
  editprofile: editprofileReducer,
  transDetailWallet: transDetailWalletReducer,
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
