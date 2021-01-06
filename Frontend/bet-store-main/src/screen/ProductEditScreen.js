import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  listProductDetails,
  updateProduct,
} from "../actions/productActions";
import { listCategories } from "../actions/categoryActions";
import style from "../styles/ProductEditForm.module.scss";
import { uploadImage } from "../actions/imageActions";
import ImageUpload from "../components/ImageUpload";
import CategoryPicker from "../components/CategoryPicker";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductEditScreen = (props) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    if (createSuccess) props.history.push("/profile");
  };
  const handleShow = () => setShowModal(true);
  const productId = props.match.params.id;
  const isEdit = props.edit || false;
  //const [selectedFile, setFile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyLabel, setPropertyLabel] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [defaultImages, setDefaultImage] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();

  const [selectedPathName, setSelectedPathName] = useState([]);
  const [selectedPath, setSelectedPath] = useState([]);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = productCreate;
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = productUpdate;

  const profile = useSelector((state) => state.profile);
  const {
    Payload: { accountID },
  } = profile;

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, []);
  useEffect(() => {
    if (isEdit) {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setCategory(product.category);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setCountInStock(product.countInStock);
        setProperties(product.properties);
        setDefaultImage(product.image);
      }
    }
  }, [dispatch, props.history, productId, product]);

  useEffect(() => {
    if (product.name && categories.length) {
      setPropertyLabel(
        categories.find((x) => x.path === product.category).properties
      );
    }
  }, [product, categories]);

  const submitHandler = (event) => {
    event.preventDefault();

    const files = new FormData();
    for (var x = 0; x < pictures.length; x++) {
      files.append("files", pictures[x], pictures[x].name);
    }
    if (window.confirm("Bạn có chắc chắn muốn lưu sản phẩm?")) {
      handleShow();
      const temp_product = {
        name: name,
        description: description,
        price: price,
        countInStock: countInStock,
        image: defaultImages,
        category: category,
        user: accountID,
        properties: properties,
      };
      //console.log(files.get("files"));
      //dispatch(uploadImage(files));

      if (isEdit) dispatch(updateProduct(productId, temp_product, files));
      else dispatch(createProduct(temp_product, files));
    }
  };

  const onPropertyChange = (event) => {
    console.log(properties);
    const prop = properties.find((prop) => prop._id === event.target.name);
    if (prop)
      properties.find((prop) => prop._id === event.target.name).value =
        event.target.value;
    else
      properties.push({
        _id: event.target.name,
        value: event.target.value,
      });
  };

  const onCategoryChange = async (event) => {
    setProperties([]);
    const selectedCat = categories.find((x) => x.path === event.target.value);
    setCategory(selectedCat.path);
    setPropertyLabel(selectedCat.properties);
  };

  const getPropertyValue = (key) => {
    const prop = properties.find((x) => x._id === key);
    if (prop) return prop.value;
    return "";
  };

  const onFileChange = (event) => {
    setPictures([...pictures, ...event.target.files]);
  };

  const deleteDefaultPic = (index) => {
    const arr = [...defaultImages];
    arr.splice(index, 1);
    setDefaultImage(arr);
  };

  const deletePic = (index) => {
    const arr = [...pictures];
    URL.revokeObjectURL(arr.splice(index, 1).preview);
    setPictures(arr);
  };
  useEffect(() => {
    setFiles(
      Object.values(pictures).map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, [pictures]);

  const setPath = (pos, pathName, path) => {
    selectedPathName[pos] = pathName;
    selectedPath[pos] = path;
    setSelectedPathName(selectedPathName.slice(0, pos + 1));
    setSelectedPath(selectedPath.slice(0, pos + 1));
  };

  /* useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((picture) => URL.revokeObjectURL(picture.preview));
    },
    [files]
  );*/

  return (
    <div className={style.body}>
      <Container className={style.form_section}>
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

            <br />
          </Form>
        )}
      </Container>
      <Container className={style.form_section}>
        <h1>Thông tin chi tiết</h1>
        {/*<div className={style.selectedPath}>
          <b>Đã chọn : </b>

          {selectedPathName.map((path, index) =>
            index == 0 ? <span>{path}</span> : <span>{" > " + path}</span>
          )}
        </div>
        <CategoryPicker
          setPath={setPath}
          selectedPath={selectedPath}
          selectedPathName={setSelectedPathName}
          ></CategoryPicker>*/}
        <Form.Group controlId="category">
          <Form.Label>Loại sản phẩm</Form.Label>
          <Form.Control as="select" onChange={(e) => onCategoryChange(e)}>
            <option value="" disabled selected>
              Chọn loại sản phẩm
            </option>
            {categories.map((x) =>
              x.path === category ? (
                <option key={x._id} value={x.path} selected>
                  {x.name}
                </option>
              ) : (
                <option key={x._id} value={x.path}>
                  {x.name}
                </option>
              )
            )}
          </Form.Control>
        </Form.Group>
        {propertyLabel.map((prop) => (
          <Form.Group controlId={`properties_${prop._id}`} key={prop._id}>
            <Form.Label>{prop.name}</Form.Label>
            <Form.Control
              type="text"
              name={prop._id}
              onChange={(e) => onPropertyChange(e)}
              defaultValue={getPropertyValue(prop._id)}
              placeholder={prop.name}
            ></Form.Control>
          </Form.Group>
        ))}
        <br />
      </Container>
      <Container className={style.form_section}>
        <h1>Hình ảnh</h1>
        <Form.File
          className={style.img_select}
          onChange={onFileChange}
          multiple
        ></Form.File>
        <ImageUpload
          defaultImages={defaultImages}
          images={files}
          onChange={onFileChange}
          onDel={deletePic}
          onDelDefault={deleteDefaultPic}
          multiple
        ></ImageUpload>
        <br />
      </Container>
      <Container className={style.btn_container}>
        <button
          className={`btn btn-outline-dark ${style.button}`}
          onClick={() => props.history.push("/profile")}
        >
          Hủy
        </button>
        <button
          className={`btn btn-primary ${style.button}`}
          onClick={submitHandler}
        >
          Lưu
        </button>
      </Container>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createLoading || updateLoading ? (
            <Loader />
          ) : createError || updateError ? (
            <>
              <Message variant="danger">Không thành công</Message>
              {/*<Message variant="danger">{createError}</Message>*/}
            </>
          ) : (
            (createSuccess || updateSuccess) && (
              <Message variant="success">Thành công</Message>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Quay lại
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductEditScreen;
