// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select scatter id, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(csvData => {
    // Print the imported data
    console.log(csvData);

    // Cast the poverty and healthcare values to a number
    csvData.forEach(healthData => {
        healthData.poverty = +healthData.poverty;
        healthData.healthcare = +healthData.healthcare;
    });

    var xScale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain([d3.min(csvData, data => data.poverty)-1, d3.max(csvData, data => data.poverty)+2]);

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the yScale function
    var yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(csvData, data => data.healthcare)+3]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(csvData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr("stroke-width", "1")
      .attr("stroke", "lightblue");

    // append labels
    var textGroup = chartGroup.selectAll("text")
      .data(csvData)
      .enter()
      .append("text")
      .text(function(d) {return d.abbr;})
      .attr("x", function(d) {return xScale(d.poverty-0.15);})
      .attr("y", function(d) {return yScale(d.healthcare-0.35);})
      .attr("font_family", "sans-serif")  // Font type
      .attr("font-size", "11px")  // Font size
      .attr("fill", "red");   // Font color
})

