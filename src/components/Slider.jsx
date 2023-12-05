import React from "react";

const Slider = ({
  title,
  data,
  activeIndex,
  onScroll,
  onImageClick,
  activeRow,
}) => {
  return (
    <div className="row">
      <h1 className="title">{title}</h1>
      <div className="slider-container">
        <button className="scroll-button left" onClick={() => onScroll("left")}>
          &lt;
        </button>

        <div className="slider-wrapper">
          <div
            className="carousel"
            style={{
              transform: `translateX(${-activeIndex * 220}px)`,
            }}
          >
            <div className="card">
              {data.map((item, index) => (
                <div
                  key={item.imdbID}
                  className={`image ${index === activeIndex ? "active" : ""}`}
                  onClick={() => onImageClick(index)}
                >
                  <img src={item.Poster} alt={item.Title} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="scroll-button right"
          onClick={() => onScroll("right")}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Slider;
