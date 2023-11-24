import React from 'react';
import SortingAlgorithms from "./components/sortingAlgorithms/SortingAlgorithms";
import './App.css';
import NavBar from "./components/navBar/NavBar";
import {ThemeProvider} from "@mui/material";
import {theme} from "./utils/MuiTheme";


function App() {
  return (
    <ThemeProvider theme={theme}>
        <NavBar />
        <SortingAlgorithms />
    </ThemeProvider>
  );
}

export default App;
