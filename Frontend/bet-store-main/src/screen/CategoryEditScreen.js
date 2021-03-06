import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  listCategories,
  listCategoryDetails,
  createCategory,
  updateCategory,
} from "../actions/categoryActions";

import ImageUpload from "../components/ImageUpload";
import Loader from "../components/Loader";
import Message from "../components/Message";
import style from "../styles/CategoryEdit.module.scss";

const CategoryEditScreen = ({ match, edit, history }) => {
  const isEdit = edit || false;
  const id = match.params.id;
  const dispatch = useDispatch();

  const [properties, setProperties] = useState([]);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [parent, setParent] = useState("");

  const [image, setImage] = useState([]);
  const [defaultImage, setDefaultImage] = useState([]);
  const [imagePrview, setImagePreview] = useState([]);

  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyDefaultImage, setPropertyDefaultImages] = useState([]);
  const [propertyImagePreview, setPropertyImagePreview] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    if (createSuccess) history.push("/profile");
  };
  const handleShow = () => setShowModal(true);

  const categoryDetails = useSelector((state) => state.categoryDetails);
  const {
    loading: loadingCategory,
    error: errorCategory,
    category,
  } = categoryDetails;

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = categoryCreate;

  const categoryUpdate = useSelector((state) => state.categoryUpdate);
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = categoryUpdate;

  useEffect(() => {
    if (id) {
      if (!category.name || category._id !== id) {
        dispatch(listCategoryDetails(id));
      } else {
        setName(category.name);
        setPath(category.path);
        setParent(category.parent);
        setDefaultImage(category.image);
        handlePropImage(category.properties);
        setProperties(category.properties);
        console.log(category);
      }
    }

    dispatch(listCategories());
  }, [dispatch, category]);

  const handlePropImage = (prop) => {
    let tempArr = [];
    Object.values(prop).map((x) => {
      tempArr = [...tempArr, x.image];
    });
    setPropertyDefaultImages(tempArr);
    console.log(tempArr);
  };

  const onPropertyChange = (i, event) => {
    let values = [...properties];
    values[i].name = event.target.value;
    setProperties(values);
  };

  const onCategoryChange = (e) => {
    setParent(e.target.value);
  };
  const submitHandler = (e) => {
    handleShow();
    e.preventDefault();
    const category = {
      name: name,
      path: parent + path,
      image: defaultImage,
      properties: properties,
      parent: parent,
    };
    const imagesToUpload = new FormData();
    for (var x = 0; x < image.length; x++) {
      imagesToUpload.append("files", image[x], image[x].name);
    }
    if (!isEdit) {
      for (var x = 0; x < propertyImages.length; x++) {
        imagesToUpload.append(
          "files",
          propertyImages[x],
          propertyImages[x].name
        );
      }
      dispatch(createCategory(category, imagesToUpload));
    } else {
      dispatch(updateCategory(id, category, imagesToUpload, propertyImages));
    }
    //dispatch(createCategory(category, imagesToUpload));
  };
  const onAddPropety = (e) => {
    setProperties([...properties, { name: "", image: {} }]);
  };

  const onImageChange = (event) => {
    if (defaultImage) {
      setDefaultImage();
      console.log("del");
    }
    setImage([...event.target.files]);
  };

  const deleteImage = () => {
    setImage([]);
  };

  const deleteDefaultImage = (index) => {
    setDefaultImage([]);
    // console.log("deldefault");
    //console.log(defaultImage);
  };

  const onPropertyImageChange = (index, event) => {
    if (propertyDefaultImage[index]) {
      deletePropertyDefaultImage(index);
    }
    let propImg = [...propertyImages];
    propImg[index] = event.target.files[0];
    setPropertyImages(propImg);
  };

  const deletePropertyImage = (index) => {
    let arr = [...propertyImages];
    arr[index] = undefined;
    setPropertyImages(arr);
    console.log(propertyImages);
  };

  const deletePropertyDefaultImage = (index) => {
    let arr = [...propertyDefaultImage];
    arr[index] = undefined;
    setPropertyDefaultImages(arr);
    console.log(index);
  };
  useEffect(() => {
    setPropertyImagePreview(
      propertyImages.map(
        (file) =>
          file &&
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
      )
    );
  }, [propertyImages]);

  useEffect(() => {
    setImagePreview(
      image.map((x) =>
        Object.assign(x, {
          preview: URL.createObjectURL(x),
        })
      )
    );
  }, [image]);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      imagePrview.forEach((picture) => URL.revokeObjectURL(picture.preview));
    },
    [imagePrview]
  );

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      propertyImagePreview.forEach(
        (picture) => picture && URL.revokeObjectURL(picture.preview)
      );
    },
    [propertyImagePreview]
  );

  return (
    <div className="container">
      <Container className={style.form_section}>
        {isEdit ? <h1>Ch???nh s???a danh m???c</h1> : <h1>T???o danh m???c</h1>}

        {loadingCategory || loadingCategories ? (
          <Loader />
        ) : errorCategory || errorCategories ? (
          <Message variant="danger">{errorCategory}</Message>
        ) : (
          <>
            <Form>
              <Form.Group controlId="name">
                <Form.Label>T??n danh m???c</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Nh???p t??n danh m???c"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="path">
                <Form.Label>???????ng d???n danh m???c</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nh???p ???????ng d???n danh m???c"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="parent">
                <Form.Label>Danh m???c cha</Form.Label>
                <Form.Control as="select" onChange={(e) => onCategoryChange(e)}>
                  <option value="" selected>
                    root
                  </option>
                  {categories.map((x) =>
                    x.parent === category.path ? (
                      <option value={x.path} selected>
                        {x.name}
                      </option>
                    ) : (
                      <option value={x.path}>{x.name}</option>
                    )
                  )}
                </Form.Control>
              </Form.Group>
            </Form>
            <Form.Group controlId="image">
              <Form.Label>H??nh ???nh hi???n th???</Form.Label>
              <ImageUpload
                defaultImages={isEdit && defaultImage ? [defaultImage] : []}
                images={imagePrview}
                onChange={onImageChange}
                onDel={deleteImage}
                onDelDefault={deleteDefaultImage}
                multiple={false}
              ></ImageUpload>
            </Form.Group>

            <Form.Group controlId="properties">
              {properties.map((property, index) => (
                <div key={index}>
                  <Form.Label>Thu???c t??nh {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nh???p t??n thu???c t??nh"
                    value={property.name}
                    onChange={(e) => onPropertyChange(index, e)}
                  ></Form.Control>
                  <ImageUpload
                    defaultImages={
                      propertyDefaultImage[index] && [
                        propertyDefaultImage[index],
                      ]
                    }
                    images={
                      propertyImagePreview[index] && [
                        propertyImagePreview[index],
                      ]
                    }
                    onChange={(e) => onPropertyImageChange(index, e)}
                    onDel={(e) => deletePropertyImage(index)}
                    onDelDefault={(e) => deletePropertyDefaultImage(index)}
                    multiple={false}
                  ></ImageUpload>
                </div>
              ))}
            </Form.Group>
            <br />
          </>
        )}
      </Container>

      <Container className={style.btnContainer}>
        <button className={`btn btn-outline-dark ${style.button}`}>H???y</button>
        <button
          className={`btn btn-primary ${style.button}`}
          onClick={onAddPropety}
        >
          Th??m thu???c t??nh
        </button>

        <button
          className={`btn btn-primary ${style.button}`}
          onClick={submitHandler}
        >
          L??u
        </button>
      </Container>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Th??ng b??o</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createLoading || updateLoading ? (
            <Loader />
          ) : createError || updateError ? (
            <>
              <Message variant="danger">Kh??ng th??nh c??ng</Message>
              {/*<Message variant="danger">{createError}</Message>*/}
            </>
          ) : (
            (createSuccess || updateSuccess) && (
              <Message variant="success">Th??nh c??ng</Message>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Quay l???i
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryEditScreen;
