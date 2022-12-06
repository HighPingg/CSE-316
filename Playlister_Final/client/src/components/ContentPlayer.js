import React, { useContext, useState } from "react";
import GlobalStoreContext from "../store";

import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import YouTube from "react-youtube";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { List, ListItem, TextField } from "@mui/material";

export default function ContentPlayer() {
    const { store } = useContext(GlobalStoreContext);
    const [ value, setValue ] = useState(0);
    const [ currentVideo, setCurrentVideo ] = useState('');
    const [ commentSection, setCommentSection ] = useState('');

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
    }
    
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function handleChangeTab(event, newValue) {
        setValue(newValue);
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    let opts = {
        width: '100%',
        height: '250',
        playerVars: {
            autoplay: 1,
        },
    }

    function handleOnPlayerReady(event) {
        setCurrentVideo(event.target);
    }

    function handleStateChange(event) {
        if (event.data === 0) {
            if ((store.currentList !== null && store.videoPlayerIndex !== null) && (store.videoPlayerIndex < store.currentList.songs.length - 1)) {
                store.changeVideo(store.videoPlayerIndex + 1);
            }
        }
    }

    function handlePause(event) {
        event.stopPropagation();
        if (currentVideo != '') {
            currentVideo.pauseVideo();
        }
    }

    function handlePlay(event) {
        event.stopPropagation();
        if (currentVideo != '') {
            currentVideo.playVideo();
        }
    }

    function handleForwards(event) {
        event.stopPropagation();
        if ((store.currentList !== null && store.videoPlayerIndex !== null) && (store.videoPlayerIndex < store.currentList.songs.length - 1)) {
            store.changeVideo(store.videoPlayerIndex + 1);
        }
    }

    function handleBackwards(event) {
        event.stopPropagation();
        if ((store.currentList !== null && store.videoPlayerIndex !== null) && (store.videoPlayerIndex > 0)) {
            store.changeVideo(store.videoPlayerIndex - 1);
        }
    }

    function handleCommentKey(event) {
        if (event.keyCode == 13) {
            store.postComment(commentSection);

            // Reset the comment box
            setCommentSection('');
        }
    }

    let currentPlayingSong = ''
    if (store.videoPlayerIndex !== null && store.currentList !== null && store.currentList.songs !== null) {
        currentPlayingSong = store.currentList.songs[store.videoPlayerIndex];
    }

    let displayPlayer = value == 0 ? 'relative' : 'none';
    let displayComments = value == 1 ? 'relative' : 'none';

    return (<Box sx={{ height: '65vh', width: '38vw', position: 'relative', marginLeft: '10px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab label="Player" {...a11yProps(0)} />
                <Tab label="Comments" {...a11yProps(1)} />
            </Tabs>
        </Box>
        <Box sx={{display: displayPlayer, width: '100%', height: '58vh', marginTop: '10px'}}>
            <YouTube videoId={currentPlayingSong.youTubeId} opts={opts} onReady={handleOnPlayerReady} onStateChange={handleStateChange} />
            <Box sx={{ width: '38vw', textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>Now Playing</span></Box>
            <Box sx={{height: 'fit-content', width: '100%'}}>
                <p>
                    <span style={{fontWeight: 'bold'}}>Playlist:</span> {store.currentList == null ? '' : store.currentList.name}<br />
                    <span style={{fontWeight: 'bold'}}>Song #:</span> {store.videoPlayerIndex == null ? '' : store.videoPlayerIndex + 1}<br />
                    <span style={{fontWeight: 'bold'}}>Title:</span> {currentPlayingSong == '' ? '' : currentPlayingSong.title}<br />
                    <span style={{fontWeight: 'bold'}}>Artist:</span> {currentPlayingSong == '' ? '' : currentPlayingSong.artist}<br />
                </p>
            </Box>
            <Box sx={{height: 'fit-content', width: '100%', textAlign: 'center'}}>
                <IconButton onClick={handleBackwards}><SkipPreviousIcon /></IconButton>
                <IconButton onClick={handlePause}><StopIcon /></IconButton>
                <IconButton onClick={handlePlay}><PlayArrowIcon /></IconButton>
                <IconButton onClick={handleForwards}><SkipNextIcon /></IconButton>
            </Box>
        </Box>
        <Box sx={{display: displayComments, width: '100%', height: '58vh', marginTop: '10px'}}>
            <List sx={{ height: '49vh', width: '100%', overflow: 'scroll' }}>
                {
                    store.currentList != null ?
                    store.currentList.comments.map((comment, index) => (
                        <ListItem
                            sx={{ marginTop: '15px', p: 1}}
                            style={{ height: 'fit-content', width: '100%', fontSize: '10pt', backgroundColor: 'white', borderRadius: '20px' }}>
                                <Box sx={{ margin: '10px', width: '95%', wordWrap: 'break-word' }}>
                                    <span style={{color: '#7289da'}}>{comment.commentUsername}</span>
                                    <span>:&nbsp;</span>
                                    <span>{comment.comment}</span>
                                </Box>
                        </ListItem>
                    )) : ''
                }
            </List>
            <TextField sx={{ bgcolor: 'white', width: '100%' }} label="Comment" variant="outlined" value={commentSection} onChange={(event) => setCommentSection(event.target.value)} onKeyDown={handleCommentKey} />
        </Box>
    </Box>);
}