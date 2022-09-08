import jsTPS_Transaction from "../../common/jsTPS.js"
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initModel) {
        super();
        this.model = initModel;
    }

    doTransaction() {
        this.model.addNewSong("Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    
    undoTransaction() {
        this.model.removeLastSong();
    }
}