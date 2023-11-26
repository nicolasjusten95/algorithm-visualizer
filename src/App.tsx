import React from 'react';
import SortingAlgorithms from "./components/body/sortingAlgorithms/SortingAlgorithms";
import NavBar from "./components/header/navBar/NavBar";
import {Box, ThemeProvider} from "@mui/material";
import {theme} from "./utils/MuiTheme";
import Footer from "./components/footer/Footer";


function App() {
    return (
        <ThemeProvider theme={theme}>
            <Box
                minHeight={'100vh'}
                display={'flex'}
                flexDirection={'column'}>
                <NavBar/>
                <SortingAlgorithms/>
                <Footer/>
            </Box>
        </ThemeProvider>
    );
}

export default App;
