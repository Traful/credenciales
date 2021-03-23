//import React, { useEffect, useRef, useState } from "react";
import React, { useEffect, useRef, useContext, useState, useCallback } from "react";
import Context from "./../../../store/Context";
import { SET_CREDENCIAL_DATA, DEFAULT_CREDENCIAL_DATA } from "./../../../store/constants";


import { jsPDF } from "jspdf";

import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import CachedIcon from "@material-ui/icons/Cached";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
	backdni: {
		margin: theme.spacing(3, 0, 2),
	}
}));

/*
const drawInCanvas = (data, ctx, tipo = 1) => {
	let width = 204.09448819;
	let height = 323.90551181;
	return new Promise((resolve, reject) => {
		try {
			let image = new Image();
			image.onload = () => {
				if(tipo === 1) {
					ctx.drawImage(image, 0, 0, width, height, 0, 0, 165 * 2, 165); //165 * 2???
				} else {
					ctx.drawImage(image, 0, 0, width, height, 0, 0, 165 * 2, 165); //165 * 2???
				}
				console.log("Promesa resuleta");
				resolve(true);
			};
			image.src = data;
		} catch(error) {
			console.log("Falló");
			reject(false);
		}
	});
};
*/

const CredencialPDF = () => {
	const classes = useStyles();
	const pdf = useRef(null);
	const context = useContext(Context);
	const { 
		idtipo,
		apellido,
		nombre,
		domicilio,
		dni,
		institucion,
		emision,
		vencimiento,
		foto
	} = context.state.credencial.datos;
	
	const [selectedTipo, setSelectedTipo] = useState({
		imagen: null
	});

	const [loading, setLoading] = useState(true);

	const generatePDF = useCallback(() => {
		const doc = new jsPDF({
			//orientation: "landscape",
			unit: "mm",
			//format: [55, 85],
			format: "credit-card"
		});
		//Frente
		doc.addImage(`${process.env.REACT_APP_API_URL}/uploads/${selectedTipo.imagen}`, "JPEG", 0, 0, 54, 85.7, "img-1", "NONE", 0); //Acá puede ser PNG (ver canvas en Foto)
		//Dorso
		doc.addPage();
		doc.addImage(`${process.env.REACT_APP_API_URL}/uploads/Dorso.jpg`, "JPEG", 0, 0, 54, 85.7, "img-2", "NONE", 0); //Acá puede ser PNG (ver canvas en Foto)
		doc.addImage(foto, "JPEG", 6.6, 10.9, 19.8, 20.5, "img-3", "NONE", 0); //Acá puede ser PNG (ver canvas en Foto)
		doc.setTextColor("#000000");
		doc.setFontSize(8);
		doc.text(`${apellido}, ${nombre}`, 5, 37);
		doc.text(domicilio, 5, 42);
		let intDni = parseInt(dni, 10);
		doc.text("DNI: " + intDni.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."), 5, 47);
		doc.text(institucion, 5, 52);
		doc.text("Emitido el: " + emision.split("-").reverse().join("/"), 5, 57);
		doc.text("Vence el: " + vencimiento.split("-").reverse().join("/"), 5, 62);
		let string = doc.output("datauristring");
		var options = {
			height: "600px",
			width: "800px",
			pdfOpenParams: { view: "Fit,1", pagemode: "thumbs", scrollbar: "1", toolbar: "1", statusbar: "1", messages: "1", navpanes: "0" }
		};
		window.PDFObject.embed(string, pdf.current, options);
	}, [apellido, dni, domicilio, emision, foto, institucion, nombre, selectedTipo.imagen, vencimiento]);

	useEffect(() => {
		const getData = async () => {
			try {
				let result = await fetch(`${process.env.REACT_APP_API_URL}/tipos`, {
					headers: {
						"Content-Type": "application/json",
						"Authorization": context.state.user.token
					}
				});
				let json = await result.json();
				let filtro = json.filter((tipo) => tipo.id === idtipo);
				setSelectedTipo(filtro[0]);
			} catch(error) {
				console.log(error);
			}
		};
		getData().then(() => {
			setLoading(false);
		});
	}, [context.state.user.token, generatePDF, idtipo]);

	useEffect(() => {
		if(!loading && selectedTipo.imagen) {
			generatePDF();
		}
	}, [generatePDF, loading, selectedTipo.imagen]);

	const handleRegresarClick = () => {
		context.dispatch({ type: SET_CREDENCIAL_DATA, payload: DEFAULT_CREDENCIAL_DATA });
	};

	if(loading) return <div>Loading...</div>

	return(
		<div>
			<CssBaseline />
			{
				loading ?
				<LinearProgress />
				:
				<>
					<div className="CredencialPDF">
						<div ref={pdf} className="pdf"></div>
					</div>
					<Button className={classes.backdni} type="button" variant="contained" color="primary" startIcon={<CachedIcon />} onClick={handleRegresarClick}>Regrsar al Inicio</Button>
				</>
			}
		</div>
	);
};

export default CredencialPDF;