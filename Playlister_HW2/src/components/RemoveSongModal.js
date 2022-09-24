import React, { Component } from 'react';

export default class RemoveSongModal extends Component {
    removeSongHandler = () => {
        this.props.removeSongCallback(this.props.index);
    }

    render() {
        const { index, song, removeSongCallback, hideRemoveSongModalCallback } = this.props;
        let name = "";
        if (index != null && song != null && song.title != null) {
            name = song.title;
        }
        return (
            <div 
                class="modal" 
                id="remove-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Delete song?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                                Are you sure you wish to permanently remove {name} from the playlist?
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="remove-song-confirm-button" 
                                class="modal-button" 
                                onClick={this.removeSongHandler}
                                value='Confirm' />
                            <input type="button" 
                                id="remove-song-cancel-button" 
                                class="modal-button" 
                                onClick={hideRemoveSongModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}