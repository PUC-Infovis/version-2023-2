
// SET UP DATA 
const data = d3.json('./Datasets/final_dataset.json').then(data => {

  
  data.sort(function (a, b) {
    return  b.imdb_rating - a.imdb_rating;
  });
  setUpVis1(data);
  setUpControls(data);
  barPlot(data);
})

d3.select("#reset-button").on("click", () => {
  d3.json('./Datasets/final_dataset.json').then(data => {
    currentFilter.sort = 'imdb_rating';
    setFilter(null, currentFilter.type, data);

    data.sort(function (a, b) {
      return b[currentFilter.sort] - a[currentFilter.sort];
    });
    setUpVis1(data);

    d3.select('svg.vis-1').transition().duration(500).call(zoom.transform, d3.zoomIdentity);

    setUpControls(data);
    barPlot(data);
  })
})

const svg = d3.select("svg.vis-1");


const content = d3.select('#content');

// Create a D3 zoom behavior
const zoom = d3.zoom()
  .scaleExtent([0.5, 4]) // Set the zoom scale limits
  .on('zoom', function (event) {
    // Get the current transform of the zoom
    const transform = event.transform;

    // Apply the transform to the content group
    content.attr('transform', transform);
  });


// Apply the zoom behavior to the SVG element
svg.call(zoom);

// Get the content group




let tooltipMovie = d3.select("body")
  .append("div")
  .attr("class", "tooltip-planet")


function setUpToolTipMovie(event, d) {
  tooltipMovie.html(
      `Title: ${d.title}
      <br>Director: ${d.director}
      <br>Country: ${d.country}
      <br>Year: ${d.year}
      <br>Classification: ${d.classification}
      <br>IMDB score: ${d.imdb_rating}
      <br>
      <img src=${d.poster}></img>`
      )
      .style("opacity", 1)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("border", `2px solid ${'white'}`);
}

function moveMovieTooltip(event) {
  const x = event.pageX 
  const y = event.pageY
  tooltipMovie.style("left", (x + 10) + "px")
  .style("top", (y - 28) + "px")
}


color = d3.scaleSequential(d3.interpolateTurbo).domain([0, 6]);
color2 = d3.scaleSequential(d3.interpolateTurbo).domain([209, 85]);


country_colors = {
  // "India": color(3),
  "India": '#95FB51',
  "United States": '#E50914',
  "United Kingdom": '#0766AD',
  'other': 'white'
}

function setUpVis1(data) {
    // the default phyllotaxis arrangement is centered on <0,0> with a distance between nodes of ~10 pixels
    // we will scale & translate it to fit the canvas

    const svg = d3.select("svg.vis-1 g")

    const width = 400;
    const height = 400;

    const center = [width / 2, height / 2];

    // create an array from the imbd ratings 


    const ratings = data.map(
      d => {

        return {'r': ratingRadius(d)}
      });

    const circleCenters = d3.packSiblings(ratings);
    const mergedData = mergeJsonLists(data, circleCenters);

    svg.selectAll("circle")
      .data(mergedData, d => d.title)
      .join(
        enter => {addMovie(enter)},
        update => {updateMovie(update)},
        exit => {removeMovie(exit)}
    )

    function addMovie(enter) {
      const movie = enter.append('circle')
        .attr("id", d => 'c-' + cleanSelector(d.title))
        .attr("cx", d => d.x + center[0])
        .attr("cy", d => d.y + center[1])
        .attr("fill", d => {
          const color = colorByFilter(d);
          if (color) {
            return color;
          }
          else {
            return "white";
          }
        })
        .attr("r", d => 0)

      setTimeout(() => {
        movie.transition('radius')
          .duration(500)
          .attr("r", d => ratingRadius(d));
      }, 1000);

      movie.on("mouseover", ( event, d ) => {
        setUpToolTipMovie(event, d);
      })
      .on("mousemove", moveMovieTooltip)
      .on("mouseout", () => tooltipMovie.style("opacity", 0))

      movie.on("click", (event, d) => {
        setFilter(d);
        setUpCharts();
      })
    }

    function removeMovie(exit) {
      exit.remove();
    }

    function updateMovie(update) {
      update.transition('position')
        .duration(1000)
        .attr("cx", d => d.x + center[0])
        .attr("cy", d => d.y + center[1])
        .attr("fill", d => {
          const color = colorByFilter(d);
          if (color) {
            return color;
          }
          else {
            return "white";
          }
        });
    }
  }





