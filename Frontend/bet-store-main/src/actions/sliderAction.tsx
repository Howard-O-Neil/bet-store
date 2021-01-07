import Axios from "axios";
import { GET_SLIDER, GET_SLIDER_FAIL, GET_SLIDER_SUCCESS } from "../constants/sliderConstants";
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
        type: GET_SLIDER,
        payload: null
    }
}

const AddSlider_SUCCESS = (data: string): ActionType<string> => {
    return {
        type: GET_SLIDER_SUCCESS,
        payload: data
    }
}

const AddSlider_FAIL = (msg:string): ActionType<any> => {
    return {
        type: GET_SLIDER_FAIL,
        payload: msg
    }
}
