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

    // text label for the x axis
    chartGroup.append("text")             
    .attr("transform",
          "translate(" + (chartWidth/2) + " ," + 
                        (chartHeight + margin.top - 10) + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("In Poverty (%)");

    chartGroup.append("g")
      .call(leftAxis);

      // text label for the y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (chartHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Lacks Healthcare (%)"); 

    var nodes = chartGroup.append("g")
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(csvData)
      .enter()
      .append("g")
      .attr('transform', d => {
        d.x = xScale(d.poverty), 
        d.y = yScale(d.healthcare);
        return `translate(${d.x},${d.y})`;
      })

      nodes.append('circle')
        .attr('class', 'node')
        .attr("r", "10")
        .attr("fill", "#4b97c9")
        .attr("stroke-width", "1")
        .attr("stroke", "#4b97c9")
      
      nodes.append('text')
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr('text-anchor', "middle")
        .text(d => {return d.abbr;})
        .attr("font_family", "sans-serif")  // Font type
        .attr("font-size", "11px")  // Font size
        .attr("fill", "white");   // Font color;
})

