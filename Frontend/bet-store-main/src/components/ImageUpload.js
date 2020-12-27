import React, { useRef } from "react";
import style from "../styles/ImageUpload.module.scss";
const ImageUpload = ({
  defaultImages,
  images,
  onChange,
  onDel,
  onDelDefault,
  multiple,
}) => {
  const fileUploader = useRef();

  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 13,
    paddingTop: 13,
    borderTop: "1px dashed gray",
  };

  const thumb = {
    position: "relative",
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid gray",
    marginBottom: 8,
    marginRight: 9,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
  };

  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };

  const img = {
    display: "block",
    width: "auto",
    height: "100%",
  };

  const thumbButton = {
    position: "absolute",
    right: 2,
    top: 2,
    background: "rgba(0,0,0,.8)",
    color: "#fff",
    border: 0,
    borderRadius: ".325em",
    cursor: "pointer",
  };
  const handleClick = (e) => {
    fileUploader.current.click();
  };

  return (
    <div className={`container ${style.box}`}>
      <div className="mt-3">
        <input
          className="form-control-file"
          type="file"
          onChange={onChange}
          multiple={multiple}
          accept="image/*"
          style={{ display: "none" }}
          ref={fileUploader}
        />
      </div>
      <button className="btn btn-primary" onClick={handleClick}>
        Chọn hình ảnh
      </button>
      <div style={thumbsContainer}>
        {/*defaultImages.map((image) => {
          console.log(image);
        })*/}
        {defaultImages &&
          defaultImages.map((image, index) => (
            <div style={thumb} key={image.name}>
              <div style={thumbInner}>
                <img
                  src={`/cdn/cdn/${image.link}`}
                  style={img}
                  alt={image.alt}
                />
              </div>
              <button style={thumbButton}>
                <i
                  className="far fa-times-circle"
                  onClick={() => onDelDefault(index)}
                ></i>
              </button>
            </div>
          ))}
        {images &&
          images.map((image, index) => (
            <div style={thumb} key={image.name}>
              <div style={thumbInner}>
                <img src={image.preview} style={img} alt="" />
              </div>
              <button style={thumbButton} onClick={() => onDel(index)}>
                <i className="far fa-times-circle"></i>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageUpload;
