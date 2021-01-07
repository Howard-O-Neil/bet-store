import Axios from "axios";
import { ADD_SLIDER, ADD_SLIDER_FAIL, ADD_SLIDER_SUCCESS, EDIT_SLIDER, EDIT_SLIDER_FAIL, EDIT_SLIDER_SUCCESS, GET_SLIDER, GET_SLIDER_FAIL, GET_SLIDER_SUCCESS, REMOVE_SLIDER, REMOVE_SLIDER_FAIL, REMOVE_SLIDER_SUCCESS } from "../constants/sliderConstants";
import { ActionType } from "../types/actionType";
import { ReponseAPI as ResponseAPI } from "../types/ReponseAPI";
import { DataSlider } from "../types/SliderType";

export const GetSlider = () =>async (dispatch: React.Dispatch<ActionType<DataSlider[]>>) => {
    dispatch(GetSlider_Request())
    let response = await Axios.get<ResponseAPI<DataSlider[]>>(
        `/go/slider/`
    );
    if (response.status === 200) {
        if (response.data.status === 200) {
            dispatch(GetSlider_SUCCESS(response.data.data));
        }
        else {
            dispatch(GetSlider_FAIL(response.data.message))
        }
    } else {
        dispatch(GetSlider_FAIL(response.statusText))
    }
}

const GetSlider_Request = (): ActionType<any> => {
    return {
        type: GET_SLIDER,
        payload: null
    }
}

const GetSlider_SUCCESS = (data: DataSlider[]): ActionType<DataSlider[]> => {
    return {
        type: GET_SLIDER_SUCCESS,
        payload: data
    }
}

const GetSlider_FAIL = (msg:string): ActionType<any> => {
    return {
        type: GET_SLIDER_FAIL,
        payload: msg
    }
}


interface ID_Slider {
	_id: string
}

export const AddSlider = (slider:DataSlider) =>async (dispatch: React.Dispatch<ActionType<string>>) => {
    dispatch(AddSlider_Request())
    let response = await Axios.post<ResponseAPI<ID_Slider>>(
        `/go/slider/`,
        slider
    );
    if (response.status === 200) {
        if (response.data.status === 200) {
            console.log(response)
            dispatch(AddSlider_SUCCESS(response.data.data._id));
        }
        else {
            dispatch(AddSlider_FAIL(response.data.message))
        }
    } else {
        dispatch(AddSlider_FAIL(response.statusText))
    }
}

const AddSlider_Request = (): ActionType<any> => {
    return {
        type: ADD_SLIDER,
        payload: null
    }
}

const AddSlider_SUCCESS = (data: string): ActionType<string> => {
    return {
        type: ADD_SLIDER_SUCCESS,
        payload: data
    }
}

const AddSlider_FAIL = (msg:string): ActionType<any> => {
    return {
        type: ADD_SLIDER_FAIL,
        payload: msg
    }
}



export const RemoveSlider = (id:string) =>async (dispatch: React.Dispatch<ActionType<string>>) => {
    dispatch(RemoveSlider_Request())
    let response = await Axios.delete<ResponseAPI<any>>(
        `/go/slider?id=${id}`
    );
    if (response.status === 200) {
        if (response.data.status === 200) {
            console.log(response)
            dispatch(RemoveSlider_SUCCESS(id));
        }
        else {
            dispatch(RemoveSlider_FAIL(response.data.message))
        }
    } else {
        dispatch(RemoveSlider_FAIL(response.statusText))
    }
}

const RemoveSlider_Request = (): ActionType<any> => {
    return {
        type: REMOVE_SLIDER,
        payload: null
    }
}

const RemoveSlider_SUCCESS = (data: string): ActionType<string> => {
    return {
        type: REMOVE_SLIDER_SUCCESS,
        payload: data
    }
}

const RemoveSlider_FAIL = (msg:string): ActionType<any> => {
    return {
        type: REMOVE_SLIDER_FAIL,
        payload: msg
    }
}


export const EditSlider = (data:DataSlider) =>async (dispatch: React.Dispatch<ActionType<DataSlider>>) => {
    dispatch(EditSlider_Request())
    let response = await Axios.put<ResponseAPI<DataSlider>>(
        `/go/slider`,
        data
    );
    if (response.status === 200) {
        if (response.data.status === 200) {
            console.log(response.data.data)
            dispatch(EditSlider_SUCCESS(response.data.data));
        }
        else {
            dispatch(EditSlider_FAIL(response.data.message))
        }
    } else {
        dispatch(EditSlider_FAIL(response.statusText))
    }
}

const EditSlider_Request = (): ActionType<any> => {
    return {
        type: EDIT_SLIDER,
        payload: null
    }
}

const EditSlider_SUCCESS = (data: DataSlider): ActionType<DataSlider> => {
    return {
        type: EDIT_SLIDER_SUCCESS,
        payload: data
    }
}

const EditSlider_FAIL = (msg:string): ActionType<any> => {
    return {
        type: EDIT_SLIDER_FAIL,
        payload: msg
    }
}

