import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction';

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
    MARK_SONG_FOR_EDIT: "MARK_SONG_FOR_EDIT"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        songMarkedForDeletion: null,
        songMarkedForEdit: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: null,
                    songMarkedForEdit: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    songMarkedForDeletion: null,
                    songMarkedForEdit: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            // PREPARE TO DELETE A SONG
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: payload.id,
                    songMarkedForEdit: null
                })
            }
            // PREPARE TO EDIT A SONG
            case GlobalStoreActionType.MARK_SONG_FOR_EDIT: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: null,
                    songMarkedForEdit: payload.id
                })
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    songMarkedForDeletion: null,
                    songMarkedForEdit: null
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        if (tps.hasTransactionToUndo) {
            tps.undoTransaction();
        }
    }
    store.redo = function () {
        if (tps.hasTransactionToRedo) {
            tps.doTransaction();
        }
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.createNewList = function () {
        async function asyncAddNewList() {
            let newListName = 'Untitled' + store.newListCounter;
            let payload = { name: newListName, songs: []}

            const response = await api.createPlaylist(payload);
            if (response.data.success) {
                // Register the new playlist
                let playlist = response.data.playlist
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
                });

                // Start editing afterwards
                store.history.push("/playlist/" + playlist._id);
            } else {
                console.log('API Failed to Create New List.');
            }
        }
        asyncAddNewList();
    }

    store.markListForDeletion = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
        store.showDeleteListModal();
    }

    store.deleteMarkedList = function() {
        async function deleteList(id) {
            let response = await api.deleteList(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                store.history.push('/')
            }
        }
        deleteList(store.currentList._id);
        store.hideDeleteListModal();
    }
    store.showDeleteListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    store.hideDeleteListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    store.addNewSongTransaction = function () {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addNewSong = function(title, artist, youtubeID) {
        // Copy current songs list and append new song to end
        let updatedList = Array.from(store.currentList.songs)
        updatedList.push({title: title, artist: artist, youTubeId: youtubeID})

        let newCurrentList = Object.assign({}, store.currentList)
        newCurrentList.songs = updatedList

        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                async function getListPairs(playlist) {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CHANGE_LIST_NAME,
                            payload: {
                                idNamePairs: pairsArray,
                                playlist: playlist
                            }
                        });
                    }
                }
                getListPairs(playlist);
            }
        }
        updateList(newCurrentList);
    }

    store.deleteLastSong = function () {
        store.deleteSong(store.currentList.songs.length);
    }

    store.markSongForDeletion = function (index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: { id: index }
        });

        store.showDeleteSongModal();
    }

    store.deleteMarkedSong = function () {
        let song = store.currentList.songs[store.songMarkedForDeletion];
        let transaction = new RemoveSong_Transaction(store, store.songMarkedForDeletion, song);
        tps.addTransaction(transaction);

        store.hideDeleteSongModal();
    }

    store.deleteSong = function (index) {
        // Copy current songs list and append new song to end
        let updatedList = Array.from(store.currentList.songs)
        updatedList.splice(index, 1)

        let newCurrentList = Object.assign({}, store.currentList)
        newCurrentList.songs = updatedList

        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                async function getListPairs(playlist) {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CHANGE_LIST_NAME,
                            payload: {
                                idNamePairs: pairsArray,
                                playlist: playlist
                            }
                        });
                    }
                }
                getListPairs(playlist);
            }
        }
        updateList(newCurrentList);
    }

    store.insertSong = function(index, song) {
        // Copy current songs list and append new song to end
        async function getPlaylists() {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let updatedList = response.data.playlist.songs;
                updatedList.splice(index, 0, song);

                console.log(updatedList)

                let newCurrentList = response.data.playlist
                newCurrentList.songs = updatedList

                async function updateList(playlist) {
                    let response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(newCurrentList);
            }
        }
        getPlaylists();
    }

    store.showDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }
    store.hideDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }


    store.markSongForEdit = function (index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDIT,
            payload: { id: index }
        });

        store.showEditSongModal();
    }

    store.editMarkedSong = function (newSong) {
        let oldSong = store.currentList.songs[store.songMarkedForEdit];
        let transaction = new EditSong_Transaction(store, store.songMarkedForEdit, oldSong, newSong);
        tps.addTransaction(transaction);

        store.hideEditSongModal();
    }

    store.updateSong = function(index, song) {
        async function getPlaylists() {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                // Copy current songs list and append new song to end
                let updatedList = response.data.playlist.songs;
                updatedList.splice(index, 1, song);

                let newCurrentList = response.data.playlist
                newCurrentList.songs = updatedList

                async function updateList(playlist) {
                    let response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(newCurrentList);
            }
        }
        getPlaylists();
    }

    store.showEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }
    store.hideEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    store.moveSongTransaction = function (targetId, sourceId) {
        let transaction = new MoveSong_Transaction(store, sourceId, targetId);
        tps.addTransaction(transaction);
    }

    store.moveSong = function (targetId, sourceId) {
        async function getPlaylists() {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                // Copy current songs list and append new song to end
                let updatedList = response.data.playlist.songs;
                updatedList.splice(targetId, 0, updatedList.splice(sourceId, 1)[0]);

                let newCurrentList = response.data.playlist;
                newCurrentList.songs = updatedList

                async function updateList(playlist) {
                    let response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(newCurrentList);
            }
        }

        getPlaylists();
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}