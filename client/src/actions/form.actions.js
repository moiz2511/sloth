import axios from 'axios';
import {formConstants, apiUrl} from '../constants';

export const submitFormData = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.post(`${apiUrl}addFormData`, data)
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
        return {type: formConstants.FORMDATA_SUBMIT_REQUEST}
    }

    function success(data) {
        return {type: formConstants.FORMDATA_SUBMIT_SUCCESS, data}
    }

    function failure(error) {
        return {type: formConstants.FORMDATA_SUBMIT_FAILURE, error}
    }
};

export const updateFormData = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.post(`${apiUrl}updateFormData`, data)
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
        return {type: formConstants.FORMDATA_UPDATE_REQUEST}
    }

    function success(data) {
        return {type: formConstants.FORMDATA_UPDATE_SUCCESS, data}
    }

    function failure(error) {
        return {type: formConstants.FORMDATA_UPDATE_FAILURE, error}
    }
};


export const formDataList = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.get(`${apiUrl}formDataList`)
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
        return {type: formConstants.FORMDATA_LIST_REQUEST}
    }

    function success(data) {
        return {type: formConstants.FORMDATA_LIST_SUCCESS, data}
    }

    function failure(error) {
        return {type: formConstants.FORMDATA_LIST_FAILURE, error}
    }
};

export const deleteFormData = (data) => {
    return (dispatch) => {
        dispatch(request());
        return axios.post(`${apiUrl}deleteFormData`, data)
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
        return {type: formConstants.FORMDATA_DELETE_REQUEST}
    }

    function success(data) {
        return {type: formConstants.FORMDATA_DELETE_SUCCESS, data}
    }

    function failure(error) {
        return {type: formConstants.FORMDATA_DELETE_FAILURE, error}
    }
};

