import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

import WorkspaceScreen from './WorkspaceScreen';

import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import AuthContext from '../auth';
import { Button } from '@mui/material';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }
    function handleDuplicate(event) {
        event.stopPropagation();
        // TODO
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let dropDown = ""
    if (store.currentList != null && store.currentList._id == idNamePair._id) {
        dropDown = <WorkspaceScreen />
        console.log(dropDown)
    }

    let playlistControls = '';
    if (store.currentList != null && store.currentList._id == idNamePair._id) {
        if (store.currentList.username === auth.user.username) {
            playlistControls = <Box sx={{height: 'fit-content', width: '100%', position: 'relative', marginTop: '10px'}}>
                <Button onClick={(event) => {event.stopPropagation(); store.undo()}}>Undo</Button>
                <Button onClick={(event) => {event.stopPropagation(); store.redo()}}>Redo</Button>
                <Button onClick={handleToggleEdit}>Rename</Button>
                <Button onClick={(event) => handleDeleteList(event, idNamePair._id)}>Delete</Button>
                <Button onClick={handleDuplicate}>Duplicate</Button>
            </Box>
        }
    }

    let cardElement =
        <Box style={{backgroundColor: 'white', borderRadius: '20px'}}>
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ marginTop: '15px', display: 'flex', p: 1, flexDirection: 'column' }}
                style={{ height: 'fit-content', width: '100%', fontSize: '15pt', backgroundColor: 'background.paper', borderRadius: '20px' }}
                button
                onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ p: 1, flexGrow: 1 }}>
                        <span>{idNamePair.name}</span><br></br>
                        <span style={{fontSize: '10pt'}}>By <span style={{color: '#7289da'}}>{idNamePair.username}</span></span>
                    </Box>
                </Box>
                {dropDown}
                {playlistControls}
            </ListItem>
        </Box>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;