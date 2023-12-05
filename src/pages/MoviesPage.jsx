import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import Slider from "../components/Slider";
import "../index.css";

const MOVIE_API_URL = "http://www.omdbapi.com/?apikey=413b3ede";

const MoviesPage = () => {
  const [moviesData, setMoviesData] = useState([]);
  const [scrollPositions, setScrollPositions] = useState([0, 0, 0]);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  const [shouldScroll, setShouldScroll] = useState(false);

  const fetchMovies = async (movie) => {
    try {
      const response = await axios.get(`${MOVIE_API_URL}&s=${movie}&plot=full`);
      return response.data.Search || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const moviesToFetch = ["Superman", "Batman", "Avengers"];
      const promises = moviesToFetch.map(async (movie) => ({
        movie,
        data: await fetchMovies(movie),
      }));

      const result = await Promise.all(promises);
      setMoviesData(result);
    };

    fetchData();
  }, []);

  const handleScroll = useCallback(
    (direction, rowIndex) => {
      const cardWidth = 200;

      setScrollPositions((prevScrollPositions) => {
        const newScrollPositions = [...prevScrollPositions];

        if (direction === "down" && rowIndex < moviesData.length - 1) {
          newScrollPositions[rowIndex + 1] = 0;
        } else if (direction === "left" && newScrollPositions[rowIndex] > 0) {
          newScrollPositions[rowIndex] -= cardWidth;
        } else if (
          direction === "right" &&
          newScrollPositions[rowIndex] <
            (moviesData[rowIndex]?.data.length - 1) * cardWidth
        ) {
          newScrollPositions[rowIndex] += cardWidth;
        }

        return newScrollPositions;
      });

      const newActiveRow = rowIndex + (direction === "down" ? 1 : 0);

      setActiveRow(newActiveRow);
      setModalData(null);
    },
    [moviesData]
  );

  const handleImageClick = useCallback(
    (rowIndex, imageIndex) => {
      const activeMovieArray = moviesData[rowIndex]?.data || [];
      const activeIndex = Math.min(imageIndex, activeMovieArray.length - 1);
      setModalData(activeMovieArray[activeIndex]);
      setIsModalOpen(true);
      setActiveRow(rowIndex);
    },
    [moviesData, setModalData, setIsModalOpen, setActiveRow]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && activeRow >= 0) {
        e.preventDefault();

        const activeIndex = Math.round(scrollPositions[activeRow] / 200);
        const activeMovieArray = moviesData[activeRow]?.data || [];

        if (activeIndex >= 0 && activeIndex < activeMovieArray.length) {
          setModalData(activeMovieArray[activeIndex]);
          setIsModalOpen(true);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsModalOpen(false);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        handleScroll(e.key === "ArrowLeft" ? "left" : "right", activeRow);
      } else if (e.key === "ArrowUp" && activeRow > 0) {
        e.preventDefault();
        setShouldScroll(true);
        setActiveRow(activeRow - 1);
      } else if (e.key === "ArrowDown" && activeRow < moviesData.length - 1) {
        e.preventDefault();
        setShouldScroll(true);
        setActiveRow(activeRow + 1);
      }
    },
    [
      activeRow,
      scrollPositions,
      moviesData,
      setModalData,
      setIsModalOpen,
      handleScroll,
    ]
  );

  useEffect(() => {
    if (shouldScroll) {
      window.scrollTo({
        top: activeRow * 400,
        behavior: "smooth",
      });
      setShouldScroll(false);
    }
  }, [activeRow, shouldScroll]);

  const handleScrollVisibility = useCallback(() => {
    const cardHeight = 300;
    const activeRow = Math.min(
      moviesData.length - 1,
      Math.round(window.scrollY / cardHeight)
    );

    setActiveRow(activeRow);
  }, [moviesData.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollVisibility);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScrollVisibility);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleScrollVisibility, handleKeyDown]);

  return (
    <>
      {moviesData.map((genreData, genreIndex) => (
        <Slider
          key={genreIndex}
          title={genreData.movie}
          data={genreData.data}
          scrollPosition={scrollPositions[genreIndex]}
          activeIndex={Math.round(scrollPositions[genreIndex] / 200)}
          activeRow={activeRow}
          onScroll={(direction) => handleScroll(direction, genreIndex)}
          onImageClick={(imageIndex) =>
            handleImageClick(genreIndex, imageIndex)
          }
        />
      ))}
      {isModalOpen && <Modal data={modalData} onClose={handleCloseModal} />}
    </>
  );
};

export default MoviesPage;
