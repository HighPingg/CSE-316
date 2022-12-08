import React, { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import AuthContext from '../auth';

import HomeIcon from '@mui/icons-material/Home'
import { IconButton, MenuItem, useFormControl } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function NavigationBar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [sort, setSort] = useState('Creation Date');
    const [searchQuery, setsearchQuery] = useState('');

    let iconButtonStyle = {
        margin: '3px'
    }

    function handleChangeSort(event) {
        setSort(event.target.value);
        store.setSort(event.target.value);
    }
    
    function handleSearchKey(event) {
        if (event.keyCode == 13) {
            store.setSearch(searchQuery);
        }
    }

    function handleHome(event) {
        event.stopPropagation();
        if (auth.user.username !== null)
            store.setFilter("home");
    }

    function handleGroups(event) {
        event.stopPropagation();
        store.setFilter("group");
    }

    function handleSelf(event) {
        event.stopPropagation();
        store.setFilter("self");
    }

    let homeIconStyle = store.filter === 'home' ? {color: '#7289da'} : {};
    let groupIconStyle = store.filter === 'group' ? {color: '#7289da'} : {};
    let personIconStyle = store.filter === 'self' ? {color: '#7289da'} : {};

    return (<Box id="navbar" style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <Box>
            <IconButton style={iconButtonStyle} onClick={handleHome} ><HomeIcon size="large" style={homeIconStyle} /></IconButton>
            <IconButton style={iconButtonStyle} onClick={handleGroups} ><GroupsIcon size="large" style={groupIconStyle} /></IconButton>
            <IconButton style={iconButtonStyle} onClick={handleSelf}><PersonIcon size="large" style={personIconStyle} /></IconButton>
        </Box>
        <TextField id="search-box" label="Seach" variant="filled" style={{width: '40%'}} onChange={(event) => setsearchQuery(event.target.value)} onKeyDown={handleSearchKey} />
        <Box>
            <span>Sort By:</span>
            {
                store.filter === 'home' ? 
                    <Select
                        id="select-sort"
                        value={sort}
                        label=""
                        onChange={handleChangeSort}
                        style={{width: '10vw', marginRight: '20px', marginLeft: '10px'}}
                    >
                        <MenuItem value='Creation Date'>Creation Date (Old - New)</MenuItem>
                        <MenuItem value='Last Edit Date'>Last Edit Date (New - Old)</MenuItem>
                        <MenuItem value='Name'>Names (A - Z)</MenuItem>
                    </Select>
                :
                    <Select
                        id="select-sort"
                        value={sort}
                        label=""
                        onChange={handleChangeSort}
                        style={{width: '10vw', marginRight: '20px', marginLeft: '10px'}}
                    >
                        <MenuItem value='Name'>Names (A - Z)</MenuItem>
                        <MenuItem value='Likes'>Likes (High - Low)</MenuItem>
                        <MenuItem value='Dislikes'>Dislikes(High - Low)</MenuItem>
                        <MenuItem value='Listens'>Listens (High - Low)</MenuItem>
                        <MenuItem value='Publish Date'>Publish Date (New - Old)</MenuItem>
                    </Select>
            }
        </Box>
    </Box>);
}