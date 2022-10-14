import {formConstants} from '../constants';

export default (state = {}, action) => {
    switch (action.type) {

        case formConstants.FORMDATA_SUBMIT_REQUEST:
            return {
                ...state,
                dataAddingStatus: -1
            };
        case formConstants.FORMDATA_SUBMIT_SUCCESS:
            return {
                ...state,
                dataAddingStatus: 1
            };
        case formConstants.FORMDATA_SUBMIT_FAILURE:
            return {
                ...state,
                dataAddingStatus: 0,
                error: action.error
            };


        case formConstants.FORMDATA_LIST_REQUEST:
            return {
                ...state,
                dataListStatus: -1
            };
        case formConstants.FORMDATA_LIST_SUCCESS:
            return {
                ...state,
                dataListStatus: 1,
                formDataList: action.data
            };
        case formConstants.FORMDATA_LIST_FAILURE:
            return {
                ...state,
                dataListStatus: 0,
                dataListError: action.error
            };


        case formConstants.FORMDATA_DELETE_REQUEST:
            return {
                ...state,
                dataDeleteStatus: -1
            };
        case formConstants.FORMDATA_DELETE_SUCCESS:
            return {
                ...state,
                dataDeleteStatus: 1,
                formDataList: action.data
            };
        case formConstants.FORMDATA_DELETE_FAILURE:
            return {
                ...state,
                dataDeleteStatus: 0,
                dataDeleteError: action.error
            };


        case formConstants.FORMDATA_UPDATE_REQUEST:
            return {
                ...state,
                dataUpdateStatus: -1
            };
        case formConstants.FORMDATA_UPDATE_SUCCESS:
            return {
                ...state,
                dataUpdateStatus: 1,
                formDataList: action.data
            };
        case formConstants.FORMDATA_UPDATE_FAILURE:
            return {
                ...state,
                dataUpdateStatus: 0,
                dataUpdateError: action.error
            };

        default:
            return state
    }
};
