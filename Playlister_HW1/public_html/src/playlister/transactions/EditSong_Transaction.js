import jsTPS_Transaction from "../../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initModel, index, oldSong, newSong) {
        super();
        this.model = initModel;
        this.index = index;
        this.oldSong = oldSong;
        this.newSong = newSong;
    }

    doTransaction() {
        this.model.updateSong(this.index, this.newSong.title, this.newSong.artist, this.newSong.youTubeId);
    }
    
    undoTransaction() {
        this.model.updateSong(this.index, this.oldSong.title, this.oldSong.artist, this.oldSong.youTubeId);
    }
}