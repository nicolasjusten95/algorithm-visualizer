import React from 'react';
import SortingAlgorithms from "./components/body/sortingAlgorithms/SortingAlgorithms";
import Header from "./components/header/Header";
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
                <Header/>
                <SortingAlgorithms/>
                <Footer/>
            </Box>
        </ThemeProvider>
    );
}

export default App;
