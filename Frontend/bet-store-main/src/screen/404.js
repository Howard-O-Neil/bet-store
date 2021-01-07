import React from "react";
import style from "../styles/Page404.module.scss";

const Page404 = ({ variant }) => {
  return (
    <div className="container">
      {variant === "product" ? (
        <div className={style.box}>
          <div className={style.content}>
            <i class="fas fa-box-open"></i>
            Chưa có sản phẩm
          </div>
        </div>
      ) : (
        <div className={style.box}>
          <div className={style.content}>
            <i class="fas fa-binoculars"></i>
            Không tìm thấy trang
          </div>
        </div>
      )}
    </div>
  );
};

export default Page404;
