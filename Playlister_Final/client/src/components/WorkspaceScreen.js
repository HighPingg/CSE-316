import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    
    return (
        <Box sx={{height: 'fit-content', width: '100%', position: 'relative'}}>
        <List 
            id="playlist-cards" 
            sx={{ height: 'fit-content', width: '100%', bgcolor: 'background.paper' }}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))
            }
            <div
            className="list-card unselected-list-card"
            onClick={ () => store.addNewSong() }
            style={{color: 'black'}}
            >+
            </div>
         </List>
         </Box>
    )
}

export default WorkspaceScreen;