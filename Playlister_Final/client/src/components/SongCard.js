import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        event.stopPropagation();
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        event.stopPropagation();
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 1) {
            store.changeVideo(index);
        } else if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
    }

    let cardClass = "list-card unselected-list-card";
    let songCard = store.currentList !== null && store.currentList.published === -1 ?
                    <div
                        key={index}
                        id={'song-' + index + '-card'}
                        className={cardClass}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        draggable="true"
                        onClick={handleClick}
                    >
                        {index + 1}.
                        <a
                            id={'song-' + index + '-link'}
                            className="song-link"
                            href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                            {song.title} by {song.artist}
                        </a>
                        <input
                            type="button"
                            id={"remove-song-" + index}
                            className="list-card-button"
                            value={"\u2715"}
                            onClick={handleRemoveSong}
                        />
                    </div>
                :
                    <div
                        key={index}
                        id={'song-' + index + '-card'}
                        onClick={(event) => {event.stopPropagation(); store.changeVideo(index)}}
                        style={store.videoPlayerIndex === index && store.videoPlayerPlaylist._id === store.currentList._id ? {color: 'white', backgroundColor: '#7289da', margin: '10px', borderRadius: '20px', padding: '8px'} : {color: 'white', backgroundColor: '#99aab5', margin: '10px', borderRadius: '20px', padding: '8px'}}
                    >
                        {index + 1}.
                        <a
                            id={'song-' + index + '-link'}
                            className="song-link"
                            href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                            {song.title} by {song.artist}
                        </a>
                    </div>

    return (songCard);
}

export default SongCard;