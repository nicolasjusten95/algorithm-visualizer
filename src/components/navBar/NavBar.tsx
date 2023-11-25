import {
    AppBar,
    Box,
    Button,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import React, {MouseEvent, useState} from "react";
import {Page} from "../../api/NavBarApi";
import SettingsIcon from '@mui/icons-material/Settings';
import SortIcon from '@mui/icons-material/Sort';


const title: string = 'Algorithm Visualizer';
const icon: JSX.Element = <BarChartIcon/>;
const pages: Page [] = [
    {name: 'Sorting Algorithms', icon: <SortIcon/>, key: 1},
    {name: 'Settings', icon: <SettingsIcon/>, key: 2}
];

const NavBar = () => {

    const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);

    const onOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorNav(event.currentTarget);
    };

    const onCloseMenu = () => {
        setAnchorNav(null);
    };

    const getButtonFromPage = (page: Page): JSX.Element => {
        return <Button key={page.key} startIcon={page.icon} color={'inherit'}>
            <Typography>{page.name}</Typography>
        </Button>;
    };

    const getMenuItemFromPage = (page: Page): JSX.Element => {
        return <MenuItem>
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText>
                <Typography>{page.name}</Typography>
            </ListItemText>
        </MenuItem>
    };

    return (
        <AppBar position='static'>
            <Toolbar>
                {/*Desktop*/}
                <IconButton size={'large'} edge={'start'} color={'inherit'} aria-label={'logo'}
                            sx={{display: {xs: 'none', md: 'flex'}}}>
                    {icon}
                </IconButton>
                <Typography variant={'h6'} component={'div'} sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                    {title}
                </Typography>
                <Stack sx={{display: {xs: 'none', md: 'flex'}}} direction={'row'} spacing={2}>
                    {pages.map((page) => getButtonFromPage(page))}
                </Stack>
                {/*Mobile*/}
                <IconButton size={'large'} color={'inherit'} aria-label={'logo'}
                            sx={{display: {xs: 'flex', md: 'none'}}}>
                    {icon}
                </IconButton>
                <Typography variant={'h6'} component={'div'} sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                    {title}
                </Typography>
                <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                    <IconButton size={'large'} edge={'start'} color={'inherit'} onClick={onOpenMenu}>
                        <MenuIcon/>
                    </IconButton>
                    <Menu open={Boolean(anchorNav)} onClose={onCloseMenu} anchorEl={anchorNav}
                          sx={{display: {xs: 'flex', md: 'none'}}}>
                        <MenuList>
                            {pages.map((page) => getMenuItemFromPage(page))}
                        </MenuList>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
