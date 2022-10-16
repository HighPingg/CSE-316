import jsTPS_Transaction from "../common/jsTPS.js"
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
    constructor(initStore, index, song) {
        super();
        this.store = initStore;
        this.index = index;
        this.song = song;
    }

    doTransaction() {
        this.store.deleteSong(this.index);
    }
    
    undoTransaction() {
        this.store.insertSong(this.index, this.song);
    }
}