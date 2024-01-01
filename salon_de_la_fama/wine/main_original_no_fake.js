import { MultiBoxplot } from './MultiBoxplot.js';
import { BubblePlot } from './BubblePlot.js';
const jsonFilePath = 'data/winequality-red.json';

function main() {
    CreateFirstVisualization();
    CreateSecondVisualization();
    addOnClickEvent();
}

function CreateFirstVisualization() {
    const margin = { top: 10, right: 30, bottom: 60, left: 60 };
    const WIDTH = 400 - margin.left - margin.right;
    const HEIGHT = 400 - margin.top - margin.bottom;

    var alcoholBoxPlotSVG = CreateSVGForFirstVisualization(margin, WIDTH, HEIGHT);
    var acidityBoxPlotSVG = CreateSVGForFirstVisualization(margin, WIDTH, HEIGHT);
    var sugarBoxPlotSVG = CreateSVGForFirstVisualization(margin, WIDTH, HEIGHT);

    MultiBoxplot.CreateBoxplot(alcoholBoxPlotSVG, WIDTH, HEIGHT, jsonFilePath, "alcohol");
    MultiBoxplot.CreateBoxplot(acidityBoxPlotSVG, WIDTH, HEIGHT, jsonFilePath, "pH");
    MultiBoxplot.CreateBoxplot(sugarBoxPlotSVG, WIDTH, HEIGHT, jsonFilePath, "residual sugar");
}

function CreateSVGForFirstVisualization(margin, WIDTH, HEIGHT) {
    return d3
        .select("#visualization1")
        .append("svg")
        .attr("width", WIDTH + margin.left + margin.right)
        .attr("height", HEIGHT + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function CreateSecondVisualization() {
    const margin = { top: 40, right: 30, bottom: 40, left: 60 };
    const WIDTH = 1200;
    const HEIGHT = 600;
    BubblePlot.CreateBubblePlot(jsonFilePath, margin, WIDTH, HEIGHT);
}

function highlightClass(selectedClass) {
    // Resalta todos los elementos de la clase seleccionada en todos los SVG
    d3.selectAll(`.${selectedClass}`)
       .style('opacity', 1);

    // Disminuye la opacidad de los elementos que no son de la clase seleccionada
    d3.selectAll('.classElement:not(.' + selectedClass + ')')
       .style('opacity', 0.1);
}

function resetOpacity() {
    // Restablece la opacidad de todos los elementos
    d3.selectAll('.classElement')
       .style('opacity', 1);
}

function addOnClickEvent() {
    // Esta función debería ser llamada después de que todos los elementos gráficos han sido creados
    // y después de que las funciones highlightClass y resetOpacity estén definidas.
    d3.selectAll('.classElement').on('click', function(event, d) {
        var currentClass = d.classification; // Usa el dato directamente
        console.log(currentClass); // Registra la clase en la consola
        highlightClass(currentClass); // Llama a la función de resaltado
        event.stopPropagation(); // Evita que el evento se propague al cuerpo
    });

    // Restablece la opacidad al hacer clic fuera de los elementos gráficos
    d3.select('body').on('click', resetOpacity);
}

main();
