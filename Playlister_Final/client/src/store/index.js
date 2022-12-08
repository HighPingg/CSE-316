import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    CHANGE_VIDEO: "CHANGE_VIDEO",
    UPDATE_CURRENT_LIST: "UPDATE_CURRENT_LIST",
    CHANGE_PLAYING_LIST: "CHANGE_PLAYING_LIST",
    UPDATE_VIEW: "UPDATE_VIEW",
    ADD_VIEWERS_AND_PLAY: "ADD_VIEWERS_AND_PLAY",
    SET_SEARCH: "SET_SEARCH",
    SET_FILTER: "SET_FILTER",
    SET_SORT: "SET_SORT",
    SET_NAME_CLICK: "SET_NAME_CLICK",
    SEARCH_BAR_UPDATED: "SEARCH_BAR_UPDATED",
    RESET_STATE: "RESET_STATE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        videoPlayerIndex: null,
        videoPlayerPlaylist: null,
        searchQuery: '',
        filter: 'home',
        sort: 'Creation Date',
        nameClickFlag: false,
        justloggedIn: true
    });
    const history = useHistory();

    console.log("inside useGlobalStore");
    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: payload.newList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.justloggedIn && auth.user.username === null ? 'group' : store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn === true ? false : true
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.CHANGE_VIDEO: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: payload,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.UPDATE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.CHANGE_PLAYING_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: payload.songIndex,
                    videoPlayerPlaylist: payload.playlist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.UPDATE_VIEW: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.ADD_VIEWERS_AND_PLAY: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: payload.songIndex,
                    videoPlayerPlaylist: payload.playlist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.SET_SEARCH: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: payload,
                    filter: store.filter,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.SET_FILTER: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.nameClickFlag ? '' : store.searchQuery,
                    filter: payload,
                    nameClickFlag: false,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.SET_SORT: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    sort: payload,
                    nameClickFlag: store.nameClickFlag,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.SET_NAME_CLICK: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: payload,
                    filter: 'self',
                    sort: store.sort,
                    nameClickFlag: true,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.SEARCH_BAR_UPDATED: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    videoPlayerIndex: store.videoPlayerIndex,
                    videoPlayerPlaylist: store.videoPlayerPlaylist,
                    searchQuery: store.searchQuery,
                    filter: store.filter,
                    sort: store.sort,
                    nameClickFlag: false,
                    justloggedIn: store.justloggedIn
                });
            }
            case GlobalStoreActionType.RESET_STATE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: [],
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    newListCounter: 0,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    videoPlayerIndex: null,
                    videoPlayerPlaylist: null,
                    searchQuery: '',
                    filter: 'home',
                    sort: 'Creation Date',
                    nameClickFlag: false,
                    justloggedIn: true
                })
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
        tps.clearAllTransactions();
        history.push('/');
    }
    store.clearTransactions = function () {
        if (store.currentList !== null) {
            storeReducer({
                type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
                payload: {}
            });
            tps.clearAllTransactions();
        }
    }
    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.username, [], [], 0, -1, []);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            async function asyncLoadIdNamePairs() {
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    console.log(pairsArray)
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {newList: newList, pairsArray: pairsArray}
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            asyncLoadIdNamePairs();

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/");
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.duplicateCurrentList = async function () {
        if (store.currentList !== null) {
            let newListName = store.currentList.name;
            let newSongs = structuredClone(store.currentList.songs);
            let ownerEmail = auth.user.email;
            let ownerUsername = auth.user.username;
            const response = await api.createPlaylist(newListName, newSongs, ownerEmail, ownerUsername, [], [], 0, -1, []);
            console.log("createNewList response: " + response);
            if (response.status === 201) {
                tps.clearAllTransactions();
                let newList = response.data.playlist;
                async function asyncLoadIdNamePairs() {
                    const response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        console.log(pairsArray)
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: {newList: newList, pairsArray: pairsArray}
                        });
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                }
                asyncLoadIdNamePairs();

                // IF IT'S A VALID LIST THEN LET'S START EDITING IT
                history.push("/");
            }
            else {
                console.log("API FAILED TO CREATE A NEW LIST");
            }
        }
    }

    store.publishCurrentPlaylist = async function () {
        if (store.currentList != null) {
            let newPlaylist = structuredClone(store.currentList);
            newPlaylist.published = Date.now();

            async function asyncUpdateCurrentList() {
                const response = await api.updatePlaylistById(store.currentList._id, newPlaylist);
                if (response.data.success) {
                    store.refreshView();
                }
            }
            asyncUpdateCurrentList();
        }
    }

    store.likeSong = async function (id) {
        // Get the playlist, then add the like
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.published !== -1) {
                    // If the user is in dislike, then switch.
                    if (playlist.dislikes.includes(auth.user.username)) {
                        playlist.likes.push(auth.user.username);
                        playlist.dislikes = playlist.dislikes.filter(username => username !== auth.user.username);
                        console.log(playlist)

                        async function asyncUpdateCurrentList() {
                            const response = await api.updatePlaylistById(playlist._id, playlist);
                            if (response.data.success) {
                                store.refreshView();
                            }
                        }
                        asyncUpdateCurrentList();
                    
                    
                    // If the user isn't in likes, then add them.
                    } else if (!playlist.likes.includes(auth.user.username)) {
                        playlist.likes.push(auth.user.username);
                        console.log(playlist)

                        async function asyncUpdateCurrentList() {
                            const response = await api.updatePlaylistById(playlist._id, playlist);
                            if (response.data.success) {
                                store.refreshView();
                            }
                        }
                        asyncUpdateCurrentList();
                    }
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.dislikeSong = async function (id) {
        // Get the playlist, then add the like
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.published !== -1) {
                    // If the user is in like, then switch.
                    if (playlist.likes.includes(auth.user.username)) {
                        playlist.dislikes.push(auth.user.username);
                        playlist.likes = playlist.likes.filter(username => username !== auth.user.username);
                        console.log(playlist)

                        async function asyncUpdateCurrentList() {
                            const response = await api.updatePlaylistById(playlist._id, playlist);
                            if (response.data.success) {
                                store.refreshView();
                            }
                        }
                        asyncUpdateCurrentList();
                    
                    // If the user isn't in likes, then add them.
                    } else if (!playlist.dislikes.includes(auth.user.username)) {
                        playlist.dislikes.push(auth.user.username);
                        console.log(playlist)

                        async function asyncUpdateCurrentList() {
                            const response = await api.updatePlaylistById(playlist._id, playlist);
                            if (response.data.success) {
                                store.refreshView();
                            }
                        }
                        asyncUpdateCurrentList();
                    }
                }
            }
        }
        asyncSetCurrentList(id);
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            let response = '';
            if (auth.user.username !== null) {
                response = await api.getPlaylistPairs();
            } else {
                response = await api.public_getPlaylistPairs();
            }
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray)
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


    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.refreshView = function () {
        async function asyncLoadIdNamePairs() {
            let response = '';
            if (auth.user.username !== null) {
                response = await api.getPlaylistPairs();
            } else {
                response = await api.public_getPlaylistPairs();
            }
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray)

                async function asyncSetCurrentList() {
                    if (store.currentList !== null) {
                        let response = ''
                        if (auth != null && auth.user.username != null) {
                            response = await api.getPlaylistById(store.currentList._id);
                        }
                        else
                            response = await api.public_getPlaylistById(store.currentList._id)
                        
                        if (response.data.success) {
                            let playlist = response.data.playlist;
                            storeReducer({
                                type: GlobalStoreActionType.UPDATE_VIEW,
                                payload: {idNamePairs: pairsArray, currentList: playlist}
                            });
                        }
                    } else {
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_VIEW,
                            payload: {idNamePairs: pairsArray, currentList: store.currentList}
                        });
                    }
                }
                asyncSetCurrentList();
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.unmarkListForDeletion = function (id) {
        store.hideModals();
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.status === 200) {
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        tps.clearAllTransactions();

        async function asyncSetCurrentList(id) {
            let response = '';
            if (auth != null && auth.user.username != null) {
                response = await api.getPlaylistById(id);
            }
            else
                response = await api.public_getPlaylistById(id)
            
            if (response.data.success) {
                let playlist = response.data.playlist;

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
                history.push("/");
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }

    store.postComment = function (comment) {
        if (store.videoPlayerPlaylist != null) {
            let newPlaylist = structuredClone(store.videoPlayerPlaylist);
            newPlaylist.comments.push({commentUsername: auth.user.username, comment: comment})

            async function asyncUpdateCurrentList() {
                const response = await api.updatePlaylistById(store.videoPlayerPlaylist._id, newPlaylist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_PLAYING_LIST,
                        payload: {songIndex: store.videoPlayerIndex, playlist: newPlaylist}
                    });
                }
            }
            asyncUpdateCurrentList();
        }
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.changeVideo = function (index) {
        if (store.videoPlayerPlaylist === null || store.currentList != store.videoPlayerPlaylist) {
            let playingList = structuredClone(store.currentList);
            storeReducer({
                type: GlobalStoreActionType.CHANGE_PLAYING_LIST,
                payload: {songIndex: index, playlist: playingList}
            })

        } else {
            storeReducer({
                type: GlobalStoreActionType.CHANGE_VIDEO,
                payload: index
            });
        }
    }

    store.changePlayingPlaylist = function (id) {
        async function getListToDelete(id) {
            let response = '';
            if (auth.user.username !== null) {
                response = await api.getPlaylistById(id);
            } else {
                response = await api.public_getPlaylistById(id);
            }

            if (response.data.success) {
                let playlist = response.data.playlist;

                // If this user has never listened to the playlist and this playlist is published, then add them to listens
                if (playlist.published !== -1) {
                    playlist.listens += 1;

                    async function asyncUpdateCurrentList() {
                        const response = await api.public_updatePlaylistById(playlist._id, playlist);
                        if (response.data.success) {

                            // Get pairslist
                            async function asyncLoadIdNamePairs() {
                                let response = '';
                                if (auth.user.username !== null) {
                                    response = await api.getPlaylistPairs();
                                } else {
                                    response = await api.public_getPlaylistPairs();
                                }
                                if (response.data.success) {
                                    let pairsArray = response.data.idNamePairs;
                                    storeReducer({
                                        type: GlobalStoreActionType.ADD_VIEWERS_AND_PLAY,
                                        payload: {idNamePairs: pairsArray,
                                                songIndex: playlist.songs.length === 0 ? null : 0,
                                                playlist: playlist
                                        }
                                    });
                                }
                                else {
                                    console.log("API FAILED TO GET THE LIST PAIRS");
                                }
                            }
                            asyncLoadIdNamePairs();
                        }
                    }
                    asyncUpdateCurrentList();

                } else {
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_PLAYING_LIST,
                        payload: {songIndex: playlist.songs.length === 0 ? null : 0, playlist: playlist}
                    });
                }
            }
        }
        getListToDelete(id);
    }

    store.setSearch = function (query) {
        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH,
            payload: query
        });
    }

    store.setFilter = function (filter) {
        storeReducer({
            type: GlobalStoreActionType.SET_FILTER,
            payload: filter
        });
    }

    store.setSort = function (sort) {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT,
            payload: sort
        });
    }

    store.searchName = function (name) {
        storeReducer({
            type: GlobalStoreActionType.SET_NAME_CLICK,
            payload: name
        });
    }

    store.resetPlayer = function () {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_PLAYING_LIST,
            payload: {songIndex: null, playlist: null}
        });
    }

    store.searchBarUpdated = function () {
        storeReducer({
            type: GlobalStoreActionType.SEARCH_BAR_UPDATED,
            payload: null
        })
    }

    store.resetState = function () {
        storeReducer({
            type: GlobalStoreActionType.RESET_STATE,
            payload: null
        });
        tps.clearAllTransactions();
    }
 
    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };