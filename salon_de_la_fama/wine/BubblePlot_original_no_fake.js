class BubblePlot {
    static CreateBubblePlot(jsonFilePath, margin, WIDTH, HEIGHT){

        const WIDTHVIS = WIDTH - margin.right - margin.left
        const HEIGHTVIS = HEIGHT - margin.top - margin.bottom
    
        d3.json(jsonFilePath).then(function(data) {
            var dataProcessed = data.map(function(d) {
                return {...d,   ["alcohol"]: parseFloat(d["alcohol"]),
                                ["pH"]: parseFloat(d["pH"]),
                                ["residual sugar"]: parseFloat(d["residual sugar"]),
                                ["quality"]: parseFloat(d["quality"])};
            });
    
        const minValueY = d3.min(dataProcessed, (d) => d["alcohol"]) - 1;
        const minValueX = d3.min(dataProcessed, (d) => d["quality"]) - 1;
    
        const maxValueY = d3.max(dataProcessed, (d) => d["alcohol"]) + 1;
        const maxValueX = d3.max(dataProcessed, (d) => d["quality"]) + 1;
    
        const minValueAcidity = d3.min(dataProcessed, (d) => d["pH"]);
        const maxValueAcidity = d3.max(dataProcessed, (d) => d["pH"]);

        console.log("minValueAcidity: " + minValueAcidity);
        console.log("maxValueAcidity: " + maxValueAcidity);
    
        const minValueSugar = d3.min(dataProcessed, (d) => d["residual sugar"]);
        const maxValueSugar = d3.max(dataProcessed, (d) => d["residual sugar"]);

        console.log("minValueSugar: " + minValueSugar);
        console.log("maxValueSugar: " + maxValueSugar);
    
        const yScale = d3
        .scaleLinear()
        .domain([minValueY, maxValueY])
        .range([HEIGHTVIS, 0]);
    
        const xScale = d3
            .scaleLinear()
            .domain([minValueX, maxValueX])
            .range([0, WIDTHVIS]);
    
        const colorScale = d3
            .scaleLinear()
            .domain([minValueAcidity, maxValueAcidity])
            .range(["red", "blue"]);
    
        const readiusScale = d3
            .scaleLinear()
            .domain([minValueSugar, maxValueSugar])
            .range([3, 20]);
    
        const bubblePlotSVG = d3
            .select("#visualization2")
            .append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT);
    
    
        const ejeY = d3.axisLeft(yScale);
        const ejeX = d3.axisBottom(xScale);
    
        bubblePlotSVG
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(ejeY);
    
        bubblePlotSVG
            .append("g")
            .attr("transform", `translate(${margin.left}, ${HEIGHTVIS + margin.bottom})`)
            .call(ejeX);
    
        // axis titles
    
        bubblePlotSVG.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", WIDTHVIS + margin.left - 10)
            .attr("y", HEIGHTVIS + margin.top + 20)
            .text("quality")
            .attr("font-size", "20px");
    
        bubblePlotSVG.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", margin.top - 20)
            .attr("x", -margin.left - 8)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("alcohol")
            .attr("font-size", "20px");
    
        ////////////////////////////////////////////////////
        // Crear visualización
        ////////////////////////////////////////////////////
    
        const contenedorPuntos = bubblePlotSVG
            .append("g")
            .attr("transform", `translate(${margin.left} ${margin.top})`);
    
        const puntos = contenedorPuntos
            .selectAll("circle")
            .data(dataProcessed)
            .join("circle")
            .attr("fill", "gray")
            .attr("r", 2)
            .attr("opacity", 0.2)
            .attr("cx", (d) => xScale(d["quality"]))
            .attr("cy", (d) => yScale(d["alcohol"]))
            .attr("class", (d) => `classElement ${d["classification"]}`)
            .on('click', function(event, d) {
                event.stopPropagation(); // Evita que el evento se propague al cuerpo
                BubblePlot.highlightClass(d.classification); // Resalta los elementos de la misma clase
                console.log(d.classification); // Hace console.log de la clase
            });
    
        let texto = d3.select("#visualization2").append("div")
    
        ////////////////////////////////////////////////////
        // Brush
        ////////////////////////////////////////////////////
    
        // Contenedor de nuestro brush. 
        // Este tiene que estar posicionado en el mismo lugar que nuestro
        // contendeorPuntos
        const contenedorBrush = bubblePlotSVG
            .append("g")
            .attr("transform", `translate(${margin.left} ${margin.top})`);
    
        // Función que detecta el blush y hará lo que nosotros querramos
        const brushed = (evento) => {
        const selection = evento.selection;
    
        const xMin = xScale.invert(selection[0][0]);
        const yMax = yScale.invert(selection[0][1]);
    
        const xMax = xScale.invert(selection[1][0]);
        const yMin = yScale.invert(selection[1][1]);
    
        // console.log([[xMin, yMin], [xMax, yMax]])
    
        const filter = (d) =>
            xMin <= d["quality"] && d["quality"] <= xMax && yMin <= d["alcohol"] && d["alcohol"] <= yMax;
    
        puntos
            .attr("fill", (d) => (filter(d) ? "green" : colorScale(d["pH"])))
            .attr("opacity", (d) => (filter(d) ? 1 : 1))
            .attr("r", (d) => (filter(d) ? 6 : readiusScale(d["residual sugar"])));
    
        // Extra. Obtenemos los datos filtrados e indicamos cuantos son
    
        let filtrados = dataProcessed.filter(filter);
    
        var averageAlcohol = filtrados.length > 0 ? d3.mean(filtrados, (d) => d["alcohol"]).toFixed(2) : 0;
        var averagePH = filtrados.length > 0 ? d3.mean(filtrados, (d) => d["pH"]).toFixed(2) : 0;
        var averageSugar = filtrados.length > 0 ? d3.mean(filtrados, (d) => d["residual sugar"]).toFixed(2) : 0;
    
        texto.text(`Se han seleccionado ${filtrados.length} datos. La media de alcohol es ${averageAlcohol}%, la media de pH es ${averagePH} y la media de azúcar es ${averageSugar} g/dm3`);
        };
    
        // Crear nuestro objeto brush
        const brush = d3.brush()
        // Definir la extensión donde se puede mover el brush
        .extent([
            [0, 0],
            [WIDTHVIS, HEIGHTVIS],
        ])
        // Conectar el evento brush con nuestra función
        .on("brush", brushed);
    
        // Definir posibles filtros para cuando activar el evento brush o no
        brush.filter((event) => {
    
        // Detectar el tipo de brush. En la visualización o en el cuadro de selección
        const typeEvent = event.target.__data__.type
    
        return (
            !event.ctrlKey &&
            !event.button &&
            typeEvent !== "overlay"
        );
        })
    
        // Llenar nuestro contenedorBrush con los elementos
        // necesarios para que funcione nuestro brush
        contenedorBrush.call(brush)
    
        // Activar el brush de antemano en alguna zona
        contenedorBrush.call(brush.move, [
        [100, 100],
        [200, 200],
        ]);
    
        // Aplicar cambios al rect que representa el cuadro de selección
        contenedorBrush.select(".selection").attr("fill", "green");
    
        // Aplicar cambios al rect que representa toda la zona de brush
        contenedorBrush.select(".overlay").style("cursor", "default");
    
        // Aplicar cambios a los rect de las orillas del cuadro de selección
        // que permiten cambiar su tamaño. en este caso, eliminar esos
        // rect para que no se pueda cambiar el tamaño
        contenedorBrush.selectAll(".handle").remove();
    
        });
    }

    static highlightClass(selectedClass) {
        // Resalta todos los elementos de la clase seleccionada en todos los SVG
        d3.selectAll(`.${selectedClass}`)
           .style('opacity', 1);
    
        // Disminuye la opacidad de los elementos que no son de la clase seleccionada
        d3.selectAll('.classElement:not(.' + selectedClass + ')')
           .style('opacity', 0.1);
    }
}

export { BubblePlot };
