import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    function handleDragStart(event) {
        event.dataTransfer.setData('song', event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
    }

    function handleDragLeave(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();

        let target = event.target;
        let targetId = target.id;
        targetId = targetId.split('-')[1];
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.split('-')[1];

        store.moveSongTransaction(targetId, sourceId);
    }

    function handleDeleteSong(event) {
        event.stopPropagation();
        store.markSongForDeletion(index);
    }

    function handleEditSong(event) {
        store.markSongForEdit(index);
    }

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDoubleClick={handleEditSong}
            draggable='true'
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
                onClick={handleDeleteSong}
            />
        </div>
    );
}

export default SongCard;