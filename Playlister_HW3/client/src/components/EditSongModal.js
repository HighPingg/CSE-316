import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    
    if (store.currentList && store.songMarkedForEdit != null) {
        let song = store.currentList.songs[store.songMarkedForEdit]

        document.getElementById("title-box").value = song.title
        document.getElementById("artist-box").value = song.artist
        document.getElementById("id-box").value = song.youTubeId
    }
    function handleEditSong(event) {
        let newTitle = document.getElementById("title-box").value
        let newArtist = document.getElementById("artist-box").value
        let newYTID = document.getElementById("id-box").value

        let newSong = {title: newTitle, artist: newArtist, youTubeId: newYTID}
        store.editMarkedSong(newSong);
    }
    function handleCloseModal(event) {
        store.hideEditSongModal();
    }

    return (
        <div 
            className="modal" 
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-edit-song-root'>
                    <div className="modal-north">
                        Edit Song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            <div className="modal-textfield">Title: </div><input className="modal-textfield" type="text" id="title-box"></input>
                            <div className="modal-textfield">Artist: </div><input className="modal-textfield" type="text" id="artist-box"></input>
                            <div className="modal-textfield">You Tube Id: </div><input className="modal-textfield" type="text" id="id-box"></input>
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="edit-song-confirm-button" 
                            className="modal-button" 
                            onClick={handleEditSong}
                            value='Confirm' />
                        <input type="button" 
                            id="edit-song-cancel-button" 
                            className="modal-button" 
                            onClick={handleCloseModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default EditSongModal;