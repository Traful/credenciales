import { DEFAULT_STATE, RESET_STATE, SET_USER_DATA, SET_CREDENCIAL_DATA } from "./constants";

const reducer = (state, action) => {
	switch(action.type) {
		case RESET_STATE:
			return DEFAULT_STATE;
		case SET_USER_DATA:
			return { ...state, user: action.payload };
		case SET_CREDENCIAL_DATA:
			return { ...state, credencial: action.payload };
		default:
			return state;
	}
};

export default reducer;