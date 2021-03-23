import  { useState } from "react";

export const useForm = (defaultValues) => {
	const [data, setData] = useState(defaultValues);

	const handleData = (event) => {
		setData(prev => {
			return { ...prev, [event.target.name]: event.target.value  }
		});
	};

	return [data, handleData, setData];
};