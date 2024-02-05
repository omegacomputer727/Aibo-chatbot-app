import React from "react";
import "./Search.css";
import { MdSearch } from "react-icons/md";

const Search = ({ handleSearchNote }) => {
  return (
    <div className="search-container">
      <div className="search">
        <MdSearch className="search-icon" size="1.3em" />
        <input
          className="search-bar"
          onChange={(event) => handleSearchNote(event.target.value)}
          type="text"
          placeholder="Type to search..."
        />
        {/* <input
        onChange={(event) => {
          setSearchDate(event.target.value);
          handleSearchDate(event.target.value);
        }}
        type="date"
      /> */}
      </div>
    </div>
  );
};

export default Search;
