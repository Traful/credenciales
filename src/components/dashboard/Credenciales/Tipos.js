import React, { useState, useEffect } from "react";

const options = [
	{ id: "1", name: "Docentes", image: "http://localhost/credenciales/Docentes.jpg" },
	{ id: "2", name: "Estudiante ciclo Inicial, Primario y Secundario", image: "http://localhost/credenciales/EstudianteIPS.jpg" },
	{ id: "3", name: "Estudiante Universitario", image: "http://localhost/credenciales/EstudianteUniversitario.jpg" },
	{ id: "4", name: "Jubilados y Pensionados", image: "http://localhost/credenciales/JubiladosYPensionados.jpg" },
	{ id: "5", name: "Personal de Salud, Bomberos, Def. Civil y Seguridad", image: "http://localhost/credenciales/PersonalSBDCS.jpg" },
	{ id: "6", name: "Vecino Responsable", image: "http://localhost/credenciales/VecinoResponsable.jpg" },
];

const Tipos = ({onOptionChange}) => {
	const [selectedOption, setSelectedOption] = useState("1");

	useEffect(() => {
		onOptionChange(options[0]);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOptionChange = (event) => {
		setSelectedOption(event.target.value);
		let selected = options.filter((valor) => valor.id === event.target.value);
		onOptionChange(selected[0]);
	};

	return(
		<div className="Tipos">
			<select name="tipos" id="tipos" value={selectedOption} onChange={handleOptionChange}>
				{
					options.map(tipo => {
						return <option key={`opt-${tipo.id}`} value={tipo.id}>{tipo.name}</option>
					})
				}
			</select>
		</div>
	);
};

export default Tipos;