
const SVG6 = d3.select("#vis-6").append("svg");

const DATOS2 = "data/educacion_superior.json"

// Descripción   -----------------------------------------------------------------------------------


// ----------------------------------  VISUALIZACIÓN 2  --------------------------------------------
const WIDTH_VIS_5 = 800;
const HEIGHT_VIS_5 = 450;
const SVG5 = d3.select("#vis-5").append("svg");
SVG5.attr("width", WIDTH_VIS_5).attr("height", HEIGHT_VIS_5);

// Datos para barras 
const niveles = ["Pregrado", "Magister", "Doctorado"];
const columnaX = WIDTH_VIS_5 / 2;
const columnaY = HEIGHT_VIS_5 / 4;

// Configuración de hexágono
const radio = 50;
const hexagono = [
    [0, -1 * radio],
    [Math.sqrt(3) / 2 * radio, -0.5 * radio],
    [Math.sqrt(3) / 2 * radio, 0.5 * radio],
    [0, 1 * radio],
    [-Math.sqrt(3) / 2 * radio, 0.5 * radio],
    [-Math.sqrt(3) / 2 * radio, -0.5 * radio],
];
const barraWidth2 = 240;
const barraWidth = 300;
const barraAltura = 50;
const trianguloSize = 25;

// Añadir un atributo de radio a cada punto del hexágono para redondear las esquinas
const hexagonoRedondeado = hexagono.map(point => [point[0], point[1], radio]);

const escalaAncho = d3.scaleLinear()
    .domain([0, 100])
    .range([0, barraWidth2]);

StemChile();

function StemChile() {
    d3.json(DATOS2).then(data => {
        console.log(data);

        const color = "#c9c9c9"; // Color crema oscuro
        const barraColor = "rgba(201, 201, 201, 0.5)"; // Color de las barras laterales con menor opacidad


        SVG5.selectAll("rect.barraIzquierda")
            .data(niveles)
            .enter()
            .append("rect")
            .attr("class", "barraIzquierda") // Clase para seleccionar fácilmente las barras izquierdas más adelante
            .attr("x", (d, i) => columnaX - barraWidth / 2 - radio - 100)
            .attr("y", (d, i) => columnaY + i * 2 * radio * 1.3 - barraAltura / 2)
            .attr("width", barraWidth)
            .attr("height", barraAltura)
            .attr("fill", barraColor);

        SVG5.selectAll("rect.barraDerecha")
            .data(niveles)
            .enter()
            .append("rect")
            .attr("class", "barraDerecha") // Clase para seleccionar fácilmente las barras derechas más adelante
            .attr("x", (d, i) => columnaX + radio - barraWidth / 2 + 100)
            .attr("y", (d, i) => columnaY + i * 2 * radio * 1.3 - barraAltura / 2)
            .attr("width", barraWidth)
            .attr("height", barraAltura)
            .attr("fill", barraColor);

        SVG5.selectAll("polygon.trianguloIzquierda")
            .data(niveles)
            .enter()
            .append("polygon")
            .attr("class", "trianguloIzquierda")
            .attr("points", (d, i) => {
                const x = columnaX - barraWidth / 2 - radio + 525;
                const y = columnaY + i * 2 * radio * 1.3 - barraAltura / 2 + barraAltura / 2;
                return `${x},${y} ${x - trianguloSize},${y + trianguloSize} ${x - trianguloSize},${y - trianguloSize}`;
            })
            .attr("fill", barraColor);

        SVG5.selectAll("polygon.trianguloDerecha")
            .data(niveles)
            .enter()
            .append("polygon")
            .attr("class", "trianguloDerecha")
            .attr("points", (d, i) => {
                const x = columnaX + radio - barraWidth / 2 - 225;
                const y = columnaY + i * 2 * radio * 1.3 - barraAltura / 2 + barraAltura / 2;
                return `${x},${y} ${x + trianguloSize},${y + trianguloSize} ${x + trianguloSize},${y - trianguloSize}`;
            })
            .attr("fill", barraColor);

        //----------------------------------------------------------------------------------------------

        // Crear los hexágonos
        SVG5.selectAll("path.hexagono")
            .data(niveles)
            .enter()
            .append("path")
            .attr("class", "hexagono") // Clase para seleccionar fácilmente los hexágonos más adelante
            .attr("d", d3.line().curve(d3.curveLinearClosed)(hexagonoRedondeado))
            .attr("transform", (d, i) => `translate(${columnaX}, ${columnaY + i * 2 * radio * 1.3})`)
            .attr("fill", color);

        // Añadir etiquetas encima de los hexágonos
        SVG5.selectAll("text.Legend")
            .data(niveles)
            .enter()
            .append("text")
            .attr("class", "Legend")
            .attr("x", columnaX)
            .attr("y", (d, i) => columnaY + i * 2 * radio * 1.3 + 20)
            .attr("dy", "-1em")
            .attr("text-anchor", "middle")
            .text(d => d)
            .attr("fill", "white") // Cambia el color del texto a blanco
            .style("font-family", "Lato, sans-serif");


        // Botón para Ciencias
        d3.select("#btnCiencias")
            .on("click", function () {
                updateBars("Ciencias");
            });

        // Botón para Tecnología
        d3.select("#btnTecnologia")
            .on("click", function () {
                updateBars("Tecnologia");
            });

        updateBars("Ciencias")
    });
}

