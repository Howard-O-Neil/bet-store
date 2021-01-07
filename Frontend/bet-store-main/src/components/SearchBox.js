import "../styles/Header.scss";
import React, { useState } from "react";

const SearchBox = ({ history, location }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/mua-ban/?q=${keyword}`);
    } else {
      history.push("/");
    }
  };
  return (
    <form onSubmit={submitHandler}>
      <div className="search-container">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Bạn muốn tìm gì?"
          spellCheck="false"
          onChange={(e) => setKeyword(e.target.value)}
        ></input>
      </div>
    </form>
  );
};

export default SearchBox;
