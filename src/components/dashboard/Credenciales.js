import React, { useContext } from "react";
import Context from "./../../store/Context";
import Title from "./Title";
import CssBaseline from "@material-ui/core/CssBaseline";

import FindDNI from "./Credenciales/FindDNI";
import Editor from "./Credenciales/Editor";
import CredencialPDF from "./Credenciales/CredencialPDF";

const Credenciales = () => {
	const context = useContext(Context);

	var extraTitulo = "";

	if(context.state.credencial.buscada) {
		if(context.state.credencial.encontrada) {
			extraTitulo = "(Modificación)";
		} else {
			extraTitulo = "(Nuevo Registro)";
		}
	}

	if(context.state.credencial.iraimpresion) {
		extraTitulo = "(Credencial)";
	}

	return(
		<div className="Credenciales">
			<CssBaseline />
			<Title>{`Beneficiario ${extraTitulo}`}</Title>
			{
				context.state.credencial.buscada ?
				context.state.credencial.iraimpresion ?
				<CredencialPDF />
				:
				<Editor credencialData={context.state.credencial} />
				:
				<FindDNI />
			}
		</div>
	);
};

export default Credenciales;