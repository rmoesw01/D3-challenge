// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Initialize the x- & y-axis to display poverty vs. lacks healthcare as a default display
var chosenXaxis = 'poverty';
var chosenYaxis = 'healthcare';
var xlabel = 'Poverty: '
var ylabel = 'Lacks Healthcare: '

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Define a function that adjusts the scale of the x-axis based on the chosen x variable
function xScale(data, xAxis) {
  // Passed Parameters:
  // data = the given data source
  // xAxis = the newly chosen x variable

  // create and return the new scale for the x-axis
  var xLinearScale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain([d3.min(data, d => d[xAxis])*0.9, d3.max(data, d => d[xAxis])*1.1]);
  return xLinearScale;
}

// Define a function that adjusts the scale of the y-axis based on the chosen y variable
function yScale(data, yAxis) {
  // Passed Parameters:
  // data = the given data source
  // yAxis = the newly chosen y variable

  // create and return the new scale for the y-axis
  var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([d3.min(data, d => d[yAxis])*0.8, d3.max(data, d => d[yAxis])*1.1]);
  return yLinearScale;
}

// Define a function that moves the nodes (contains circles and state labels) to the new
// positions based on chosen variables
function renderNodes(newXscale, newYscale, nodes) {
  // Passed Parameters:
  // newXscale = the new scale for the x-axis
  // newYscale = the new scale for the y-axis
  // nodes = the originally defined nodes (these will be changed to the new nodes in this function)

  // transition the nodes to their new positions based on chosen variables on the x- & y-axis
  // chosenXaxis & chosenYaxis = global variables containing the user choice for the x- & y-axis
  nodes.transition()
    .duration(1000)
    .attr('transform', d => {
      d.x = newXscale(d[chosenXaxis]), 
      d.y = newYscale(d[chosenYaxis]);
      return `translate(${d.x},${d.y})`;
    });  
  
  // return the newly positioned nodes
  return nodes;
}

// Define a function to draw the new x-axis based on the user choosing a new variable for the axis
function renderxAxis(newXscale, xAxis) {
// Passed Parameters:
// newXscale = the scale for the newly chosen variable on the x-axis
// xAxis = the original x-axis (this will be changed by this function)

  // create the new x-axis based on the newXscale
  var bottomAxis = d3.axisBottom(newXscale);

  // transition the old x-axis to the new one dynamically
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  // return the new x-axis
  return xAxis;
}

