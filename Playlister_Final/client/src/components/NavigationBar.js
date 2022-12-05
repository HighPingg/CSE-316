import React, { useContext, useState } from 'react'

import HomeIcon from '@mui/icons-material/Home'
import { IconButton, MenuItem } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';

export default function NavigationBar() {
    const [sort, setSort] = useState('Name');

    let iconButtonStyle = {
        margin: '3px'
    }

    function handleChangeSort(event) {
        setSort(event.target.value);
    }
    console.log(sort)
    return (<div id="navbar">
        <IconButton style={iconButtonStyle}><HomeIcon size="large"></HomeIcon></IconButton>
        <IconButton style={iconButtonStyle}><GroupsIcon size="large"></GroupsIcon></IconButton>
        <IconButton style={iconButtonStyle}><PersonIcon size="large"></PersonIcon></IconButton>

        <TextField id="search-box" label="Seach" variant="filled" />
        <span>Sort By:</span>
        <Select
            id="select-sort"
            value={sort}
            label=""
            onChange={handleChangeSort}
        >
            <MenuItem value='Name'>Name</MenuItem>
            <MenuItem value='Date'>Publish Date</MenuItem>
            <MenuItem value='Likes'>Likes</MenuItem>
            <MenuItem value='Dislikes'>Dislikes</MenuItem>
        </Select>
    </div>);
}