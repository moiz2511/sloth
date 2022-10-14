import axios from 'axios';
import {userConstants, apiUrl} from '../constants';


export const doLogin = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.post(`${apiUrl}login`, data)
            .then(({data}) => {
                if (data.status) {
                    dispatch(success(data.data));
                    localStorage.setItem('user_data', JSON.stringify({
                        id: data.data._id,
                        name: data.data.name,
                        email: data.data.email
                    }));
                } else {
                    dispatch(failure(data.message));
                }
            })
            .catch(error => {
                throw(error);
                dispatch(failure(error.message));
            });
    }

    function request() {
        return {type: userConstants.LOGIN_REQUEST}
    }

    function success(data) {
        return {type: userConstants.LOGIN_SUCCESS, data}
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error}
    }
};

export const submitUserData = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.post(`${apiUrl}addUserData`, data)
            .then(({data}) => {
                if (data.status) {
                    dispatch(success(null));
                } else {
                    dispatch(failure(data.message));
                }
            })
            .catch(error => {
                throw(error);
                dispatch(failure(error.message));
            });
    }

    function request() {
        return {type: userConstants.USERDATA_SUBMIT_REQUEST}
    }

    function success(data) {
        return {type: userConstants.USERDATA_SUBMIT_SUCCESS, data}
    }

    function failure(error) {
        return {type: userConstants.USERDATA_SUBMIT_FAILURE, error}
    }
};

export const updateUserData = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.post(`${apiUrl}updateUserData`, data)
            .then(({data}) => {
                if (data.status) {
                    dispatch(success(data.data));
                } else {
                    dispatch(failure(data.message));
                }
            })
            .catch(error => {
                throw(error);
                dispatch(failure(error.message));
            });
    }

    function request() {
        return {type: userConstants.USERDATA_UPDATE_REQUEST}
    }

    function success(data) {
        return {type: userConstants.USERDATA_UPDATE_SUCCESS, data}
    }

    function failure(error) {
        return {type: userConstants.USERDATA_UPDATE_FAILURE, error}
    }
};


export const userDataList = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.get(`${apiUrl}userDataList`)
            .then(({data}) => {
                if (data.status) {
                    dispatch(success(data.data));
                } else {
                    dispatch(failure(data.message));
                }
            })
            .catch(error => {
                throw(error);
                dispatch(failure(error.message));
            });
    }

    function request() {
        return {type: userConstants.USERDATA_LIST_REQUEST};
    }

    function success(data) {
        return {type: userConstants.USERDATA_LIST_SUCCESS, data};
    }

    function failure(error) {
        return {type: userConstants.USERDATA_LIST_FAILURE, error};
    }
};

export const deleteUserData = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.post(`${apiUrl}deleteUserData`, data)
            .then(({data}) => {
                if (data.status) {
                    dispatch(success(data.data));
                } else {
                    dispatch(failure(data.message));
                }
            })
            .catch(error => {
                throw(error);
                dispatch(failure(error.message));
            });
    }

    function request() {
        return {type: userConstants.USERDATA_DELETE_REQUEST};
    }

    function success(data) {
        return {type: userConstants.USERDATA_DELETE_SUCCESS, data};
    }

    function failure(error) {
        return {type: userConstants.USERDATA_DELETE_FAILURE, error};
    }
};