function barPlot(data) {
  data = data.slice(0, 10);
  const thisData = data.slice(0, 10);

  // Add X axis
  function measure(d) {
    return parseFloat(d[currentFilter.sort]);
  }

  const height = 300;

  console.log(d3.min(thisData, d => measure(d)), d3.max(thisData, d => measure(d)))
  console.log(data)

  const x = d3.scaleLinear()
    .domain([d3.min(data, d => measure(d)), d3.max(data, d => measure(d))])
    .range([50, 100]);

  d3.select("svg.vis-2").select(".y-axis").remove();
  d3.select("svg.vis-2").select(".x-axis").remove();


  counter = 1;
  data.forEach(function (json, index) {
      json.position = index + 1;
  });


  const y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d.title))
    .padding(0.1);

  const svg = d3.select("svg.vis-2");
  svg.selectAll(".myRect")
    .data(data, d => d.title)
    .join(
      enter => {
      const bar = enter.append("rect")
        .attr("class", "myRect")
        .attr("x", 150)
        .attr("height", y.bandwidth())
        
      bar.attr("y", d => y(d.title))
        .transition('position')
        .duration(1000)
        .attr("width", d => x(measure(d)))
        .attr("fill", d => {
          const color = colorByFilter(d);
          if (color) {
            return color;
          }
          else {
            return "white";
          }
        });
      bar.on("mouseover", ( event, d ) => {
        setUpToolTipMovie(event, d);
        highLightMovie(d);
      })
      .on("mousemove", moveMovieTooltip)
      .on("mouseout", (event, d) => {
        unHighLightMovie(d);
        tooltipMovie.style("opacity", 0)
      })
  },
  update => {
    update.attr("y", d => y(d.title))
    .transition('position')
    .duration(1000)
    .attr("width", d => x(measure(d)))
    .attr("height", y.bandwidth())
    .attr("fill", d => {
      const color = colorByFilter(d);
      if (color) {
        return color;
      }
      else {
        return "white";
      }
    });
  },
  exit => {
    exit.remove();
  })
  
  svg.append("g")
  .attr('class', 'y-axis')
  .call(d3.axisLeft(y)).attr("transform", "translate(150,0)")

  svg.selectAll('.ratingText')
    .data(data, d => d.title)
    .join(
      enter => {
        const text = enter.append('text')
          .attr("class", "ratingText")
          .attr("x", d => x(measure(d)) + 160)
          .attr("y", d => y(d.title) + y.bandwidth() / 2)
          .attr("fill", "white")
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .text(d => measure(d))
          .attr('opacity', 0)
        text.transition('opacity')
          .duration(1000)
          .attr('opacity', 1)

      },
      update => {
        update.text(d => measure(d))
        .attr("x", d => x(measure(d)) + 160)
        .attr("y", d => y(d.title) + y.bandwidth() / 2)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
      },
      exit => {
        exit.remove();
      }
    )
}

function setUpControls(data) {
  const type = currentFilter.type;
  const tagList = propertiesToArray(data, type);

  // sort the tag list
  tagList.sort(function (a, b) {
    return b - a;
  });
  const colorMap = currentFilter.colorMap;

  tagList.push('other')
  // if (type == 'country' || type == 'classification') {
  // }

  const svg = d3.select("svg.vis-1-controls");
  // Add one dot in the legend for each name.
  svg.selectAll("circle")
    .data(tagList)
    .join(enter => {
      enter.append('circle')
      .attr("cx", 10)
      .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", d => colorMap[d])},
      update => {
        update.style("fill", d => colorMap[d])
      },
      exit => {
        exit.remove();
      })

  // Add one dot in the legend for each name.
  svg.selectAll("text")
    .data(tagList)
    .join(enter => {
      enter.append('text')
        .attr("class", "mylabels")
      .attr("x", 30)
      .attr("x", 30)
      .attr("y", function(d,i){ return 20 + i*25})
      .style("fill", 'white')
      .text(d => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
    },
      update => {
        update.text(d => d)
      },
      exit => {
        exit.remove();
      });
    }




function highLightMovie(movie) {
  const thisMovie = d3.select('#c-' + cleanSelector(movie.title));
  if (thisMovie) {
    thisMovie
      .attr("stroke", "white")
      .attr("stroke-width", 2);

  }
}

function unHighLightMovie(movie) {
  const thisMovie = d3.select('#c-' + cleanSelector(movie.title));
  if (thisMovie) {
    thisMovie.attr("stroke-width", 0);
  }
}