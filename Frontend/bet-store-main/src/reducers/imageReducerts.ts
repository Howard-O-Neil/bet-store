import { UPLOAD_IMAGE, UPLOAD_IMAGE_FAIL, UPLOAD_IMAGE_SUCCESS } from "../constants/imageConstants";
import { ActionType } from "../types/actionType";
import { StateType } from "../types/stateType";


const init: StateType<string> = {
    IsFetching: false,
    Error: "",
    Payload: ""
}

export const uploadImageReducer: React.Reducer<StateType<string>, ActionType<string>>
    = (state = init, action) => {
        switch (action.type) {
            case UPLOAD_IMAGE:
                return { ...state, Payload: "" };
            case UPLOAD_IMAGE_SUCCESS:
                return { ...state, Payload: action.payload };

            case UPLOAD_IMAGE_FAIL:
                return { ...state, Error: action.payload };
            default:
                return { ...state };
        }
    };