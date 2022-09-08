import jsTPS_Transaction from "../../common/jsTPS.js"
/**
 * RemoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(initModel, index, song) {
        super();
        this.model = initModel;
        this.index = index;
        this.song = song;
    }

    doTransaction() {
        this.model.removeSong(this.index);
    }
    
    undoTransaction() {
        this.model.insertSong(this.index, this.song);
    }
}