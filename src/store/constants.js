const addDays = (date = null, years = 1) => {
	var result = null;
	if(date) {
		result = new Date(date);
	} else {
		result = new Date();
	}
	result.setDate(result.getDate() + (years * 365));
	return result.toISOString().slice(0, 10);
};

let fecha = new Date();
let hoy = fecha.toISOString().slice(0, 10);
/*
fecha.setFullYear(fecha.getFullYear() + 1); //Esto tiene un error!
let enunanio = fecha.toISOString().slice(0,10);
*/
let enunanio = addDays();

export const DEFAULT_STATE = {
	user: {
		auth: false,
		id: 0,
		name: "",
		token: ""
	},
	credencial: {
		buscada: false,
		encontrada: false,
		iraimpresion: false,
		datos: {
			id: "0",
			idtipo: "0",
			apellido: "",
			nombre: "",
			domicilio: "",
			dni: "",
			telefono: "",
			email: "",
			institucion: "",
			emision: hoy,
			vencimiento: enunanio,
			foto: null
		}
	}
};

export const RESET_STATE = "RESET_STATE";
export const SET_USER_DATA = "SET_USER_DATA";

export const SET_CREDENCIAL_DATA = "SET_CREDENCIAL_DATA";
export const DEFAULT_CREDENCIAL_DATA = {
	buscada: false,
	encontrada: false,
	iraimpresion: false,
	datos: {
		id: "0",
		idtipo: "0",
		apellido: "",
		nombre: "",
		domicilio: "",
		dni: "",
		telefono: "",
		email: "",
		institucion: "",
		emision: hoy,
		vencimiento: enunanio,
		foto: null
	}
};