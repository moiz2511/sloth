import {userConstants} from '../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                ...state,
                loginStatus: -1
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                ...state,
                loginStatus: 1,
                user: action.data
            };
        case userConstants.LOGIN_FAILURE:
            return {
                ...state,
                loginStatus: 0,
                error: action.error
            };


        case userConstants.USERDATA_SUBMIT_REQUEST:
            return {
                ...state,
                dataAddingStatus: -1
            };
        case userConstants.USERDATA_SUBMIT_SUCCESS:
            return {
                ...state,
                dataAddingStatus: 1
            };
        case userConstants.USERDATA_SUBMIT_FAILURE:
            return {
                ...state,
                dataAddingStatus: 0,
                error: action.error
            };


        case userConstants.USERDATA_LIST_REQUEST:
            return {
                ...state,
                dataListStatus: -1
            };
        case userConstants.USERDATA_LIST_SUCCESS:
            return {
                ...state,
                dataListStatus: 1,
                userDataList: action.data
            };
        case userConstants.USERDATA_LIST_FAILURE:
            return {
                ...state,
                dataListStatus: 0,
                dataListError: action.error
            };


        case userConstants.USERDATA_DELETE_REQUEST:
            return {
                ...state,
                dataDeleteStatus: -1
            };
        case userConstants.USERDATA_DELETE_SUCCESS:
            return {
                ...state,
                dataDeleteStatus: 1,
                userDataList: action.data
            };
        case userConstants.USERDATA_DELETE_FAILURE:
            return {
                ...state,
                dataDeleteStatus: 0,
                dataDeleteError: action.error
            };


        case userConstants.USERDATA_UPDATE_REQUEST:
            return {
                ...state,
                dataUpdateStatus: -1
            };
        case userConstants.USERDATA_UPDATE_SUCCESS:
            return {
                ...state,
                dataUpdateStatus: 1,
                userDataList: action.data
            };
        case userConstants.USERDATA_UPDATE_FAILURE:
            return {
                ...state,
                dataUpdateStatus: 0,
                dataUpdateError: action.error
            };

        default:
            return state
    }
};
