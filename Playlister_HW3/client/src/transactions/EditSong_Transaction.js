import jsTPS_Transaction from "../common/jsTPS.js"
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
    constructor(initStore, index, oldSong, newSong) {
        super();
        this.store = initStore;
        this.index = index;
        this.oldSong = oldSong;
        this.newSong = newSong;
    }

    doTransaction() {
        this.store.updateSong(this.index, this.newSong);
    }
    
    undoTransaction() {
        this.store.updateSong(this.index, this.oldSong);
    }
}