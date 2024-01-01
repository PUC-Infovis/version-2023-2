class MultiBoxplot {
    static CreateBoxplot(svg, svgWidth, svgHeight, jsonFilePath, attribute, xOffset = 0) {

        // addapted from https://d3-graph-gallery.com/graph/boxplot_show_individual_points.html

        const boxWidth = 30;

        d3.json(jsonFilePath).then(function(data) {
            var dataProcessed = data.map(function(d) {
                return {...d, [attribute]: parseFloat(d[attribute])};
            });

            // Compute quartiles, median, inter quantile range min and max
            var sumstat = d3.group(dataProcessed, d => d.classification);
            var sumstatArray = Array.from(sumstat).map(([key, value]) => {
                var sortedValues = value.map(d => d[attribute]).sort(d3.ascending);
                var q1 = d3.quantile(sortedValues, 0.25);
                var median = d3.quantile(sortedValues, 0.5);
                var q3 = d3.quantile(sortedValues, 0.75);
                var interQuantileRange = q3 - q1;
                return {
                    key: key,
                    q1: q1,
                    median: median,
                    q3: q3,
                    interQuantileRange: interQuantileRange,
                    min: q1 - 1.5 * interQuantileRange,
                    max: q3 + 1.5 * interQuantileRange
                };
            });

            // Define scales
            var categories = ["poor", "below-average", "average", "above-average", "good"];
            var colorRange = ["FireBrick", "LightCoral", "Khaki", "LightGreen", "ForestGreen"];

            var colorScale = d3.scaleOrdinal().domain(categories).range(colorRange);

            var x = d3.scaleBand().domain(categories).range([xOffset, svgWidth + xOffset]).paddingInner(1).paddingOuter(.5);
            var y = d3.scaleLinear().domain([
                d3.min(sumstatArray, d => d.min - 0.1),
                d3.max(sumstatArray, d => d.max)
            ]).nice().range([svgHeight, 0]);

            svg.append("text")
                .attr("x", -svgHeight / 2)
                .attr("y", -xOffset - 35)
                .attr("transform", "rotate(-90)")
                .attr("font-size", "20px")
                .style("text-anchor", "middle")
                .text(attribute);

            // Append the axis
            svg.append("g").attr("transform", "translate(0," + svgHeight + ")").call(d3.axisBottom(x));
            svg.append("g").call(d3.axisLeft(y));

            // Draw vertical lines
            svg.selectAll(".vertLines").data(sumstatArray).join("line")
                .attr("x1", d => x(d.key) + xOffset).attr("x2", d => x(d.key) + xOffset)
                .attr("y1", d => y(d.min)).attr("y2", d => y(d.max))
                .attr("stroke", "black").style("stroke-width", "1px")
                .attr("class", (d) => `classElement ${d.key}`);

            // Draw boxes
            svg.selectAll(".box").data(sumstatArray).join("rect")
                .attr("x", d => x(d.key) - boxWidth / 2 + xOffset).attr("y", d => y(d.q3))
                .attr("height", d => Math.max(0, y(d.q1) - y(d.q3)))
                .attr("width", boxWidth).attr("stroke", "black")
                .style("fill", d => colorScale(d.key))
                .attr("class", (d) => `classElement ${d.key}`)
                .on('click', function(event, d) {
                    event.stopPropagation(); // Evita que el evento se propague al cuerpo
                    MultiBoxplot.highlightClass(d.key); // Resalta los elementos de la misma clase
                    console.log(d.key); // Hace console.log de la clase
                });


            // Draw median lines
            svg.selectAll(".medianLine").data(sumstatArray).join("line")
                .attr("class", "median-line").attr("x1", d => x(d.key) + x.bandwidth() / 2 - boxWidth / 2 + xOffset)
                .attr("x2", d => x(d.key) + x.bandwidth() / 2 + boxWidth / 2 + xOffset).attr("y1", d => y(d.median))
                .attr("y2", d => y(d.median)).attr("stroke", "black").style("stroke-width", "2px")
                .attr("class", (d) => `classElement median-line ${d.key}`)
                .on('click', function(event, d) {
                    event.stopPropagation(); // Evita que el evento se propague al cuerpo
                    MultiBoxplot.highlightClass(d.key); // Resalta los elementos de la misma clase
                    console.log(d.key); // Hace console.log de la clase
                });

            // Añade puntos encima de los boxplots con variación aleatoria en el eje x
            svg.selectAll(".point")
                .data(dataProcessed) // Utiliza los datos originales
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("cx", d => x(d.classification) + xOffset + Math.random() * 10 - 5) // Variación aleatoria en el eje x
                .attr("cy", d => y(d[attribute]))
                .attr("r", 1) // Tamaño de los puntos
                .style("fill", d => colorScale(d.classification))
                .style("stroke", "grey")
                
            svg.append("rect")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .style("fill", "none")
                .style("pointer-events", "all")
                .lower();

             // Añadiendo zoom al SVG completo
            const zoom = d3.zoom()
                .scaleExtent([1, 5])  // Definiendo límites para el zoom
                .translateExtent([[0, 0], [svgWidth, svgHeight]])
                .on("zoom", (event) => {
                    svg.attr('transform', event.transform);
                });

            svg.call(zoom);
    
            function resetZoom() {
                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity);
            }
            svg.on("dblclick.zoom", resetZoom);
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

export { MultiBoxplot };
