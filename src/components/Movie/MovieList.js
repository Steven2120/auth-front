import React from "react";
import { Link } from "react-router-dom";

function MovieList(props) {
  return props.movieArray.map((item) => {
    return (
      <div
        key={item.imdbID}
        style={{
          width: 100,
          height: 100,
          marginRight: 25,
        }}
      >
        <Link
          style={{
            textDecoration: "none",
            color: "black",
            fontFamily: "monospace",
          }}
          to={{
            pathname: `/movie-detail/${item.Title}`,
            search: `?t=${item.Title}`,
          }}
        >
          <div>
            <img src={item.Poster} alt={item.Title} />
          </div>
          <div>
            Title: {item.Title}
            Year: {item.Year}
          </div>
        </Link>
      </div>
    );
  });
}

export default MovieList;
