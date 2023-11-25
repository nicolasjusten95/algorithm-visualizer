import React from 'react';
import SortingAlgorithms from "./components/body/sortingAlgorithms/SortingAlgorithms";
import NavBar from "./components/header/navBar/NavBar";
import {ThemeProvider} from "@mui/material";
import {theme} from "./utils/MuiTheme";
import Footer from "./components/footer/Footer";


function App() {
    return (
        <ThemeProvider theme={theme}>
            <NavBar/>
            <SortingAlgorithms/>
            <Footer/>
        </ThemeProvider>
    );
}

export default App;
