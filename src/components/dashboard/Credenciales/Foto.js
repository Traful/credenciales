import React, { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";

import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
	formControl: {
		//margin: theme.spacing(1),
		margin: "0 0 2em 0",
		minWidth: 120,
		width: "100%",
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

const Foto = ({onFotoSelect, open}) => {
	const classes = useStyles();
	const video = useRef(null);
	const canvas = useRef(null);
	const [camaras, setCamaras] = useState([]);
	const [selectedCamara, setSelectedCamara] = useState(null);

	const stopRecording = () => {
		let stream = video.current.srcObject;
		let tracks = stream.getTracks();
		tracks.forEach(function(track) {
			track.stop();
		});
		video.current.srcObject = null;
	};

	const handleSacarFoto = () => {
		try {
			canvas.current.width = 160;
			canvas.current.height = 160;
			//Cuadro a tomar del video
			let sx = (video.current.width / 2) - (canvas.current.width / 2);
			let sy = (video.current.height / 2) - (canvas.current.height / 2) + 40;
			let sWidth = (video.current.width / 2) + (canvas.current.width / 2);
			let sHeight = (video.current.height / 2) + (canvas.current.height / 2) + 40;
			//Dibujar en Canvas
			let dx = 0;
			let dy = 0;
			let dWidth = 160;
			let dHeight = 160;
			canvas.current.getContext("2d").drawImage(video.current, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			let data = canvas.current.toDataURL("image/png"); //O acá es JPEG (ver tema canvas) o en PdfObjet es PNG (ver CredencialPDF)
			video.current.pause();
			stopRecording();
			onFotoSelect(data);
		} catch(error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		video.current.pause();
		stopRecording();
		onFotoSelect(null);
	};

	const setCamaraWeb = async (deviceId) => {
		if(video) {
			try {
				let constraints = {
					video: {
						deviceId: deviceId ? { exact: deviceId } : undefined
					}
				};
				let stream = await navigator.mediaDevices.getUserMedia(constraints);
				video.current.srcObject = stream;
				video.current.play();
			} catch (error) {
				console.error("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
			}
		}
	};

	const handleOnEntered = async () => {
		if(video) {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = devices.filter(device => device.kind === "videoinput");
				var buffer = [];
				videoDevices.forEach((device, index) => {
					buffer.push({
						value: device.deviceId,
						label: device.label || `Camara ${index + 1}`
					});
				});
				setCamaras(buffer);
				if(buffer.length > 0) {
					let value = window.localStorage.getItem("cred-web-cam") ? window.localStorage.getItem("cred-web-cam") : null;
					if(value) {
						let existe = buffer.filter((camara) => camara.value === value);
						if(existe.length > 0) {
							setSelectedCamara(existe[0].value);
							setCamaraWeb(existe[0].value);
						}
					} else {
						setCamaraWeb(buffer[0].value);
					}
				}
			} catch(err) {
				console.error("Error general: ", err.message, err.name);
			}
		}
	};

	const handleCamaraChange = (event) => {
		window.localStorage.setItem("cred-web-cam", event.target.value);
		setSelectedCamara(event.target.value);
		setCamaraWeb(event.target.value);
	};

	return(
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			onEntered={handleOnEntered} //Callback fired when the dialog has entered. (ultimo)
		>
			<DialogTitle id="alert-dialog-title">Tomar Fotografía</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Para tomar la fotografía por favor tenga en cuenta que lo que se expone es lo que está dentro del cuadro.
					</DialogContentText>
					{
						camaras.length > 0 ?
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="name-native-error">Dispositivo</InputLabel>
							<NativeSelect value={selectedCamara} onChange={handleCamaraChange} name="name" inputProps={{ id: "name-native-error" }}>
								{
									camaras.map((camara) => <option key={`c-${camara.value}`} value={camara.value}>{camara.label}</option>)
								}
							</NativeSelect>
						</FormControl>
						:
						"No hay cámaras instaladas en el equipo!"
					}
					<div className={"Foto"}>
						<div className="video-content">
							<video ref={video} width="480px" height="280px"></video>
						</div>
					</div>
					<canvas ref={canvas} className="dummy-canvas"></canvas>
					{
						camaras.length > 0 ?
						null
						:
						<Alert severity="error">No se pudo acceder a la cámara, por favor verifique que su equipo cuenta con una, que esté conectada y que haya otorgado al navegador los permisos requeridos.</Alert>
					}
				</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">Cancelar</Button>
				{
					camaras.length > 0 ?
					<Button onClick={handleSacarFoto} color="primary" autoFocus>Tomar Foto</Button>
					:
					null
				}
			</DialogActions>
		</Dialog>
	);
};

export default Foto;