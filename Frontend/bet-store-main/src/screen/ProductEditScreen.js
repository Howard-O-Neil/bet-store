import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { listCategories } from "../actions/categoryActions";
import ImageUploader from "react-images-upload";
import style from "../styles/ProductEditForm.module.scss";
import { uploadImage } from "../actions/imageActions";

const ProductEditScreen = (props) => {
  const productId = props.match.params.id;

  //const [selectedFile, setFile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyLabel, setPropertyLabel] = useState([]);
  const [category, setCategory] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [defaultImages, setDefaultImage] = useState([]);
  const [pictures, setPictures] = useState([]);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    if (!product.name || product._id !== productId) {
      dispatch(listProductDetails(productId));
      dispatch(listCategories());
    } else {
      setCategory(product.category);
      setPropertyLabel(product.category.properties);
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCountInStock(product.countInStock);
      setProperties(product.properties);
      handleDefaultImage(product.image);
    }
  }, [dispatch, props.history, productId, product]);

  const submitHandler = (event) => {
    event.preventDefault();

    const files = new FormData();
    for (var x = 0; x < pictures.length; x++) {
      files.append("files", pictures[x]);
    }
    if (window.confirm("Bạn có chắc chắn muốn lưu sản phẩm?")) {
      const temp_product = {
        name: name,
        description: description,
        price: price,
        countInStock: countInStock,
        image: product.image,
        category: category._id,
        user: "5fa7fb0a62083e11ace57490",
        properties: properties,
      };
      console.log(files.get("files"));
      dispatch(uploadImage(files));

      //dispatch(updateProduct(productId, temp_product, files));
    }
  };
  const handleDefaultImage = (images) => {
    images.map((image) => {
      setDefaultImage([...defaultImages, `/cdn/cdn/${image.link}`]);
    });
  };
  const onDrop = (picture, e, a) => {
    console.log(picture, e, a);
    setPictures([...pictures, picture]);
  };

  const onPropertyChange = (event) => {
    console.log(properties);
    const prop = properties.find((prop) => prop.key === event.target.name);
    if (prop)
      properties.find((prop) => prop.key === event.target.name).value =
        event.target.value;
    else
      properties.push({
        key: event.target.name,
        value: event.target.value,
      });
  };

  const onCategoryChange = async (event) => {
    setProperties([]);
    const selectedCat = categories.find((x) => x._id === event.target.value);

    setCategory(selectedCat);
    setPropertyLabel(selectedCat.properties);
  };

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  const getPropertyValue = (key) => {
    const prop = properties.find((x) => x.key === key);
    if (prop) return prop.value;
    return "";
  };

  return (
    <>
      <Link to="/profile/product" className="btn btn-light my-3">
        Quay lại
      </Link>
      <FormContainer>
        <h1>Chỉnh sửa sản phẩm</h1>
        {loading || loadingCategories ? (
          <h3>Loading</h3>
        ) : error ? (
          <h3>{error}</h3>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="name"
                placeholder="Nhập tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập giá sản phẩm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số lượng"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Nhập mô tả sản phẩm"
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Loại sản phẩm</Form.Label>
              <Form.Control as="select" onChange={(e) => onCategoryChange(e)}>
                {categories.map((x) =>
                  x._id === category._id ? (
                    <option key={x._id} value={x._id} selected>
                      {x.name}
                    </option>
                  ) : (
                    <option key={x._id} value={x._id}>
                      {x.name}
                    </option>
                  )
                )}
              </Form.Control>
            </Form.Group>

            {propertyLabel.map((prop) => (
              <Form.Group controlId="properties">
                <Form.Label>{prop.name}</Form.Label>
                <Form.Control
                  type="text"
                  name={prop.key}
                  onChange={(e) => onPropertyChange(e)}
                  defaultValue={getPropertyValue(prop.key)}
                  placeholder={prop.name}
                ></Form.Control>
              </Form.Group>
            ))}
            <ImageUploader
              {...props}
              className={style.imgUpload}
              withIcon={true}
              onChange={onDrop}
              defaultImages={defaultImages}
              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
              maxFileSize={5242880}
              withPreview={true}
            />
            <Button type="submit" variant="primary">
              Cập nhật
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
