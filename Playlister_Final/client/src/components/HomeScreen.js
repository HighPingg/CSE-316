import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import NavigationBar from './NavigationBar'
import { Alert, AlertTitle, Dialog, Select } from '@mui/material'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import ContentPlayer from './ContentPlayer'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    // Apply search filters and sorts
    let displayedContent = store.idNamePairs;
    if (store.searchQuery === null) {
        displayedContent = [];
    }

    if (store.filter === 'home') {
        displayedContent = displayedContent.filter(pair => pair.username === auth.user.username && pair.name.toLowerCase().includes(store.searchQuery.toLowerCase()))
    } else if (store.filter === 'group') {
        displayedContent = displayedContent.filter(pair => pair.published !== -1 && pair.name.toLowerCase().includes(store.searchQuery.toLowerCase()));
    } else if (store.filter === 'self') {
        displayedContent = displayedContent.filter(pair => pair.username.toLowerCase().includes(store.searchQuery.toLowerCase()));
    }

    // Now we want to sort this content\
    if (displayedContent !== null && displayedContent.length !== 0) {
        if (store.sort === 'Creation Date' || store.sort === undefined) {
            displayedContent = displayedContent.sort((a, b) => {
                let aDate = new Date(a.createDate).getTime();
                let bDate = new Date(b.createDate).getTime();

                if (aDate > bDate) {
                    return 1;
                } else if (aDate === bDate) {
                    return 0;
                } else {
                    return -1;
                }
            });
        } else if (store.sort === 'Last Edit Date') {
            displayedContent = displayedContent.sort((a, b) => {
                let aDate = new Date(a.updateDate).getTime();
                let bDate = new Date(b.updateDate).getTime();

                if (aDate < bDate) {
                    return 1;
                } else if (aDate === bDate) {
                    return 0;
                } else {
                    return -1;
                }
            });
        } else if (store.sort === 'Name') {
            displayedContent = displayedContent.sort((a, b) => {
                let aDate = new Date(a.name).getTime();
                let bDate = new Date(b.name).getTime();

                if (aDate < bDate) {
                    return 1;
                } else if (aDate === bDate) {
                    return 0;
                } else {
                    return -1;
                }
            });
        } else if (store.sort === 'Likes') {
            displayedContent = displayedContent.sort((a, b) => {
                let aDate = new Date(a.likes.length).getTime();
                let bDate = new Date(b.likes.length).getTime();

                if (aDate < bDate) {
                    return 1;
                } else if (aDate === bDate) {
                    return 0;
                } else {
                    return -1;
                }
            });
        } else if (store.sort === 'Dislikes') {
            displayedContent = displayedContent.sort((a, b) => {
                let aDate = new Date(a.dislikes.length).getTime();
                let bDate = new Date(b.dislikes.length).getTime();

                if (aDate < bDate) {
                    return 1;
                } else if (aDate === bDate) {
                    return 0;
                } else {
                    return -1;
                }
            });
        } else if (store.sort === 'Listens') {
            displayedContent = displayedContent.sort((a, b) => {
                let aDate = new Date(a.listens).getTime();
                let bDate = new Date(b.listens).getTime();

                if (aDate < bDate) {
                    return 1;
                } else if (aDate === bDate) {
                    return 0;
                } else {
                    return -1;
                }
            });
        } else if (store.sort === 'Publish Date') {
            displayedContent = displayedContent.sort((a, b) => {
                let aDate = new Date(a.published).getTime();
                let bDate = new Date(b.published).getTime();

                if (aDate < bDate) {
                    return 1;
                } else if (aDate === bDate) {
                    return 0;
                } else {
                    return -1;
                }
            });
        }
    }

    console.log(auth.user)

    function handleCloseDialog() {
        store.closeAlertModal();
    }

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ height: '100%', width: '100%' }}>
            {
                displayedContent.map((pair) => (
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
                <ContentPlayer />
            </div>
                
            <div id="list-selector-heading">
                {
                    auth.user.username !== null ?
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
                    : ''
                }
                <Typography variant="h2" style={{fontSize: '25pt', fontWeight: 'bold'}}>Your Lists</Typography>
            </div>
            <MUIDeleteModal />
            <MUIEditSongModal />
            <MUIRemoveSongModal />
            <Dialog onClose={handleCloseDialog} open={store.errorModalMessage != null ? true : false}>
                <Alert severity='error'>
                    <AlertTitle>Error</AlertTitle>
                    {
                        store.errorModalMessage
                    }
                </Alert>
            </Dialog>
        </div>)
}

export default HomeScreen;