import React from "react";
import { Redirect, Route, Switch } from "react-router";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
//import Login from './components/Login';
import "../src/resource/font-awesome/css/font-awesome.min.css";
import "../node_modules/popper.js/dist/popper";
import "../node_modules/bootstrap/dist/js/bootstrap";
import "../node_modules/jquery/dist/jquery";
import "./App.css";
import Login from "./components/Login";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./screen/home/home";
import FooterView from "./components/footer/Footer";
import ProductScreen from "./screen/ProductScreen";
import "../src/resource/font-awesome/css/font-awesome.min.css"
import "../node_modules/popper.js/dist/popper"
import "../node_modules/bootstrap/dist/js/bootstrap"
import "../node_modules/jquery/dist/jquery"
import "./App.css"
import Login from './components/Login';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './screen/home/home';
import FooterView from './components/footer/Footer';
import ProductScreen from './screen/ProductScreen';
import AddProductScreen from './screen/AddProductScreen';
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { accountInfoReducer, conversationControlReducer, gifControlReducer, messageControlReducer, socketInfoReducer, viewControlReducer } from "./reducers/chatBoxReducer";
import ProductListScreen from "./screen/ProductListScreen";
import ProductEditScreen from "./screen/ProductEditScreen";
import Profile from "./screen/profile/profile";
import NotifyContainer from "./components/NotifyContainer";
import { useDispatch } from "react-redux";
import CategoryListScreen from "./screen/CategoryListScreen";
import CategoryViewScreen from "./screen/CategoryViewScreen";
import CategoryEditScreen from "./screen/CategoryEditScreen";
import { AdminScreen } from "./screen/AdminScreen";
import { Page404Screen } from "./screen/404Screen";

function App() {
  return (
    <div>
      <BrowserRouter>
        <NotifyContainer />
        <div className="headermain">
          <Header></Header>
        </div>
        <Switch>

          <Route path="/" exact>
            {Home}
          </Route>
          <Route path="/login" exact>
            {" "}
            <Login islogin={true} />
          </Route>
          <Route path="/signup" exact>
            {" "}
            <Login islogin={false} />
          </Route>
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route path="/categoryList" component={CategoryListScreen}></Route>
          <Route path="/profile/product/new" render={(props) => <ProductEditScreen {...props} edit={false} />} />
          <Route path="/profile/product/:id/edit" render={(props) => <ProductEditScreen {...props} edit={true} />} />
          <Route path="/mua-ban/:category" component={CategoryViewScreen} />
          <Route path="/mua-ban" component={CategoryViewScreen}></Route>
          <Route
            path="/category/:id/edit"
            render={(props) => <CategoryEditScreen {...props} edit={true} />}
          ></Route>
          <Route
            path="/category/new"
            component={CategoryEditScreen}
            edit={false}
          ></Route>
          <Route path="/profile" component={Profile} exact></Route>
          <Route path="/admin/:tabname" component={AdminScreen} exact>
          </Route>
          <Route path="/admin" exact> <Redirect to="/admin/slider" /></Route>
          <Route path="/NotFound" component={Page404Screen} exact />
        </Switch>
        {/* <Provider
          store={createStore(
            combineReducers({
              conversationControl: conversationControlReducer,
              messageControl: messageControlReducer,
              chatAccountInfo: accountInfoReducer,
              viewControl: viewControlReducer,
              socketInfo: socketInfoReducer,
            })
          )}
        >
          <ChatBox></ChatBox>
        </Provider> */}
        <FooterView></FooterView>
      </BrowserRouter>
    </div>
  );
}

export default App;
