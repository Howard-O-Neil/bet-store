import React from "react";
import { Route, Switch } from "react-router";
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
import AddProductScreen from "./screen/AddProductScreen";
import { ChatBox } from "./components/ChatBox";
import ProductListScreen from "./screen/ProductListScreen";
import ProductEditScreen from "./screen/ProductEditScreen";

function App() {
  return (
    <div>
      <BrowserRouter>
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
          <Route
            path="/profile/product"
            component={ProductListScreen}
            exact
          ></Route>
          <Route
            path="/profile/product/new"
            component={AddProductScreen}
          ></Route>
          <Route
            path="/profile/product/:id/edit"
            component={ProductEditScreen}
          ></Route>
        </Switch>
        <ChatBox></ChatBox>
        <div className="footermain">
          <FooterView></FooterView>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
