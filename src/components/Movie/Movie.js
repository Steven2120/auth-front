//imports react and the following items
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MovieList from "./MovieList";

export class Movie extends Component {
  //sets default state to the following props with the following values
  state = {
    movie: "",
    movieArray: [],
    movieArray2: [],
    movieArray3: [],
    totalCount: 0,
    totalPage: 0,
    perPage: 10,
    currentPage: 1,
    maxPageLimit: 10,
    minPageLimit: 0,
    pageArray: [],
  };

  // async componentDidMount() {

  //   try {
  //     let randomMovieData = await axios.get(
  //       `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${randomMovieArray[randomSelectedMovieIndex]}`
  //     );

  //     this.setState({
  //       movieArray: randomMovieData.data.search,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   try {

  //     if (searchedMovieTitle) {
  //       let result = await axios.get(
  //         `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${searchedMovieTitle}`
  //       );

  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  getTotalPages = (totalResults, perPage) => {
    let pages = [];

    for (let i = 1; i < Math.ceil(totalResults / perPage); i++) {
      pages.push(i);
    }
    return pages;
  };

  async componentDidMount() {
    try {
      //check for session storage
      let searchedMovieTitleSessionStorage =
        window.sessionStorage.getItem("searchedMovieTitle");

      if (searchedMovieTitleSessionStorage) {
        let result = await this.handleSearchMovie(
          searchedMovieTitleSessionStorage
        );

        let totalPageArray = this.getTotalPages(
          +result.data.totalResults,
          this.state.perPage
        );

        this.setState({
          movie: searchedMovieTitleSessionStorage,
          movieArray: result.data.Search,
          totalPage: +result.data.totalResults, //in batman result is 440
          pageArray: totalPageArray,
        });
      } else {
        let randomMovieTitle = this.handleRandomTitle();
        let result = await this.handleSearchMovie(randomMovieTitle);
        // let result = await this.handleSearchMovie(randomMovieTitle);

        let totalPageArray = this.getTotalPages(
          +result.data.totalResults,
          this.state.perPage
        );

        //logs results object where you can find total results
        console.log(result);

        console.log(totalPageArray);

        this.setState({
          movie: randomMovieTitle,
          movieArray: result.data.Search,
          totalPage: +result.data.totalResults, //in batman result is 440
          pageArray: totalPageArray, //[1,2,3,4,5] all the way time 440 each page will contain 10 results
        });

        // let randomMovieTitle = this.handleRandomTitle();
        // let result = this.handleSearchMovie(randomMovieTitle);
        // let result2 = this.handleSearchMovie("batman");
        // let result3 = this.handleSearchMovie("the matrix");
        // let getAllPromiseMovies = Promise.all([result, result2, result3]);
        // let resolvedMovie = await getAllPromiseMovies;
        // console.log(resolvedMovie);
        // this.setState({
        //   movieArray: resolvedMovie[0].data.Search,
        //   movieArray2: resolvedMovie[1].data.Search,
        //   movieArray3: resolvedMovie[2].data.Search,
        // });
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleRandomTitle = () => {
    let randomMovieArray = [
      "Big trouble in little china",
      "the simpsons",
      "Rush hour",
      "the godfather",
      "Luca",
      "Pulp Fiction",
      "The Matrix",
    ];

    let randomSelectedMovieIndex = Math.floor(
      Math.random() * randomMovieArray.length
    );

    return randomMovieArray[randomSelectedMovieIndex];
  };

  handleSearchMovie = async (movieTitle) => {
    try {
      let randomMovieData = await axios.get(
        `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${movieTitle}&page=${this.state.currentPage}`
      );

      return randomMovieData;
    } catch (e) {
      return e;
    }
  };

  //creates handler function that sets following state
  handleOnChange = (event) => {
    this.setState({
      movie: event.target.value,
    });
  };

  //function that sets variable to ajax call and sets state movieArray to result.data.Search
  onSubmit = async (event) => {
    try {
      let result = await this.handleSearchMovie(this.state.movie);

      window.sessionStorage.setItem("searchedMovieTitle", this.state.movie);

      let totalPageArray = this.getTotalPages(
        +result.data.totalResults,
        this.state.perPage
      );

      this.setState({
        movieArray: result.data.Search,
        totalPage: +result.data.totalResults,
        pageArray: totalPageArray,
      });
      //catches error and logs it
    } catch (e) {
      console.log(e);
    }
  };

  showpagination = () => {
    let totalPages = this.state.totalPage; // 440
    let perPage = this.state.perPage; // 10
    let currentPage = this.state.currentPage; // 1
    let maxPageLimit = this.state.maxPageLimit; // 10
    let minPageLimit = this.state.minPageLimit; // 0

    const buildPagination = () => {
      return (
        <>
          {this.state.pageArray.map((number) => {
            console.log(number < maxPageLimit + 1 && number > minPageLimit);
            // console.log("number: ", number);
            // console.log("maxPageLimit + 1", maxPageLimit);

            if (number < maxPageLimit + 1 && number > minPageLimit) {
              return (
                <span
                  onClick={() => this.handleGoToPage(number)}
                  style={{
                    marginLeft: 15,
                    marginRight: 15,
                    cursor: "pointer",
                    color: currentPage === number ? "red" : "black",
                  }}
                  key={number}
                >
                  {number}
                </span>
              );
            }
          })}
        </>
      );
    };

    return (
      <div>
        <ul>{buildPagination()}</ul>
      </div>
    );
  };

  handleGoToPage = (number) => {
    this.setState(
      {
        currentPage: number,
      },
      async () => {
        let result = await this.handleSearchMovie(this.state.movie);

        this.setState({
          movieArray: result.data.Search,
        });
      }
    );
  };

  nextPage = () => {
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          currentPage: prevState.currentPage + 1,
        };
      },
      async () => {
        let movie = "";

        let searchedMovieTitleSessionStorage =
          window.sessionStorage.getItem("searchedMovieTitle");

        movie = searchedMovieTitleSessionStorage
          ? window.sessionStorage.getItem("searchedMovieTitle")
          : this.state.movie;

        let result = await this.handleSearchMovie(movie);
        console.log(result);
        this.setState({
          movieArray: result.data.Search,
        });
      }
    );

    if (this.state.currentPage + 1 > this.state.maxPageLimit) {
      this.setState({
        maxPageLimit: this.state.maxPageLimit + this.state.perPage,
        minPageLimit: this.state.minPageLimit + this.state.perPage,
      });
    }
  };

