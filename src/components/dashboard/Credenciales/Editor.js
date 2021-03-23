import React, { useEffect, useRef, useState, useContext } from "react";
import Context from "./../../../store/Context";
import { SET_CREDENCIAL_DATA } from "./../../../store/constants";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";

import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";


import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import Foto from "./Foto";

import { useForm } from "./../../../utils/utils.js";


const useStyles = makeStyles((theme) => ({
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	formControl: {
		margin: theme.spacing(2, 0, 2),
		minWidth: 120,
	},
	submit: {
		margin: theme.spacing(1, 0, 2),
	},
}));

const calcularFechas = (tipos, id = 0) => {
	let fecha = new Date(); //.toLocaleString("en-US", {timeZone: "America/New_York"});
	let hoy = fecha.toISOString().slice(0, 10);
	fecha.setFullYear(fecha.getFullYear() + 1); //Esto tiene un error!
	let enunanio = fecha.toISOString().slice(0, 10);

	let resp = {
		desde: hoy,
		hasta: enunanio
	};

	if(tipos && (tipos.length > 0))	{
		let selected = tipos.filter((value) => value.id === id);
		if(selected && (selected.length > 0)) {
			selected = selected[0];
			let meses = parseInt(selected.tope, 10);
			if(meses > 0) {
				//Hay que calcular meses a partir de la fecha de hoy
				let limite = new Date(selected.maximo);
				let fecha = new Date();
				let newDate = new Date(fecha.setMonth(fecha.getMonth() + meses));
				resp.hasta = newDate.toISOString().slice(0, 10);
				if(newDate.getTime() > limite.getTime()) {
					resp.hasta = selected.maximo;
				}
			} else {
				resp.hasta = selected.maximo;
			}
		}
	}

	return resp;
};

