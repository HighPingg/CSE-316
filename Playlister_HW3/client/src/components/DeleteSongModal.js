import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    
    if (store.currentList && store.songMarkedForDeletion != null) {
        name = store.currentList.songs[store.songMarkedForDeletion].title;
    }
    function handleDeleteSong(event) {
        store.deleteMarkedSong();
    }
    function handleCloseModal(event) {
        store.hideDeleteSongModal();
    }

    return (
        <div 
            className="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-delete-song-root'>
                    <div className="modal-north">
                        Delete Song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to delete {name}?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="delete-song-confirm-button" 
                            className="modal-button" 
                            onClick={handleDeleteSong}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-song-cancel-button" 
                            className="modal-button" 
                            onClick={handleCloseModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteSongModal;