import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button, FormControl } from "react-bootstrap";

import axios from "axios";
import {
  listCategories,
  listCategoryDetails,
} from "../actions/categoryActions";

import { createProduct } from "../actions/productActions";
import { uploadImage } from "../actions/imageActions";
const AddProductScreen = ({ history }) => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingProductCreate,
    error: errorProductCreate,
    success: successProductCreate,
  } = productCreate;

  //const [category, setCategory] = useState({});

  let [categoryProperties, setPropertiesLabel] = useState([]);
  const [selectedFile, setFile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  /* useEffect(() => {
    setPropertiesLabel(category.properties);
  }, [category]);*/
  useEffect(() => {
    categoryProperties.map((catProp) => {
      properties.push({
        key: catProp.key,
        value: null,
      });
    });
  }, [categoryProperties]);

  const onCategoryChange = async (event) => {
    //console.log(event.target.value);

    const selectedCat = categories.find((x) => x._id === event.target.value);
    setProperties([]);
    setPropertiesLabel(selectedCat.properties);
    setCategoryId(event.target.value);

    // console.log(categoryProperties);

    // setCategory(categories.find((cat) => cat._id == event.target.value));
  };

  const onFileChange = (event) => {
    setFile(event.target.files);
    console.log(selectedFile);
  };

  const onPropertyChange = (event) => {
    console.log(properties);

    properties.find((prop) => prop.key === event.target.name).value =
      event.target.value;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const uploadFiledata = new FormData();
    for (var x = 0; x < selectedFile.length; x++) {
      uploadFiledata.append("files", selectedFile[x]);
    }
    const product = {
      name: name,
      description: description,
      price: price,
      countInStock: countInStock,
      image: [],
      category: categoryId,
      user: "5fa7fb0a62083e11ace57490",
      properties: properties,
    };
    //console.log(uploadFiledata.get("files"));
    //console.log(uploadFiledata);
    //dispatch(uploadImage(uploadFiledata));
    dispatch(createProduct(product, uploadFiledata));

    /* await axios.post(`${cdnServer}/upload`, uploadFiledata, {}).then((res) => {
      Object.values(res.data).map((filename) => {
        product.image.push({
          link: filename,
          alt: null,
        });
      });
    });*/

    //console.log(product);
    /* axios
      .post(`${nodeServer}/api/products`, product, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => console.log(res.data));*/
  };

  useEffect(() => {
    if (successProductCreate) history.goBack();
  }, [successProductCreate]);

  return (
    <>
      <Form>
        <Row>
          <Col>Tên sản phẩm</Col>
          <Col>
            <Form.Control
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col>Mô tả sản phẩm sản phẩm</Col>
          <Col>
            <Form.Control
              as="textarea"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col>Giá</Col>
          <Col>
            <Form.Control
              type="text"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col>Số lượng</Col>
          <Col>
            <Form.Control
              type="text"
              name="countInStock"
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col>Loại sản phẩm</Col>
          <Col>
            <Form.Control as="select" onChange={(e) => onCategoryChange(e)}>
              <option selected disabled hidden>
                Hãy chọn loại sản phẩm
              </option>
              {categories.map((x) => (
                <option key={x._id} value={x._id}>
                  {x.name}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>

        {categoryProperties.map((prop) => (
          <Row>
            <Col>
              <Form.Label>{prop.name}</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                name={prop.key}
                placeholder={prop.name}
                onChange={(e) => onPropertyChange(e)}
              ></Form.Control>
            </Col>
          </Row>
        ))}
        <Form.File
          className="position-relative"
          required
          name="files"
          label="File"
          onChange={onFileChange}
          feedbackTooltip
          multiple
        />
      </Form>
      <Button variant="primary" type="submit" onClick={onSubmit}>
        Submit
      </Button>
    </>
  );
};

export default AddProductScreen;
