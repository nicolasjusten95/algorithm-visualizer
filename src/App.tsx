import React from 'react';
import SortingAlgorithms from "./components/sortingAlgorithms/SortingAlgorithms";
import './App.css';
import NavBar from "./components/navBar/NavBar";
import {ThemeProvider} from "@mui/material";
import {theme} from "./utils/MuiTheme";


function App() {
    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <NavBar/>
                <SortingAlgorithms/>
            </ThemeProvider>
        </div>
    );
}

export default App;
