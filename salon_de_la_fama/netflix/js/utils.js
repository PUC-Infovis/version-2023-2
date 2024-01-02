

function randomizeSaturation(color) {
  // return color;
    if (Math.random() > 0.5) {
        const funct = d3.interpolateRgb(color, 'white');
        return funct(Math.random() / 6);
    } else {
        const funct = d3.interpolateRgb(color, 'black');
        return funct(Math.random() / 6);
    }

}


function ratingRadius(d) {
    const rating = d.imdb_rating;
    return (rating - 6.5) * 9;
}

function mergeJsonLists(list1, list2) {
    if (list1.length !== list2.length) {
      throw new Error('Input lists must have the same length');
    }
  
    const mergedList = [];
  
    for (let i = 0; i < list1.length; i++) {
      const mergedJson = { ...list1[i], ...list2[i] };
      mergedList.push(mergedJson);
    }
  
    return mergedList;
  }

// Count the frequency of each property (with help of chatGPT)
function propertiesToArray(jsonData, property) {
  const propertyCounts = jsonData.reduce((acc, item) => {
    const thisProperty = item[property];
    acc[thisProperty] = (acc[thisProperty] || 0) + 1;
    return acc;
  }, {});

  // Filter properties with a frequency greater than or equal to 5
  const filteredProperties = Object.keys(propertyCounts)
    .filter(property => propertyCounts[property] >= 5);

  // Create an array in order of frequency
  const sortedProperties = filteredProperties.sort((a, b) => propertyCounts[b] - propertyCounts[a]);

  // Display the result
  return sortedProperties;
}


function getMinMax(data, key) {
  let { max, min } = data.reduce((acc, obj) => {
    let value = obj[key];

    acc.max = Math.max(acc.max, value);
    acc.min = Math.min(acc.min, value);

    return acc;
  }, { max: -Infinity, min: Infinity });  
  return { max, min };
}

function cleanSelector(inputString) {
  // Use a regular expression to keep only allowed characters
  let cleanedString = inputString.replace(/[^a-zA-Z0-9-_]/g, '');

  return cleanedString;
}