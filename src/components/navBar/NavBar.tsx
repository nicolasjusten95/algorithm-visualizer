import {AppBar, Button, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';


const NavBar = () => {
    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton size={'large'} edge={'start'} color={'inherit'} aria-label={'logo'}>
                    <BarChartIcon />
                </IconButton>
                <Typography variant={'h6'} component={'div'} sx={{flexGrow: 1}}>
                    Algorithm Visualizer
                </Typography>
                <Stack direction={'row'} spacing={2}>
                    <Button color={'inherit'}>Home</Button>
                    <Button color={'inherit'}>Sorting Algorithms</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
