# Credenciales - Municipalidad de Villa Mercedes

## ReactJS

Se utiliza para este software la librería [Reac](https://reactjs.org/) (hook).

## Utilidad

Este software está destinado a imprimir credenciales, en este caso para viajar de forma gratuita en la línea de colectivos de la ciudad de Villa Mercedes (San Luis).

Es bastante simple, se solicitan y almacenan los datos del ciudadano, se le toma una fotografía y se genera, en fomato PDF, la credencial.

El software solo se limita a la generación, en correctas proporciones, de un pdf de 2 páginas que se puede imprimir en cualquier dispositivo.

En nuestro caso utilizamos un dispositivo con caraterísticas especiales para tal fin, [Evolis Primacy](https://identificarsrl.com/detalle-producto/530/impresora-evolis-primacy-single-side?campaign=10111737031&content=436943306368&keyword=%2Bevolis%20primacy&gclid=Cj0KCQjwo-aCBhC-ARIsAAkNQiu35YRIZ5XGlBFUwcpsQ3Pr1yzxVX3BhBgwJnugezk8F0lhW4b4rrsaApeBEALw_wcB).

## Notas

Este proyecto es solo el font-end, utiliza en conjunto una [Api-Rest](https://github.com/Traful/api-credenciales) desarrollada en PHP ([Slim V3](https://www.slimframework.com/)) y una base de datos relacional (MySQL)