// get the JSON data and console log it
d3.json("samples.json").then(data => {
  // console.log(data);

  // create arrays for names; arrays of objects for metadata and samples
  var names = data.names;

  // empty arrays to house the array of objects for metadata and samples data
  var metadataObjectArray = [];
  var samplesObjectArray = [];

  // add selected subject id to empty arrays
  var metadata = data.metadata;
  metadata.forEach(row => metadataObjectArray.push(row));

  // add selected subject id to empty arrays
  var samples = data.samples;
  samples.forEach(row => samplesObjectArray.push(row));

  // populate the drop down menu
  for (i = 0; i < data.names.length; i++) {
    var dropDownSelect = d3.select("#selDataset");
    dropDownSelect.append("option")
      .text(data.names[i])
      .attr("value", data.names[i]);
  };

  // at page load run below functions to populate for sample 940
  barChart(samples, 940);
  demoInfo(metadata, 940);
  bubbleChart(samples, 940);
});

function demoInfo(metadata, id) {

  var dropDownSelect = d3.select("#selDataset").property("value");
  // console.log(dropDownSelect);
  
  // filter metadata by the id in the drop down selection
  // use unary operator to convert id string to number
  var demoSelection = metadata.filter(d => +d.id === +dropDownSelect);
  // console.log(demoSelection)

  // select div for sample-metadata and clear previous appended info
  var sampleMetadata = d3.select("#sample-metadata").html("");

  // loop through metadata objects and log each key/value pairs with object.entries function
  demoSelection.forEach((getInfo) => {
    Object.entries(getInfo).forEach(([key, value]) => {
      sampleMetadata.append("h5").text(`${key}: ${value}`);
    });
  });
};

function barChart(metadata, id) {

  var dropDownSelect = d3.select("#selDataset").property("value");
  // console.log(dropDownSelect);

  // filter samples data by the id in the drop down selection
  // use unary operator to convert id string to number
  var sampleSelection = metadata.filter(d => +d.id === +dropDownSelect);
  console.log(sampleSelection)

  // put the values for selected id in drop down selection into arrays
  var sampleValues = sampleSelection[0].sample_values;
  var otuIds = sampleSelection[0].otu_ids;
  var otuLabels = sampleSelection[0].otu_labels;

  // slice top ten samples
  var slicedSampleValues = sampleValues.slice(0, 10);

  // reverse the data to show highest value on top on chart
  var reversedSampleValues = slicedSampleValues.reverse();
  var slicedOtu = otuIds.slice(0, 10);

  // convert number array to a string to show on y axis
  var stringOtu = slicedOtu.map(num => `OTU ${num}`);

  // reverse the data to show highest value on top on chart
  var reversedOtu = stringOtu.reverse();
  var slicedLabels = otuLabels.slice(0, 10);

  // define trace for bar chart
  var trace1 = {
    x: reversedSampleValues,
    y: reversedOtu,
    text: slicedLabels,
    name: `id: ${id}`,
    type: "bar",
    orientation: "h"
  };

  // data to be used for the plot
  var data = [trace1];

  // define layout for the bar graph to add title
  var layout = {
    title: `id: ${id} Top Ten OTUs`,
    xaxis: {
      title: {
        text: "Sample Values"
      }
    }
  };

  Plotly.newPlot("bar", data, layout);
}

// function to plot the bubble chart
function bubbleChart(samples, id) {

  var dropDownSelect = d3.select("#selDataset").property("value");
  console.log(dropDownSelect);

  // filter samples data by the id in the drop down selection
  // use unary operator to convert id string to number
  var sampleSelection = samples.filter(d => +d.id === +dropDownSelect);

  // put the values for selected id in drop down selection into arrays
  var otuIds = sampleSelection[0].otu_ids;
  var sampleValues = sampleSelection[0].sample_values;
  var otuLabels = sampleSelection[0].otu_labels;

  // define trace using bubble chart required parameters
  var trace1 = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    name: `id: ${id}`,
    mode: 'markers',
    marker: {
      color: otuIds,
      size: sampleValues,
    }
  };

  // convert to an array to plot
  var data = [trace1];

  // define layout parameters
  var layout = {
    title: `id: ${id} Sample Data`,
    yaxis: {
      title: {
        text: "Sample Values"
      }
    },
    xaxis: {
      title: {
        text: "OTU ID"
      }
    },
  };

  Plotly.newPlot("bubble", data, layout);
}

// refresh the page with new info tied to dropdown selection
function optionChanged(id) {
  // console.log(id),
  d3.json("samples.json").then(data => {
    // console.log(data);

    // create arrays for names; arrays of objects for metadata and samples
    var names = data.names;
    var metadataObjectArray = [];
    var samplesObjectArray = [];

    // add selected subject id to empty arrays
    var metadata = data.metadata;
    metadata.forEach(row => metadataObjectArray.push(row));

    // add selected subject id to empty arrays
    var samples = data.samples;
    samples.forEach(row => samplesObjectArray.push(row));

    demoInfo(metadataObjectArray, id),
    barChart(samplesObjectArray, id);
    bubbleChart(samplesObjectArray, id);
  });
}