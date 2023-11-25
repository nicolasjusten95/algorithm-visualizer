import React from 'react';
import SortingAlgorithms from "./components/body/sortingAlgorithms/SortingAlgorithms";
import './App.css';
import NavBar from "./components/header/navBar/NavBar";
import {ThemeProvider} from "@mui/material";
import {theme} from "./utils/MuiTheme";
import Footer from "./components/footer/Footer";


function App() {
    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <NavBar/>
                <SortingAlgorithms/>
                <Footer />
            </ThemeProvider>
        </div>
    );
}

export default App;