const Editor = ({credencialData}) => {
	const classes = useStyles();
	const { encontrada, datos } = credencialData;
	const context = useContext(Context);
	const refCanvas = useRef(null);

	const [data, handleData, setData] = useForm(datos);
	const [tipos, setTipos] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [processing, setProcessing] = useState(false);

	const [snackbar, setSnackbar] = useState({
		open: false,
		msg: ""
	});

	useEffect(() => {
		if(data.foto) {
			let ctx = refCanvas.current.getContext("2d");
			let image = new Image();
			image.style.width = "auto";
			image.onload = function() {
				ctx.drawImage(image, 0, 0, 165, 165, 0, 0, 165 * 2, 165); //165*2???
			};
			image.src = data.foto;
		}
		const getData = async () => {
			try {
				let result = await fetch(`${process.env.REACT_APP_API_URL}/tipos`, {
					headers: {
						"Content-Type": "application/json",
						"Authorization": context.state.user.token
					}
				});
				let json = await result.json();
				setTipos(json);
				if(!encontrada) {
					let fechas = calcularFechas(json, json[0].id);
					setData({
						...data,
						emision: fechas.desde,
						vencimiento: fechas.hasta,
						idtipo: json[0].id
					});
				} else {
					let fechas = calcularFechas(json, data.idtipo);
					setData({
						...data,
						emision: fechas.desde,
						vencimiento: fechas.hasta
					});
				}
			} catch(error) {
				console.log(error);
			}
		};
		getData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [encontrada]);

	const handleBack = () => {
		context.dispatch({type: SET_CREDENCIAL_DATA, payload: {
			...context.state.credencial,
			buscada: false,
			encontrada: false,
		}});
	};

	const handleTipoChange = (event) => {
		let fechas = calcularFechas(tipos, event.target.value);
		console.log(fechas);
		setData({
			...data,
			emision: fechas.desde,
			vencimiento: fechas.hasta,
			idtipo: event.target.value
		});
	}

	const handleFormSubmit = (event) => {
		event.preventDefault();
		if(!processing) {
			setProcessing(true);
			//Guardar cambios o nuevo registro
			fetch(`${process.env.REACT_APP_API_URL}/credencial`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": context.state.user.token
				},
				body: JSON.stringify(data)
			})
			.then((response) => {
				var contentType = response.headers.get("content-type");
				if(contentType && contentType.indexOf("application/json") !== -1) {
					return response.json().then((json) => {
						//Debe responder con los datos de la credencial nueva
						if(json.err && json.errors && (json.errors.length > 0)) {
							throw new Error(json.errors[0]);
						} else {
							context.dispatch({type: SET_CREDENCIAL_DATA, payload: {
								...context.state.credencial,
								iraimpresion: true,
								datos: json.data
							}});
						}
					});
				} else {
					throw new Error("¡Ups ocurrió un error!");
				}
			})
			.catch(err => {
				setSnackbar({...snackbar, open: true, msg: err.message});
				setProcessing(false);
			});
		}
	};

	const handleNewPhoto = () => {
		setDialogOpen(true);
	};

	const handleFotoSelect = (foto) => {
		if(foto) {
			refCanvas.current.width = 160;
			refCanvas.current.height = 160;
			let ctx = refCanvas.current.getContext("2d");
			ctx.clearRect(0, 0, refCanvas.current.width, refCanvas.current.height);
			let image = new Image();
			image.style.width = "auto";
			image.onload = function() {
				ctx.drawImage(image, 0, 0, 165, 165, 0, 0, 165, 165); //165*2???
			};
			image.src = foto;
			setData({...data, foto});
			context.dispatch({type: SET_CREDENCIAL_DATA, payload: {
				...context.state.credencial,
				datos: {
					...context.state.credencial.datos,
					foto
				}
			}});
		}
		setDialogOpen(false);
	};

	if(!data) return null;

	return(
		<div className="Editor">
			<CssBaseline />
			<Foto onFotoSelect={handleFotoSelect} open={dialogOpen} />
			<div className={classes.paper}>
				<form className={classes.form} onSubmit={handleFormSubmit}>
					<div className="formulario">
						<div className="foto">
							<div className="marco" onClick={handleNewPhoto}>
								<canvas ref={refCanvas} ></canvas>
							</div>
						</div>
						<div className="cuerpo-1">
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<TextField variant="outlined" margin="normal" required fullWidth id="apellido" name="apellido" label="Apellido" minLength="3" maxLength="25" value={data.apellido} onChange={handleData} autoFocus />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField variant="outlined" margin="normal" required fullWidth id="nombre" name="nombre" label="Nombre" minLength="3" maxLength="25" value={data.nombre} onChange={handleData} />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField variant="outlined" margin="normal" required disabled fullWidth id="dni" name="dni" label="DNI" minLength="7" maxLength="8" value={data.dni} onChange={handleData} />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField variant="outlined" margin="normal" fullWidth id="telefono" name="telefono" label="Teléfono" maxLength="20" value={data.telefono} onChange={handleData} />
								</Grid>
							</Grid>
						</div>
						<div className="cuerpo-2">
							<Grid container spacing={3}>
								<Grid item xs={12} md={4}>
									<TextField variant="outlined" margin="normal" fullWidth id="domicilio" name="domicilio" label="Domicilio" maxLength="100" value={data.domicilio} onChange={handleData} />
								</Grid>
								<Grid item xs={12} md={4}>
									<TextField variant="outlined" type="email" margin="normal" fullWidth id="email" name="email" label="Email" maxLength="100" value={data.email} onChange={handleData} />
								</Grid>
								<Grid item xs={12} md={4}>
									<TextField variant="outlined" margin="normal" fullWidth id="institucion" name="institucion" label="Institución" maxLength="100" value={data.institucion} onChange={handleData} />
								</Grid>
								<Grid item xs={12} md={6}>
									<FormControl variant="outlined" fullWidth className={classes.formControl}>
										<InputLabel id="idtipo-label">Tipo</InputLabel>
										<Select labelId="idtipo-label" id="idtipo" name="idtipo" value={data.idtipo} onChange={handleTipoChange} label="Tipo">
											{
												tipos.map((tipo) => <MenuItem key={`mi-${tipo.id}`} value={tipo.id}>{tipo.descripcion}</MenuItem>)
											}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField variant="outlined" margin="normal" fullWidth disabled id="emision" name="emision" label="Fecha Emisión" type="date" value={data.emision} onChange={handleData} />
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField variant="outlined" margin="normal" fullWidth id="vencimiento" name="vencimiento" label="Fecha Vencimiento" type="date" required value={data.vencimiento} onChange={handleData} />
								</Grid>
								<Grid item xs={6} md={6} style={{display: "flex", justifyContent: "flex-start"}}>
									<Button type="button" variant="contained" color="secondary" className={classes.submit} onClick={handleBack}>Regresar</Button>
								</Grid>
								<Grid item xs={6} md={6} style={{display: "flex", justifyContent: "flex-end"}}>
									{
										processing ?
										<CircularProgress />
										:
										<Button type="submit" variant="contained" color="primary" className={classes.submit}>Continuar</Button>
									}
								</Grid>
							</Grid>
						</div>
					</div>
				</form>
				<Snackbar anchorOrigin={{ horizontal: "right", vertical: "top" }} open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
					<Alert onClose={() => setSnackbar({...snackbar, open: false})} variant="filled" severity="error">
					{snackbar.msg}
					</Alert>
				</Snackbar>
			</div>
		</div>
	);
};

export default Editor;