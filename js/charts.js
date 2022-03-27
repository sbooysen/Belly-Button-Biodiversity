function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  document.body.style.backgroundColor = "orange";

  
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {


    var wfreq = data.metadata.map(d => d.wfreq)
    console.log(`Washing Freq: ${wfreq}`)


    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var buildingArray = sampleData.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = buildingArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse()

    // 8. Create the trace for the bar chart. 
    var bar_data = [{
        // Use otu_ids for the x values
        x: sample_values.slice(0, 10).reverse(),
        // Use sample_values for the y values
        y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
        // Use otu_labels for the text values
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
    }]
    // 9. Create the layout for the bar chart. 

    var bar_layout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: { title: "Bacteria Samples" },
        yaxis: { title: "OTU IDs" },

    };
  
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", bar_data, bar_layout)
    //bubble start
// Bar and Bubble charts
    // 1. Create the trace for the bubble chart.
  var bubble_Data = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
          color: otu_ids,
          size: sample_values,
          colorscale: "YlOrRd",
          },

      }];

    // 2. Create the layout for the bubble chart.
    var bubble_Layout = [{
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    }];
        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubble_Data, bubble_Layout); 


//gauge
 // 1. Create a variable that filters the metadata array for the object with the desired sample number.
 var metadata_SelId = data.metadata.filter(data => data.id == sample);
 console.log(metadata_SelId);  

 // 3. Create a variable that holds the washing frequency.
 var washFreq = +metadata_SelId[0].wfreq;
 
 // 4. Create the trace for the gauge chart.
 var gauge_Data = [
   {
     domain: { x: [0, 1], y: [0, 1] },
     value: washFreq,
     title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
     type: "indicator",
     mode: "gauge+number",
     gauge: {
       axis: {
         range: [null, 10],
         tickmode: "array",
         tickvals: [0,2,4,6,8,10],
         ticktext: [0,2,4,6,8,10]
       },
       bar: {color: "black"},
       steps: [
         { range: [0, 2], color: "red" },
         { range: [2, 4], color: "orange" },
         { range: [4, 6], color: "yellow" },
         { range: [6, 8], color: "lime" },
         { range: [8, 10], color: "green" }]
     }
   }
 ];
 
 // 5. Create the layout for the gauge chart.
 var gauge_Layout = { 
   autosize: true,
   annotations: [{
     xref: 'paper',
     yref: 'paper',
     x: 0.5,
     xanchor: 'center',
     y: 0,
     yanchor: 'center',
     text: "The gauge displays your belly button weekly washing frequency",
     showarrow: false
   }]
 };

 // 6. Use Plotly to plot the gauge data and layout.
 Plotly.newPlot("gauge", gauge_Data, gauge_Layout, {responsive: true});

//end gauge
    });

  }


  init();