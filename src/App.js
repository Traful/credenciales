import React, { useContext } from "react";
import "./App.scss";
import Context from "./store/Context";
import { SWRConfig } from "swr";

import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";

const myFetcher = async (resource, context) => {
	const res = await fetch(`${process.env.REACT_APP_API_URL}${resource}`, {
		method: "GET",
		mode: "cors",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
			"Authorization": context.state.user.token
		}
	});
	return await res.json();
};

const App = () => {
	const context = useContext(Context);
	return(
		<div className="App">
			<SWRConfig 
				value={{
				refreshInterval: 0, //3000,
				fetcher: (resource) => myFetcher(resource, context)
				}}
			>
				{
					context.state.user.auth ?
					<Dashboard />
					:
					<SignIn />
				}
			</SWRConfig>
		</div>
	);
};

export default App;