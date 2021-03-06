// define SVG size
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData)
    // Step 1: Cast data as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(censusData, d => d.poverty)])
      .range([0, width]);
    console.log(xLinearScale(4))

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", ".5")
    .attr("class", "stateCircle")
    // .append("text")
    // .attr("r", 0)
    // .attr("text-anchor", "middle")
    .text(function(d) { return d.abbr; } ); 
    console.log(censusData[0])

    var stateAbbr = chartGroup.selectAll(null)
    .data(censusData)
    .enter().append("text");

    stateAbbr
    .attr("x", function (d) {
      return xLinearScale(d.poverty);
    })
    .attr("y", function (d) {
      return yLinearScale(d.healthcare) + 4
    })
    .text(function (d) {
      return d.abbr;
    })
    .attr("class", "stateText")
    .attr("font-size", "9px");


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack of Healthcare %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Lives in Poverty %");
  }).catch(function(error) {
    console.log(error);
  });