// Define a function to draw the new y-axis based on the user choosing a new variable for the axis
function renderyAxis(newYscale, yAxis) {
// Passed Parameters:
// newYscale = the scale for the newly chosen variable on the y-axis
// yAxis = the original y-axis (this will be changed by this function)

  // create the new y-axis based on the newYscale
  var leftAxis = d3.axisLeft(newYscale);

  // transition the old y-axis to the new one dynamically
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  // return the new y-axis  
  return yAxis;
}

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
        healthData.age = +healthData.age;
        healthData.obesity = +healthData.obesity;
        healthData.smokes = +healthData.smokes;
        healthData.income = +healthData.income;
    });

    var xLinearScale = xScale(csvData, chosenXaxis);
    var yLinearScale = yScale(csvData, chosenYaxis);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes
    var xAxis = chartGroup.append("g")
      .classed('x-axis', true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    // text label for the x axis
    var xlabelsGroup = chartGroup.append('g')
      .attr("transform",
      "translate(" + (chartWidth/2) + " ," + 
                    (chartHeight + margin.top - 10) + ")")

    var povertyLabel = xlabelsGroup.append("text")
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty')
      .classed('active', true)
      .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age')
      .classed('inactive', true)
      .text('Age (Median)');

    var incomeLabel = xlabelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'income')
      .classed('inactive', true)
      .text('Household Income (Median)');

    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    var ylabelsGroup = chartGroup.append('g')
      .attr("transform", "rotate(-90)")

      // text label for the y axis
    var healthLabel = ylabelsGroup.append("text")
      .attr("y", 0 - (margin.left/2))
      .attr("x", 0 - (chartHeight/2))
      .attr("dy", "1em")
      .attr('value', 'healthcare')
      .classed('active', true)
      .text("Lacks Healthcare (%)"); 

    var smokeLabel = ylabelsGroup.append("text")
      .attr("y", 0 - (margin.left/2) - 10)
      .attr("x", 0 - (chartHeight/2))
      .attr('value', 'smokes')
      .classed('inactive', true)
      .text("Smokes (%)"); 

    var obeseLabel = ylabelsGroup.append("text")
      .attr("y", 0 - (margin.left/2) - 35)
      .attr("x", 0 - (chartHeight/2))
      .attr('value', 'obesity')
      .classed('inactive', true)
      .text("Obese (%)"); 

    var nodes = chartGroup.append("g")
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(csvData)
      .enter()
      .append("g")
      .attr('transform', d => {
        d.x = xLinearScale(d[chosenXaxis]), 
        d.y = yLinearScale(d[chosenYaxis]);
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

    xlabelsGroup.selectAll('text').on('click', function() {
      var clicked = d3.select(this).attr('value');
      if(clicked != chosenXaxis) {
        chosenXaxis = clicked;
        xLinearScale = xScale(csvData, chosenXaxis);
        xAxis = renderxAxis(xLinearScale, xAxis);
        nodes = renderNodes(xLinearScale, yLinearScale, nodes);
        if(chosenXaxis === 'poverty'){
          povertyLabel.classed('active', true);
          povertyLabel.classed('inactive', false);
          ageLabel.classed('active', false);
          ageLabel.classed('inactive', true);
          incomeLabel.classed('active', false);
          incomeLabel.classed('inactive', true);
          xlabel = 'Poverty: '
        }
        else if (chosenXaxis === 'age') {
          povertyLabel.classed('active', false);
          povertyLabel.classed('inactive', true);
          ageLabel.classed('active', true);
          ageLabel.classed('inactive', false);
          incomeLabel.classed('active', false);
          incomeLabel.classed('inactive', true);
          xlabel = 'Age: '
        }
        else if (chosenXaxis === 'income') {
          povertyLabel.classed('active', false);
          povertyLabel.classed('inactive', true);
          ageLabel.classed('active', false);
          ageLabel.classed('inactive', true);
          incomeLabel.classed('active', true);
          incomeLabel.classed('inactive', false);
          xlabel = 'Income: '
        }
      }
    });

    ylabelsGroup.selectAll('text').on('click', function() {
      var clicked = d3.select(this).attr('value');
      if(clicked != chosenYaxis) {
        chosenYaxis = clicked;
        yLinearScale = yScale(csvData, chosenYaxis);
        yAxis = renderyAxis(yLinearScale, yAxis);
        nodes = renderNodes(xLinearScale, yLinearScale, nodes);
        if(chosenYaxis === 'obesity'){
          obeseLabel.classed('active', true);
          obeseLabel.classed('inactive', false);
          smokeLabel.classed('active', false);
          smokeLabel.classed('inactive', true);
          healthLabel.classed('active', false);
          healthLabel.classed('inactive', true);
          ylabel = 'Obesity: '
        }
        else if (chosenYaxis === 'smokes') {
          obeseLabel.classed('active', false);
          obeseLabel.classed('inactive', true);
          smokeLabel.classed('active', true);
          smokeLabel.classed('inactive', false);
          healthLabel.classed('active', false);
          healthLabel.classed('inactive', true);
          ylabel = 'Smokes: '
        }
        else if (chosenYaxis === 'healthcare') {
          obeseLabel.classed('active', false);
          obeseLabel.classed('inactive', true);
          smokeLabel.classed('active', false);
          smokeLabel.classed('inactive', true);
          healthLabel.classed('active', true);
          healthLabel.classed('inactive', false);
          ylabel = 'Lacks Healthcare: '
        }
      }
    });

    var toolTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([80, -60])
      .html(d => {
        return `${d.state}<br>${xlabel}${d[chosenXaxis]}<br>${ylabel}${d[chosenYaxis]}`;
      });
    
    nodes.call(toolTip);
    nodes.on('mouseover', d => {toolTip.show(d)})
      .on('mouseout', d => {toolTip.hide(d)});

})

