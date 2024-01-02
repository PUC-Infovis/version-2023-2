const dataPath = "./Datasets/final_dataset.json";

const width = 400;
const height = 400;
const margin = {top: 30, right: 30, bottom: 70, left: 60};


let DATA = {};

Promise.all([d3.json(dataPath)]).then((data) => {
    data[0].forEach(d => d.imdb_rating = Math.floor(d.imdb_rating));
    data[0].forEach(d => d.Meta_score = Math.floor(d.Meta_score/10)*10);
    data[0].forEach(d => d.duration = Math.floor(d.duration/10)*10);
    DATA = data[0];
    //console.log(DATA);
    yCat = d3.select("#y-ax-opt").property("value");
    xCat = d3.select("#x-ax-opt").property("value");
    drawHeatmap(DATA, yCat, xCat);
});


function drawHeatmap(data, yCat, xCat) {
    //console.log(data);
    var svg = d3.select("#heat")
    if (svg) {
        svg.selectAll("*").transition().duration(300).attr("opacity", 0)
        svg.selectAll("*").remove();
    }
    svg = d3.select("#heat")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    var xGroups = data.map(m => m[xCat]);
    var yGroups = data.map(m => m[yCat]);
    yGroups = [...new Set(yGroups)];
    yGroups.sort(function(a, b) {
        return a - b;
    });
    xGroups = [...new Set(xGroups)];
    xGroups.sort(function(a, b) {
        return a - b;
    });
    //console.log(yGroups)
    //console.log(xGroups)
    const xScale = d3.scaleBand().domain(xGroups).range([0, width]);
    // add x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .transition().duration(300).attr("opacity", 1);

    const yScale = d3.scaleBand().domain(yGroups).range([height, 0]);

    svg.append("g")
        .attr("transform", "translate(" + width + ", 0)")
        .call(d3.axisRight(yScale))
        .selectAll("text")
        .style("text-anchor", "start")
        .transition().duration(300).attr("opacity", 1);

    var cellsDict = {};
    var cellsIDs = [];
    data.forEach(d => {
        if (!cellsDict[d[xCat] + "|" + d[yCat]]) {
            cellsDict[d[xCat] + "|" + d[yCat]] = 1;
            cellsIDs.push({"value": [xCat] + "|" + d[yCat]});
        } else {
            cellsDict[d[xCat] + "|" + d[yCat]] += 1;
        }
    });

    //console.log(cellsDict)
    //console.log(cellsIDs)
    var maxVal = 0;
    var minVal = 0;
    for (var key in cellsDict) {
        if (cellsDict[key] > maxVal) {
            maxVal = cellsDict[key];
        }
        if (cellsDict[key] < minVal) {
            minVal = cellsDict[key];
        }
    }
    
    const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([minVal, maxVal]);
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d[xCat]))
        .attr("y", d => yScale(d[yCat]))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(cellsDict[d[xCat] + "|" + d[yCat]]))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("id", d => d[xCat] + "|" + d[yCat])
        .text(d => {
            d[xCat] + "|" + d[yCat];
            showTextOverRect(xScale(d[xCat]) + xScale.bandwidth()/2, yScale(d[yCat]) + yScale.bandwidth()/2, cellsDict[d[xCat] + "|" + d[yCat]], colorScale(cellsDict[d[xCat] + "|" + d[yCat]]));
            return d[xCat] + "|" + d[yCat];
        })
        .transition().duration(300).attr("opacity", 1);
        // .on("mouseover", function(d) {
        //     d3.select(this).attr("stroke-width", 2);
        // })
        // .on("mouseout", function(d) {
        //     d3.select(this).attr("stroke-width", 1);
        // })
    
    
    svg.selectAll("text")
        .data(cellsIDs)
        .enter()
        .text(d => {
            //console.log(d);
            return d;
        })
        .transition().duration(300).attr("opacity", 1);

}

function showTextOverRect (rx, ry, text, fill_str) {
    const svg = d3.select("#heat").select("svg");
    var fill_rgb = d3.rgb(fill_str);
    //console.log(fill_rgb);
    // rgb to grayscale 
    var gray = 0.299 * fill_rgb.r + 0.587 * fill_rgb.g + 0.114 * fill_rgb.b;
    if (gray > 130) {
        var fill = "darkslategray";
    } else {
        var fill = "white";
    }
    svg.append("text")
        .attr("class", "text-over-rect")
        .attr("x", rx)
        .attr("y", ry + 5)
        .attr("text-anchor", "middle")
        .attr("fill", fill)
        .text(text)
        .transition().duration(300).attr("opacity", 1);
}

d3.select("#x-ax-opt").on("change", function() {
    xCat = this.value;
    yCat = d3.select("#y-ax-opt").property("value");
    drawHeatmap(DATA, yCat, xCat);
});

d3.select("#y-ax-opt").on("change", function() {
    yCat = this.value;
    xCat = d3.select("#x-ax-opt").property("value");
    drawHeatmap(DATA, yCat, xCat);
});
