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
} from "./reducers/categoryReducer";
import { profileReducer } from "./reducers/profileReducer";
import {accountReducer} from "./reducers/accountReducer"
import { notifyReducer } from "./reducers/notifyReducer";
import { walletReducer } from "./reducers/walletReducer";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  profile:profileReducer,
  account:accountReducer,
  notify:notifyReducer,
  wallet:walletReducer,
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