function updateBars(tipo) {
    d3.json(DATOS2).then(data => {

        console.log(data);
        SVG5.selectAll("rect.Barra1")
            .data(niveles)
            .enter()
            .append("rect")
            .attr("class", "Barra1")
            .attr("x", (d, i) => columnaX + barraWidth2 / 2 - radio - 350)
            .attr("y", (d, i) => columnaY + i * 2 * radio * 1.3 - barraAltura / 2)
            .attr("width", barraWidth2)
            .attr("height", barraAltura)
            .attr("fill", "#8FB1BE");

        SVG5.selectAll("rect.Barra2")
            .data(niveles)
            .enter()
            .append("rect")
            .attr("class", "Barra2") // Clase para seleccionar fácilmente las barras derechas más adelante
            .attr("x", (d, i) => columnaX + radio - barraWidth2 / 2 + 113)
            .attr("y", (d, i) => columnaY + i * 2 * radio * 1.3 - barraAltura / 2)
            .attr("width", barraWidth2)
            .attr("height", barraAltura)
            .attr("fill", "#D53302");

        // Barra izquierda hombres ----------------------------------------------------------------
        const Barra1 = SVG5.selectAll("rect.Barra1")
            .data(niveles);

        Barra1.enter()
            .append("rect")
            .attr("class", "Barra1")
            .merge(Barra1)
            .transition()
            .duration(500)
            .attr("width", d => {
                const nivelData = data.find(item => item.Nivel === d);
                const anchoBarra = nivelData ? escalaAncho(100 - (tipo === "Tecnologia" ? nivelData.Tecnologia : nivelData.Ciencias)) : 0;
                return anchoBarra;
            })
            .attr("x", (d, i) => {
                const nivelData = data.find(item => item.Nivel === d);
                const anchoBarra = nivelData ? escalaAncho(100 - (tipo === "Tecnologia" ? nivelData.Tecnologia : nivelData.Ciencias)) : 0;
                return columnaX + barraWidth2 / 2 - radio - 113 - anchoBarra;
            });

        // Actualizar etiquetas de valor para Barra1
        const label1 = SVG5.selectAll(".label1")
            .data(niveles);

        label1.enter()
            .append("text")
            .attr("class", "label1")
            .merge(label1)
            .transition()
            .duration(500)
            .attr("x", 650)
            .attr("y", (d, i) => columnaY + i * 2 * radio * 1.3)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text(d => {
                const nivelData = data.find(item => item.Nivel === d);
                return nivelData ? (tipo === "Tecnologia" ? nivelData.Tecnologia : nivelData.Ciencias) + "%" : "";
            })
            .style("fill", tipo === "Tecnologia" ? "#D53302" : "#D53302")
            .style("font-family", "Lato")
            .style("font-size", "16px");

        // Barra derecha mujeres  ----------------------------------------------------------------
        const Barra2 = SVG5.selectAll("rect.Barra2")
            .data(niveles);

        Barra2.enter()
            .append("rect")
            .attr("class", "Barra2")
            .merge(Barra2)
            .transition()
            .duration(500)
            .attr("width", d => {
                const nivelData = data.find(item => item.Nivel === d);
                return nivelData ? escalaAncho(tipo === "Tecnologia" ? nivelData.Tecnologia : nivelData.Ciencias) : 0;
            });

        // Actualizar etiquetas de valor para Barra2
        const label2 = SVG5.selectAll(".label2")
            .data(niveles);

        label2.enter()
            .append("text")
            .attr("class", "label2")
            .merge(label2)
            .transition()
            .duration(500)
            .attr("x", 120)
            .attr("y", (d, i) => columnaY + i * 2 * radio * 1.3)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text(d => {
                const nivelData = data.find(item => item.Nivel === d);
                return nivelData ? (tipo === "Tecnologia" ? 100 - nivelData.Tecnologia : 100 - nivelData.Ciencias) + "%" : "";
            })
            .style("fill", tipo === "Tecnologia" ? "#8FB1BE" : "#8FB1BE")
            .style("font-family", "Lato")
            .style("font-size", "16px");
    });
}

