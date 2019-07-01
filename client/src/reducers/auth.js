import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL, 
    LOGOUT,
    UPDATE_MONEY,
    UPDATE_MONEY_FAIL,
    QUOTE_LOADED,
    QUOTE_LOAD_ERROR
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
}

export default function(state = initialState, action) {
    const { type, payload, moneyUpdate, quote } = action;
    
    switch(type){
        case USER_LOADED:
        case UPDATE_MONEY:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload

            }

        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                user: payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false
            }

        case UPDATE_MONEY_FAIL:
        case QUOTE_LOAD_ERROR:
            return {
                ...state,
                price: null
            }
        case QUOTE_LOADED:
            return {
                ...state,
                price: quote

            }
        default:
            return state;
    }
}