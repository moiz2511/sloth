import {combineReducers} from 'redux';
import user from './userReducer';
import form from './formReducer';

export default combineReducers({
    user,
    form
});
