console.log("Config file");

const currentFilter = {
    'type': 'country',
    'specific': null,
    'tagList': null,
    'colorMap': country_colors,
    'sort': 'imdb_rating'
}


function generateColorMap(data, categories, property) {
    if (property == 'country') {
        return country_colors;
    } if (property == 'classification') {
        // var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        var colorScale = d3.scaleOrdinal(d3.schemeSet1);
    } else {
        categories.sort(function (a, b) {
            return b - a;
        });
        console.log("categories: ", categories.length)
        var colorScale = d3.scaleSequential(d3.interpolateTurbo)
        .domain([categories.length, 0]);
    }
    var colorDictionary = {};
    var counter = 0;
    categories.forEach(function(category) {
        colorDictionary[category] = colorScale(counter);
        counter++;
    });
    colorDictionary['other'] = 'white';
    return colorDictionary;
}

function colorByFilter(movie) {
    return currentFilter.colorMap[movie[currentFilter.type]];
}

function setFilter(movie, newType, data) {
    if (newType) {
        currentFilter.type = newType;
        const tagList = propertiesToArray(data, newType);
        currentFilter.tagList = tagList;
        currentFilter.colorMap = generateColorMap(data, tagList, newType);
    } if (movie) {
        const type = currentFilter.type;
        currentFilter.specific = movie[type];
    }
}

function applyFilter(data) {
    if (!currentFilter.specific) {
        return data;
    }
    return d3.filter(data, d => d[currentFilter.type] == currentFilter.specific)
}

function setUpCharts() {
    d3.json('./Datasets/final_dataset.json').then(data => {
        data.sort(function (a, b) {
            return b[currentFilter.sort] - a[currentFilter.sort];
        });
        setUpVis1(applyFilter(data));
        barPlot(applyFilter(data));
        setUpControls(data) 
    })
}


d3.select("#classification").on("change", (_) => {
    let selectedField = document.getElementById("classification").selectedOptions[0].value;
    currentFilter.specific = null;
    d3.json('./Datasets/final_dataset.json').then(data => {
        setFilter(null, selectedField, data);
        setUpCharts();
    });
})

d3.select("#sortBy").on("change", (_) => {
    let selectedSort = document.getElementById("sortBy").selectedOptions[0].value;
    console.log("sorting by", selectedSort)
    currentFilter.specific = null;
    d3.json('./Datasets/final_dataset.json').then(data => {
        currentFilter.sort = selectedSort;
        setFilter(null, null, data);
        setUpCharts();
    });
})

