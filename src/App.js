import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoviesPage from "./pages/MoviesPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<MoviesPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
