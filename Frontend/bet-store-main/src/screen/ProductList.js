import React, { useEffect } from "react";
import ReactTimeAgo from "react-time-ago";
import { listProducts, deleteProduct } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import style from "../styles/ProductList.module.scss";
import { Button } from "react-bootstrap";
const ProductList = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const profile = useSelector((state) => state.profile);
  const {
    Payload: { accountID },
  } = profile;

  useEffect(() => {
    dispatch(listProducts({ user: accountID }));
  }, [dispatch, successDelete]);

  const deleteHandler = (id) => {
    console.log("Delete");
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <div>
        <div className={`container ${style.selling}`}>
          <h4>Đang bán</h4>

          <LinkContainer to="/profile/product/new">
            <button className="btn btn-primary" type="button">
              <i className="fas fa-plus"></i> Thêm sản phẩm
            </button>
          </LinkContainer>
          {products.map((product) => (
            <div className={`${style.product}`}>
              <div className="media">
                <img
                  className="mr-3 mt-2 mb-2"
                  src={`/cdn/cdn/${product.image[0].link}`}
                ></img>
                <div className="media-body mt-2">
                  <h6>{product.name}</h6>
                  <p>
                    {new Intl.NumberFormat("vi-VI", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>
                  Đã đăng
                  <ReactTimeAgo date={product.updatedAt} locale="vi" />
                </div>
              </div>
              <div className={style.buttonContainer}>
                <LinkContainer to={`/profile/product/${product._id}/edit`}>
                  <Button variant="secondary" className="btn-sm">
                    <i className="fas fa-edit"></i>
                  </Button>
                </LinkContainer>
                <Button
                  variant="danger"
                  className="btm-sm"
                  onClick={() => deleteHandler(product._id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