  prevPage = () => {
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          currentPage: prevState.currentPage - 1,
        };
      },
      async () => {
        let result = await this.handleSearchMovie("batman");
        console.log(result);
        this.setState({
          movieArray: result.data.Search,
        });
      }
    );

    if ((this.state.currentPage - 1) % this.state.perPage === 0) {
      this.setState({
        maxPageLimit: this.state.maxPageLimit - this.state.perPage,
        minPageLimit: this.state.minPageLimit - this.state.perPage,
      });
    }
  };

  //renders following jsx
  render() {
    return (
      <div>
        <div
          style={{
            width: 500,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          <input
            type="text"
            placeholder="Search something..."
            name="movie"
            onChange={this.handleOnChange}
          />
          <button type="submit" onClick={this.onSubmit}>
            Search
          </button>
        </div>

        <div
          style={{
            width: 1200,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "50px",
            display: "flex",
          }}
        >
          {/* {this.showMovieList()} */}

          <h3>Coolest Movie</h3>
          <MovieList movieArray={this.state.movieArray} />
        </div>

        {this.state.totalPage <= 10 ? (
          ""
        ) : (
          <div
            style={{
              marginTop: "9em",
              marginLeft: "4.5em",
              textAlign: "center",
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              disabled={this.state.currentPage === 1 ? true : false}
              style={{ cursor: "pointer" }}
              onClick={this.prevPage}
            >
              Previous
            </button>
            {this.showpagination()}
            <button
              onClick={this.nextPage}
              style={{ cursor: "pointer" }}
              disabled={
                this.state.currentPage ===
                this.state.pageArray[this.state.pageArray.length - 1]
                  ? true
                  : false
              }
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
}
export default Movie;

{
  /* <div>
    <h3>Latest Movie</h3>
    <MovieList movieArray={this.state.movieArray2} />
  </div>
  <div>
    <h3>Fans Favorite</h3>
    <MovieList movieArray={this.state.movieArray3} />
  </div> */
}

//creates functional component that maps through movieArray and returns following jsx
// showMovieList = () => {
//   return this.state.movieArray.map((item) => {
//     return (
//       <div
//         key={item.imdbID}
//         style={{
//           width: 300,
//           height: 300,
//           marginRight: 25,
//         }}
//       >
//         <Link
//           style={{
//             textDecoration: "none",
//             color: "black",
//             fontFamily: "monospace",
//           }}
//           to={{
//             pathname: `/movie-detail/${item.Title}`,
//             search: `?t=${item.Title}`,
//           }}
//         >
//           <div>
//             <img src={item.Poster} alt={item.Title} />
//           </div>
//           <div>
//             Title: {item.Title}
//             Year: {item.Year}
//           </div>
//         </Link>
//       </div>
//     );
//   });
// };
