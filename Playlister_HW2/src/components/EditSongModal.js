import React, { Component } from 'react';

export default class EditSongModal extends Component {
    clickedEditSongConfirm = () => {
        let newTitle = document.getElementById("title-box").value
        let newArtist = document.getElementById("artist-box").value
        let newYTID = document.getElementById("id-box").value

        let newSong = {title: newTitle, artist: newArtist, youTubeId: newYTID}
        this.props.editSongCallback(this.props.songId, newSong)
    }

    render() {
        const { songId, song, editSongCallback, hideEditSongModalCallback } = this.props;
        let title = "";
        let artist = "";
        let youtubeID = "";
        
        if (song != null) {
            title = song.title
            artist = song.artist
            youtubeID = song.youTubeId

            document.getElementById("title-box").value = title
            document.getElementById("artist-box").value = artist
            document.getElementById("id-box").value = youtubeID
        }

        return (
            <div 
                class="modal" 
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Edit Song?
                        </div>
                        <div class="modal-center">
                            <div class="modal-textfield">Title: </div><input class="modal-textfield" type="text" id="title-box"></input>
                            <div class="modal-textfield">Artist: </div><input class="modal-textfield" type="text" id="artist-box"></input>
                            <div class="modal-textfield">You Tube Id: </div><input class="modal-textfield" type="text" id="id-box"></input>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-button" 
                                onClick={this.clickedEditSongConfirm}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-button" 
                                onClick={hideEditSongModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}