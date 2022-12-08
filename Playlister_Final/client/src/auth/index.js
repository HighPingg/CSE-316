import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'
import { GlobalStoreContext } from "../store";

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    ACCOUNT_FAILURE: "ACCOUNT_FAILURE",
    ACKNOWLEDGED_FAILURE: "ACKNOWLEDGED_FAILURE",
    CONTINUE_GUEST: "CONTINUE_GUEST"
}

function AuthContextProvider(props) {
    const { store } = useContext(GlobalStoreContext);

    const [auth, setAuth] = useState({
        errorMsg: null,
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.ACCOUNT_FAILURE: {
                return setAuth({
                    errorMsg: payload
                })
            }
            case AuthActionType.ACKNOWLEDGED_FAILURE: {
                return setAuth({
                    errorMsg: null
                })
            }
            case AuthActionType.CONTINUE_GUEST: {
                return setAuth({
                    loggedIn: true,
                    user: {username: null}
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(firstName, lastName, email, username, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, email, username, password, passwordVerify);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        } catch (e) {
            authReducer({
                type: AuthActionType.ACCOUNT_FAILURE,
                payload: e.response.data.errorMessage
            })
        }
    }

    auth.loginUser = async function(email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        } catch (e) {
            authReducer({
                type: AuthActionType.ACCOUNT_FAILURE,
                payload: e.response.data.errorMessage
            })
        }
    }

    auth.acknowledgedError = function() {
        authReducer({
            type: AuthActionType.ACKNOWLEDGED_FAILURE
        })
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user && auth.user.username !== null) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        } else {
            initials = "G"
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.continueAsGuest = function () {
        authReducer({
            type: AuthActionType.CONTINUE_GUEST,
            payload: null
        });
        history.push("/")
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };