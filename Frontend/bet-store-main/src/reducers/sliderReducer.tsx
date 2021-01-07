import { ADD_SLIDER, ADD_SLIDER_FAIL, ADD_SLIDER_SUCCESS, EDIT_SLIDER, EDIT_SLIDER_FAIL, EDIT_SLIDER_SUCCESS, GET_SLIDER, GET_SLIDER_FAIL, GET_SLIDER_SUCCESS, REMOVE_SLIDER, REMOVE_SLIDER_FAIL, REMOVE_SLIDER_SUCCESS } from "../constants/sliderConstants";
import { ActionType } from "../types/actionType";
import { DataSlider } from "../types/SliderType";
import { StateType } from "../types/stateType";

const init: StateType<DataSlider[]> = {
	IsFetching: false,
	Error: "",
	Payload: []
}

export const getsliderReducer: React.Reducer<StateType<DataSlider[]>, ActionType<any>> = (state = init, action) => {
	switch (action.type) {
		case GET_SLIDER:
			return {...state, Payload:[]}
		case GET_SLIDER_SUCCESS:
			console.log(action.payload)
			return {...state, Payload:action.payload}
		case GET_SLIDER_FAIL:
			return {...state, Error:action.payload}
		default:
			return state;
	}
};

export const addsliderReducer: React.Reducer<StateType<string>, ActionType<any>> = (state = {Error:"",IsFetching:false,Payload:""}, action) => {
	switch (action.type) {
		case ADD_SLIDER:
			return {...state, Payload:[]}
		case ADD_SLIDER_SUCCESS:
			return {...state, Payload:action.payload}
		case ADD_SLIDER_FAIL:
			return {...state, Error:action.payload}
		default:
			return state;
	}
};




export const removeSliderReducer: React.Reducer<StateType<string>, ActionType<any>> = (state = {Error:"",IsFetching:false,Payload:""}, action) => {
	switch (action.type) {
		case REMOVE_SLIDER:
			return {...state, Payload:""}
		case REMOVE_SLIDER_SUCCESS:
			return {...state, Payload:action.payload}
		case REMOVE_SLIDER_FAIL:
			return {...state, Error:action.payload}
		default:
			return state;
	}
};

export const editSliderReducer: React.Reducer<StateType<DataSlider>, ActionType<any>> = (state = {Error:"",IsFetching:false,Payload:{_id:"",alt:"",href:"",link:""}}, action) => {
	switch (action.type) {
		case EDIT_SLIDER:
			return {...state, Payload:""}
		case EDIT_SLIDER_SUCCESS:
			return {...state, Payload:action.payload}
		case EDIT_SLIDER_FAIL:
			return {...state, Error:action.payload}
		default:
			return state;
	}
};
