import axios from 'axios';
import { setAlert } from './alert';
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
} from './types';

import setAuthToken from '../utils/setAuthToken';
//load user

export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try{
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
        
    } catch(err){
        dispatch({
            type: AUTH_ERROR
        });
    }
}

//load the quote

export const loadQuote = (buyStockName) => async dispatch => {

    const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + String(buyStockName) + '&apikey=O62I6TVUDNKKIQ8T';

    try{

        const res = await axios.get(url);
        
        
        dispatch({
            type: QUOTE_LOADED,
            quote: Number(res.data[0]['Global Quote']['05. price'])
        });
        dispatch(setAlert("Quote loaded", "success"));
    } catch(err){
        
        dispatch({
            type: QUOTE_LOAD_ERROR,
            quote: null
        });
        dispatch(setAlert("Unable to load quote, check your internet connection", "danger"));
    }
}

//add the stocks

export const addStock = ({email, buyStockName, buyQuantity, price}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ buyStockName, buyQuantity });

    try {
        const res = await axios.post('/api/stocks/add/' + buyStockName + '/' + buyQuantity, body, config);
        dispatch(setAlert("Stock added to your portfolio!", 'success', 50000));
        dispatch(updateMoney(email, -price));
        

    } catch(err) {
        dispatch(setAlert("Unable to add the stock", 'danger', 50000));
    }
}


//Register
export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password });

    try{
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type:REGISTER_SUCCESS,
            payload: res.data
        });
        
        dispatch(loadUser());
    } catch(err){
        const errors = err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        });

    }
}

//login

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try{
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type:LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch(err){
        const errors = err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAIL
        });

    }
};

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
};



export const updateMoney = (email, money) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = await JSON.stringify({ email });

    //console.log(body);
    
    try{
        //.log("money is: "+ money);
        const res = await axios.post('/api/balance/'+ money , body, config);
        dispatch(setAlert("Balance updated!", 'success', 50000));

        dispatch({
            type:UPDATE_MONEY,
            payload: res.data
        });

        dispatch(loadUser());
    } catch(err){
      const errors = err;
      dispatch(setAlert("Balance update failed!", 'danger', 50000));

       // if(errors){
           // errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        //}
        dispatch({
            type: UPDATE_MONEY_FAIL
        }); 

    }

};
