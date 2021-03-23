import React, { useContext, useState } from "react";
import Context from "./../../../store/Context";
//import useSWR from "swr";
import { SET_CREDENCIAL_DATA } from "./../../../store/constants";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
		display: "flex"
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		marginLeft: "1em"
	},
}));

const FindDNI = () => {
	const classes = useStyles();
	const context = useContext(Context);
	const [searching, setSearching] = useState(false);
	const [dni, setDni] = useState("");
	//const { data: tipos } = useSWR("tipos");
	const [snackbar, setSnackbar] = useState({
		open: false,
		msg: ""
	});

	const handleDNIFormSubmit = (event) => {
		event.preventDefault();
		if(dni.length < 7 || dni.length > 8) {
			setSnackbar({...snackbar, open: true, msg: "DNI debe tener 7 u 8 caracteres"});
			return;
		}

		if(!searching) {
			setSearching(true);
			fetch(`${process.env.REACT_APP_API_URL}/credencial/dni/${dni}`, {
				headers: {
					"Content-Type": "application/json",
					"Authorization": context.state.user.token
				}
			})
			.then((response) => {
				if(response.ok) {
					return response.json();
				} else {
					throw new Error(response.status);
				}
			})
			.then((json) => {
				let fecha = new Date();
				let hoy = fecha.toISOString().slice(0, 10);
				fecha.setFullYear(fecha.getFullYear() + 1); //Esto tiene un error!
				let enunanio = fecha.toISOString().slice(0, 10);
				if(json) {
					context.dispatch({type: SET_CREDENCIAL_DATA, payload: {
						buscada: true,
						encontrada: true,
						iraimpresion: false,
						datos: {...json}
					}});
				} else {
					context.dispatch({type: SET_CREDENCIAL_DATA, payload: {
						buscada: true,
						encontrada: false,
						iraimpresion: false,
						datos: {
							id: "0",
							idtipo: "0",
							apellido: "",
							nombre: "",
							domicilio: "",
							dni,
							telefono: "",
							email: "",
							institucion: "",
							emision: hoy,
							vencimiento: enunanio,
							foto: null
						}
					}});
				}
			})
			.catch((error) => {
				console.log(error);
				setSnackbar({...snackbar, open: true, msg: "Ocurrió un error!"});
			})
  			.finally(() => setSearching(false));
		}
	};

	return(
		<div className="Credenciales">
			<CssBaseline />
			<form className={classes.form} noValidate onSubmit={handleDNIFormSubmit} autoComplete="off">
				<TextField variant="outlined" margin="normal" required id="dni" name="dni" label="DNI" value={dni} onChange={event => setDni(event.target.value)} minLength="7" maxLength="8" autoFocus />
				<div className={classes.submit}>
				{
					searching ?
					<CircularProgress />
					:
					<Button type="submit" variant="contained" color="primary" startIcon={<SearchIcon />}>Buscar</Button>
				}
				</div>	
			</form>
			<Snackbar anchorOrigin={{ horizontal: "right", vertical: "top" }} open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
				<Alert onClose={() => setSnackbar({...snackbar, open: false})} variant="filled" severity="error">
				{snackbar.msg}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default FindDNI;