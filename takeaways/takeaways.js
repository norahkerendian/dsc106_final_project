const barchart = d3.select("#barchart");
const data = [
  {"Scenario":"ECR","Change in Forward-Backward Position":4.9502452143,"Change in Side-to-Side Position":1.0776901206},
  {"Scenario":"ECL1","Change in Forward-Backward Position":7.3870459711,"Change in Side-to-Side Position":1.744443572},
  {"Scenario":"WR","Change in Forward-Backward Position":16.4142015912,"Change in Side-to-Side Position":2.1780062125},
  {"Scenario":"WL1","Change in Forward-Backward Position":23.4076439986,"Change in Side-to-Side Position":2.5628889158}
];
const scenarioLabels = {
  "ECL1": "Eyes Closed, Music 0.1Hz",
  "ECR": "Eyes Closed, Music Regular",
  "WL1": "VR shifting, Music 0.1Hz",
  "WR": "VR shifting, Music Regular"
};
const width = 900, height = 500, margin = { top: 70, right: 120, bottom: 120, left: 120};
// Define shorter variable names for readability in the code
const forwardBackwardKey = "Change in Forward-Backward Position";
const sideToSideKey = "Change in Side-to-Side Position";     

setTimeout(function() {
  console.log("Initializing chart in takeaways.js");
    
    createChart(data);

    function createChart(data) {
      
      barchart.attr("width", width).attr("height", height);
      
      // Clear any previous content
      barchart.selectAll("*").remove();

      // X and Y scales
      const x = d3.scaleBand()
        .domain(data.map(d => d.Scenario))
        .range([margin.left, width - margin.right])
        .padding(0.5);

      // Find the maximum value for Y scale (with a bit of headroom)
      const maxFB = d3.max(data, d => d[forwardBackwardKey]) * 1.1;
      const maxSS = d3.max(data, d => d[sideToSideKey]) * 1.1;
      
      // Create a scale that can handle both data series
      const y = d3.scaleLinear()
        .domain([0, Math.max(maxFB, maxSS)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Create a tooltip div (hidden by default)
      // Remove any existing tooltip first
      d3.select("body .tooltip").remove();
      
      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("box-shadow", "2px 2px 5px rgba(0,0,0,0.3)")
        .style("pointer-events", "none")
        .style("opacity", 0);

      // Draw blue bars (Forward-Backward)
      barchart.selectAll(".bar-fb")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar-fb")
        .attr("x", d => x(d.Scenario))
        .attr("y", d => y(d[forwardBackwardKey]))
        .attr("height", d => y(0) - y(d[forwardBackwardKey]))
        .attr("width", x.bandwidth() / 2)  // Make space for second bar
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
          tooltip.style("opacity", 1)
            .html(`${forwardBackwardKey}: ${d[forwardBackwardKey].toFixed(2)} mm`);
        })
        .on("mousemove", function(event) {
          tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
          tooltip.style("opacity", 0);
        });

      // Draw orange bars (Side-to-Side)
      barchart.selectAll(".bar-ss")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar-ss")
        .attr("x", d => x(d.Scenario) + x.bandwidth() / 2) // Offset to avoid overlap
        .attr("y", d => y(d[sideToSideKey]))
        .attr("height", d => y(0) - y(d[sideToSideKey]))
        .attr("width", x.bandwidth() / 2)
        .attr("fill", "orange")
        .on("mouseover", function(event, d) {
          tooltip.style("opacity", 1)
            .html(`${sideToSideKey}: ${d[sideToSideKey].toFixed(2)} mm`);
        })
        .on("mousemove", function(event) {
          tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
          tooltip.style("opacity", 0);
        });

      // Add X axis with custom labels
      barchart.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d => "")) // Empty string as we'll add custom labels
        .selectAll(".tick")
        .append("text")
        .attr("y", 10)
        .attr("x", 0)
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .style("font-size", "14px") // You can now use a larger font size
        .each(function(d) {
          const label = scenarioLabels[d];
          const parts = label.split(", ");
          
          const text = d3.select(this);
          
          // First line
          text.append("tspan")
            .attr("x", 0)
            .attr("dy", "1em")
            .text(parts[0]);
          
          // Second line
          text.append("tspan")
            .attr("x", 0)
            .attr("dy", "1.2em") // Line spacing
            .text(parts[1]);
        });

      // Define the left Y-axis scale
      const yLeft = d3.scaleLinear()
        .domain([0, maxFB])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Define the right Y-axis scale
      const yRight = d3.scaleLinear()
        .domain([0, maxSS])
        .nice()
        .range([height - margin.bottom, margin.top]);

      // Left Y-axis (for blue bars)
      barchart.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yLeft))
        .call(g => g.select(".domain").attr("stroke", "steelblue")) // Color axis line
        .call(g => g.selectAll(".tick line").attr("stroke", "steelblue")) // Color tick marks
        .style("stroke-width", "2px") // Thicker axis line
        .selectAll("text")
        .attr("fill", "black"); // Keep text black

      // Left Y axis title
      barchart.append("text")
        .attr("transform", "rotate(-90)") // Rotate to align with Y-axis
        .attr("x", -height / 2)
        .attr("y", margin.left / 3)
        .style("text-anchor", "middle")
        .attr("class", "axis-label")
        .append("tspan")  // First line
        .text("Average Change in Position")
        .attr("x", -height / 2.5)
        .attr("dy", "-0.5em")  // Adjust vertical spacing
        .append("tspan")  // Second line
        .text("(mm / second)")
        .attr("x", -height / 2.5)
        .attr("dy", "1.2em"); // Adjust vertical spacing

      // X axis label
      barchart.append("text")
        .attr("class", "annotation")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 80)
        .style("text-anchor", "middle")
        .text("Scenario");

      // Add title annotation
      barchart.append("text")
        .attr("class", "annotation")
        .attr("x", width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .style("font-weight", 900)
        .text("Less Environment Stability ≈ More Movement");

      // Add less stable annotation
      barchart.append("text")
        .attr("class", "annotation")
        .attr("x", width - 300)
        .attr("y", height - margin.bottom + 80)
        .style("text-anchor", "middle")
        .style("font-weight", 200)
        .attr("stroke", "#CA2E55")
        .text("less stable");

      // Create Diagonal arrow marker definition
      barchart.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("refX", 6)
        .attr("refY", 3)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,0 L6,3 L0,6")
        .attr("fill", "#CA2E55");

      // Draw the Diagonal arrow line
      barchart.append("line")
        .attr("x1", 650)
        .attr("y1", height - margin.bottom + 76)
        .attr("x2", 700)
        .attr("y2", height - margin.bottom + 76)
        .attr("stroke", "#CA2E55")
        .attr("stroke-width", 1)
        .attr("marker-end", "url(#arrowhead)");

      // Create a legend container
      const legend = barchart.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - margin.right - 620}, ${margin.top})`); // Position the legend

      // Add blue legend item (Forward-Backward)
      legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "steelblue");

      legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "12px")
        .text("Forward-Backward");

      // Add orange legend item (Side-to-Side)
      legend.append("rect")
        .attr("x", 0)
        .attr("y", 25)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "orange");

      legend.append("text")
        .attr("x", 20)
        .attr("y", 37)
        .style("font-size", "12px")
        .text("Side-to-Side");

      // Create Diagonal arrow marker definition
      barchart.append("defs").append("marker")
        .attr("id", "arrowhead2")
        .attr("refX", 6)
        .attr("refY", 3)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,0 L6,3 L0,6")
        .attr("fill", "#CA2E55");

      // Draw the trend arrow line
      barchart.append("line")
        .attr("x1", 200)
        .attr("y1", 300)
        .attr("x2", 650)
        .attr("y2", 70)
        .attr("stroke", "#CA2E55")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrowhead2)");
    }

    // Center the chart container
    d3.select(".container") 
      .style("display", "flex")
      .style("justify-content", "center");
  }, 500); // 500ms delay to ensure content is loaded