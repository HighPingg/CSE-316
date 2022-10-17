import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import { GlobalStoreContext } from '../store'
import DeleteSongModal from './DeleteSongModal.js'
import EditSongModal from './EditSongModal.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    let detectKeyDown = function (key) {
        if (key.ctrlKey) {
            if (key.key === 'z' || key.key == 'Z') {
                store.undo();
            } else if (key.key === 'y' || key.key == 'Y') {
                store.redo();
            }
        }
    }

    if (store.currentList === null) {
        store.history.push('/');
        return null;
    } else {
        return (
            <div id="playlist-cards"
                 onKeyDown={detectKeyDown}
                 tabIndex='0'>
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
                <DeleteSongModal />
                <EditSongModal />
            </div>
        )
    }
}

export default PlaylistCards;