// Conclusiones   -----------------------------------------------------------------------------------

SVG5.append("text")
    .attr("x", 30)
    .attr("y", 15)
    .attr("font-family", "Montserrat")
    .attr("font-size", "15px")
    .attr("font-weight", "bold")
    .text("Mujeres");

SVG5.append("text")
    .attr("x", 30)
    .attr("y", 45)
    .attr("font-family", "Montserrat")
    .attr("font-size", "15px")
    .attr("font-weight", "bold")
    .text("Hombres");

SVG5.append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", 9)
    .attr("fill", "#D53302");

SVG5.append("circle")
    .attr("cx", 10)
    .attr("cy", 40)
    .attr("r", 9)
    .attr("fill", "#8FB1BE");

const WIDTH_VIS_6 = 400;
const HEIGHT_VIS_6 = 450;
SVG6.attr("width", WIDTH_VIS_6).attr("height", HEIGHT_VIS_6);


SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .attr("fill", "#FCC560")
    .text("¿Sabías qué?")
    .attr("transform", function (d, i) {
        return `translate(200,30)`;
    })


SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#252850")
    .text("En las universidades de Chile,")
    .attr("transform", function (d, i) {
        return `translate(210,80)`;
    })

SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#252850")
    .text("de un total de 60 rectores")
    .attr("transform", function (d, i) {
        return `translate(210,100)`;
    })
SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#D53302")
    .attr("font-weight", "bold")
    .text("solo 5 son mujeres")
    .attr("transform", function (d, i) {
        return `translate(210,120)`;
    })



SVG6.append("text")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#D53302")
    .text("Solo el 20%")
    .attr("font-weight", "bold")
    .attr("transform", function (d, i) {
        return `translate(135,160)`;
    })

SVG6.append("text")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#252850")
    .text("de los ")
    .attr("transform", function (d, i) {
        return `translate(233,160)`;
    })

SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#252850")
    .text("proyectos CORFO - Innova")
    .attr("transform", function (d, i) {
        return `translate(210,180)`;
    })
SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#D53302")
    .attr("font-weight", "bold")
    .text("son liderados por mujeres")
    .attr("transform", function (d, i) {
        return `translate(210,200)`;
    })



SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#252850")
    .text("El año 2022, las mujeres")
    .attr("transform", function (d, i) {
        return `translate(210,240)`;
    })

SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#252850")
    .text("matriculadas en el área STEM")
    .attr("transform", function (d, i) {
        return `translate(210,260)`;
    })
SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#D53302")
    .attr("font-weight", "bold")
    .text("fueron solo un 32% del total")
    .attr("transform", function (d, i) {
        return `translate(210,280)`;
    })



SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#252850")
    .text("De un total de 560 Premios")
    .attr("transform", function (d, i) {
        return `translate(210,320)`;
    })

SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#252850")
    .text("Nobel de la ciencia,")
    .attr("transform", function (d, i) {
        return `translate(210,340)`;
    })
SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#D53302")
    .attr("font-weight", "bold")
    .text("solo 18 han sido")
    .attr("transform", function (d, i) {
        return `translate(210,360)`;
    })

SVG6.append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "Montserrat")
    .attr("font-size", "16px")
    .attr("fill", "#D53302")
    .attr("font-weight", "bold")
    .text("entregados a mujeres (3%)")
    .attr("transform", function (d, i) {
        return `translate(210,380)`;
    })