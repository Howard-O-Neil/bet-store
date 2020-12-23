import classNames from "classnames";
import { defaultCoreCipherList } from "constants";
import React from "react";
import { Link } from "react-router-dom";
import style from "./home.module.scss";
import SliderView from "../../components/SliderContent";
import MainPage from "./mainPage";

export default function Home() {
  return (
    <div className="hello">
      <SliderView />
      <div className="container">
        <i className="fas fa-bell"></i>

        <MainPage></MainPage>
      </div>
    </div>
  );
}
