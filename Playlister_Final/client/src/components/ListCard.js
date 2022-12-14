import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

import WorkspaceScreen from './WorkspaceScreen';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import AuthContext from '../auth';
import { Button } from '@mui/material';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PublishIcon from '@mui/icons-material/Publish';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { fontSize } from '@mui/system';

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
        event.stopPropagation();
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.changePlayingPlaylist(id);
        }
    }

    function handleDownArrow(event, id) {
        event.stopPropagation();
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

    function handleLike(event) {
        event.stopPropagation();
        store.likeSong(idNamePair._id);
    }

    function handleDislike(event) {
        event.stopPropagation();
        store.dislikeSong(idNamePair._id);
    }

    function handleDuplicate(event) {
        event.stopPropagation();
        store.duplicateCurrentList();
    }

    function handlePublish(event) {
        event.stopPropagation();
        store.publishCurrentPlaylist();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        if (idNamePair.published === -1 && store.currentList._id != idNamePair._id)
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

            // If id is the same, then we toggle otherwise we can change the name
            if (text == '') {
                toggleEdit();
            } else {
                store.changeListName(id, text, toggleEdit);
            }
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleClickName(event, name) {
        event.stopPropagation();
        store.searchName(name);
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
    }

    let undoStyle = store.canUndo() ? {} : {color: '#dedede'};
    let redoStyle = store.canRedo() ? {} : {color: '#dedede'};

    let playlistControls = '';
    if (store.currentList != null && store.currentList._id == idNamePair._id) {
        playlistControls = <Box sx={{height: 'fit-content', width: '100%', position: 'relative', marginTop: '10px', display: 'flex', justifyContent: 'space-between'}}>
            {
                // If the song isn't published, then we can output this stuff
                store.currentList.published === -1 && store.currentList.username === auth.user.username ?
                <Box sx={{width: 'fit-content', margin: '0px'}}>
                    <IconButton onClick={(event) => {event.stopPropagation(); store.undo()}}><UndoIcon style={undoStyle} /></IconButton>
                    <IconButton onClick={(event) => {event.stopPropagation(); store.redo()}}><RedoIcon style={redoStyle} /></IconButton>
                </Box> : ''
            }
            <Box style={{width: 'fit-content'}}>
            {
                // If the song isn't published, then we can output this stuff
                store.currentList.published === -1 && store.currentList.username === auth.user.username ?
                    <IconButton onClick={handleToggleEdit}><EditIcon /></IconButton>
                    : ''
            }
            {
                store.currentList.username === auth.user.username ?
                <IconButton onClick={(event) => handleDeleteList(event, idNamePair._id)}><DeleteIcon /></IconButton>
                : ''
            }
            {
                auth != null && auth.user.username != null ?
                <IconButton onClick={handleDuplicate}><ContentCopyIcon /></IconButton>
                : ''
            }
            {
                // If the song isn't published, then we can output this stuff
                store.currentList.published === -1 && store.currentList.username === auth.user.username ?
                <IconButton onClick={handlePublish}><PublishIcon /></IconButton>
                : ''
            }
            </Box>
        </Box>
    }

    let bottomControls = ""
    if (store.currentList !== null && store.currentList._id === idNamePair._id) {
        bottomControls = <IconButton sx={idNamePair.published === -1 ? {float: 'right'} : {}} onClick={(event) => {event.stopPropagation(); store.closeCurrentList();}}><KeyboardDoubleArrowUpIcon /></IconButton>
    } else {
        bottomControls = <IconButton sx={idNamePair.published === -1 ? {float: 'right'} : {}} onClick={(event) => handleDownArrow(event, idNamePair._id)}><KeyboardDoubleArrowDownIcon /></IconButton>
    }

    let thumbsUpStyle = idNamePair.likes.includes(auth.user.username) ? {color: '#7289da'} : {};
    let thumbsDownStyle = idNamePair.dislikes.includes(auth.user.username) ? {color: '#7289da'} : {};

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
                onDoubleClick={handleToggleEdit}
            >
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <Box sx={{ p: 1, flexGrow: 1 }}>
                        <span>{idNamePair.name}</span><br></br>
                        <span style={{fontSize: '10pt'}}>By <span onClick={(event) => handleClickName(event, idNamePair.username)} style={{color: '#7289da'}}>{idNamePair.username}</span></span>
                    </Box>

                    {
                        idNamePair.published != -1 ?
                            <Box sx={{float: 'right'}}>
                                <IconButton onClick={handleLike}><ThumbUpIcon style={thumbsUpStyle} /></IconButton>
                                <span>{idNamePair.likes.length}</span>
                                <IconButton onClick={handleDislike}><ThumbDownIcon style={thumbsDownStyle} /></IconButton>
                                <span>{idNamePair.dislikes.length}</span>
                            </Box> : ''
                    }
                </Box>
                {dropDown}
                {playlistControls}
                <Box sx={idNamePair.published === -1 ? {marginLeft: '15px', width: '100%'} : {marginLeft: '15px', display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    {
                        // If this is published, then we can output the published information
                        idNamePair.published !== -1 ?
                            <Box><span style={{fontSize: '8pt', textAlign: 'center'}} >Published:&nbsp;<span style={{color: '#7289da'}}>{new Date(idNamePair.published).toDateString().split(' ').slice(1).join(' ')}</span></span></Box>
                        : ''
                    }
                    {
                        // If this is published, then we can output the viewer information
                        idNamePair.published !== -1 ?
                            <Box><span style={{fontSize: '8pt', textAlign: 'center'}} >Listens:&nbsp;<span style={{color: '#7289da'}}>{idNamePair.listens}</span></span></Box>
                        : ''
                    }
                    {bottomControls}
                </Box>
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