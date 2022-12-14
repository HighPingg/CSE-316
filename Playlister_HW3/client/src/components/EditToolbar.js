import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory, useLocation } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleAddSong() {
        if (store.currentList) {
            store.addNewSongTransaction();
        }
    }
    function handleUndo() {
        if (store.currentList) {
            store.undo();
        }
    }
    function handleRedo() {
        if (store.currentList) {
            store.redo();
        }
    }
    function handleClose() {
        if (store.currentList) {
            history.push("/");
            store.closeCurrentList();
        }
    }
    let editStatus = false;
    if (!store.editingPlaylist || store.modalOpen) {
        editStatus = true;
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus}
                value="+"
                className={enabledButtonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={editStatus || !store.hasUndo}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={editStatus || !store.hasRedo}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;