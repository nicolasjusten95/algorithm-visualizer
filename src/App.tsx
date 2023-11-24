import React from 'react';
import SortingAlgorithms from "./components/sortingAlgorithms/SortingAlgorithms";
import './App.css';
import NavBar from "./components/navBar/NavBar";

function App() {
  return (
    <div className="App">
        <NavBar />
        <SortingAlgorithms />
    </div>
  );
}

export default App;
