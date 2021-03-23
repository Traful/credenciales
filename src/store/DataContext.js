import React, { useReducer } from "react";
import Context from "./Context";
import { DEFAULT_STATE } from "./constants";
import reducer from "./reducer";

const DataContext = (props) => {
	const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
	return(
		<Context.Provider value={{state, dispatch}}>
			{ props.children }	
		</Context.Provider>
	);
};

export default DataContext;