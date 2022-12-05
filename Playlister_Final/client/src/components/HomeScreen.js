import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import NavigationBar from './NavigationBar'
import { Select } from '@mui/material'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ height: '100%', width: '100%' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>
    }
    return (
        <div id="playlist-selector">
            <NavigationBar />
            <div id="content-container">
                <div id="list-selector-list">
                    {
                        listCard
                    }
                </div>
            </div>
                
            <div id="list-selector-heading">
                <Fab 
                    size='small'
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                    style={{marginRight: '10px'}}
                >
                    <AddIcon />
                </Fab>
                <Typography variant="h2" style={{fontSize: '25pt', fontWeight: 'bold'}}>Your Lists</Typography>
            </div>
            <MUIDeleteModal />
        </div>)
}

export default HomeScreen;