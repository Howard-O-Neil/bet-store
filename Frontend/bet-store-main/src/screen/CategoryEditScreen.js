import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  listCategories,
  listCategoryDetails,
  createCategory,
} from "../actions/categoryActions";

import ImageUpload from "../components/ImageUpload";
import style from "../styles/CategoryEdit.module.scss";

const CategoryEditScreen = ({ match }) => {
  const dispatch = useDispatch();

  const [properties, setProperties] = useState([]);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [parent, setParent] = useState("");

  const [image, setImage] = useState([]);
  const [defaultImage, setDefaultImage] = useState([]);
  const [imagePrview, setImagePreview] = useState([]);

  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyImagePreview, setPropertyImagePreview] = useState([]);

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

  useEffect(() => {
    //dispatch(listCategoryDetails(match.params.id));
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    //dispatch(listCategoryDetails(match.params.id));
  }, [category]);

  const onPropertyChange = (i, event) => {
    let values = [...properties];
    values[i].name = event.target.value;
    setProperties(values);
  };

  const onCategoryChange = (e) => {
    setParent(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();

    const imagesToUpload = new FormData();
    for (var x = 0; x < image.length; x++) {
      imagesToUpload.append("files", image[x], image[x].name);
    }

    for (var x = 0; x < propertyImages.length; x++) {
      imagesToUpload.append("files", propertyImages[x], propertyImages[x].name);
    }

    const category = {
      name: name,
      path: path,
      image: {},
      properties: properties,
      parent: parent,
    };

    //console.log(image, propertyImages);
    dispatch(createCategory(category, imagesToUpload));
  };
  const onAddPropety = (e) => {
    setProperties([...properties, { name: "", image: {} }]);
  };

  const onImageChange = (event) => {
    setImage([...event.target.files]);
  };

  const deleteImage = () => {
    setImage([]);
    console.log("del");
  };

  const deleteDefaultImage = (index) => {
    URL.revokeObjectURL(defaultImage);
    setDefaultImage([]);
  };

  const onPropertyImageChange = (index, event) => {
    let values = [...propertyImages];
    values[index] = event.target.files[0];
    setPropertyImages(values);
  };

  const deletePropertyImage = (index) => {
    const arr = [...propertyImages];
    arr[index] = undefined;
    setPropertyImages(arr);
    console.log(propertyImages);
  };

  const deletePropertyDefaultImage = (index) => {
    /*const arr = [...defaultImages];
    URL.revokeObjectURL(arr.splice(index, 1).preview);
    setDefaultImage(arr);*/
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
      propertyImagePreview.forEach(
        (picture) => picture && URL.revokeObjectURL(picture.preview)
      );
    },
    [propertyImagePreview]
  );

  return (
    <div className="container">
      <Container className={style.form_section}>
        <h1>Chỉnh sửa danh mục</h1>
        {loadingCategory || loadingCategories ? (
          <h3>Loading</h3>
        ) : errorCategory || errorCategories ? (
          <h3>{errorCategory}</h3>
        ) : (
          <>
            <Form>
              <Form.Group controlId="name">
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Nhập tên danh mục"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="path">
                <Form.Label>Đường dẫn danh mục</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập đường dẫn danh mục"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="parent">
                <Form.Label>Danh mục cha</Form.Label>
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
              <Form.Label>Hình ảnh hiển thị</Form.Label>
              <ImageUpload
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
                  <Form.Label>Thuộc tính {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên thuộc tính"
                    value={property.name}
                    onChange={(e) => onPropertyChange(index, e)}
                  ></Form.Control>
                  <ImageUpload
                    images={
                      propertyImagePreview[index] && [
                        propertyImagePreview[index],
                      ]
                    }
                    onChange={(e) => onPropertyImageChange(index, e)}
                    onDel={(e) => deletePropertyImage(index)}
                    onDelDefault={deletePropertyDefaultImage}
                    multiple={false}
                  ></ImageUpload>
                </div>
              ))}
            </Form.Group>
            <br />
          </>
        )}
      </Container>

      <Container className={style.btn_container}>
        <button className={`btn btn-outline-dark ${style.button}`}>
          Reset
        </button>
        <button className={`btn btn-outline-dark ${style.button}`}>Hủy</button>
        <button
          className={`btn btn-primary ${style.button}`}
          onClick={submitHandler}
        >
          Lưu
        </button>
        <button
          className={`btn btn-primary ${style.button}`}
          onClick={onAddPropety}
        >
          Thêm thuộc tính
        </button>
      </Container>
    </div>
  );
};

export default CategoryEditScreen;
