import React, { useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import img from "./imgs/JubiladosPensionados.png";

const Shoot = () => {
	const refCanvas = useRef(null);
	const refCanvasCapture = useRef(null);
	const refPlayer = useRef(null);

	const constraints = {
		video: true,
	};

	useEffect(() => {
		if(refPlayer) {
			navigator.mediaDevices.getUserMedia({
				video: true,
			})
			.then((stream) => {
				refPlayer.current.srcObject = stream;
			});
		}
	}, [refPlayer]);

	const handleLoadImgBtnClick = () => {
		let canvas = refCanvas.current; //.getContext("2d");
		let Img = new Image();
		Img.src = img;
		canvas.height = Img.naturalHeight;
		canvas.width = Img.naturalWidth;
		let ctx = canvas.getContext("2d");
		// Dibujar la imágen
		ctx.drawImage(Img, 0, 0, canvas.width, canvas.height);
	};

	const handlePdfBtnClick = () => {
		let canvas = refCanvas.current; //.getContext("2d");
		const doc = new jsPDF();
		console.log(canvas.toDataURL());
		doc.addImage(canvas.toDataURL("image/jpeg"), 'JPEG', 0, 0, 100, 100);
		doc.text("Hello world!", 10, 10);
		doc.save("a4.pdf");
	};

	const captureImage = () => {
		// Draw the video frame to the canvas.
		refCanvasCapture.current.getContext('2d').drawImage(refPlayer.current, 0, 0, refCanvasCapture.current.width, refCanvasCapture.current.height);
	};

	return(
		<div className="Shoot">
			<video ref={refPlayer} controls autoPlay></video>
			<button onClick={captureImage}>Capture</button>
			<canvas ref={refCanvasCapture} width="320" height="240"></canvas>
			<canvas ref={refCanvas} width="300" height="300"></canvas>
			<button onClick={handleLoadImgBtnClick}>Load Image</button>
			<button onClick={handlePdfBtnClick}>PDF</button>
		</div>
	);
};

export default Shoot;