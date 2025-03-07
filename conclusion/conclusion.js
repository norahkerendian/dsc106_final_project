import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Load JSON data asynchronously
fetch('conclusion.json')
  .then(response => response.json())
  .then(grouped => {
    // Define chart dimensions
    const yLabel = "Medial-Lateral Momement<>br(Avg Newton-meters)"; //find a way to split into two lines
    const scenarioLabels = {
      "ECL1": "Eyes Closed, Music 0.1Hz",
      "ECR": "Eyes Closed, Music Regular",
      "WL1": "VR shifting, Music 0.1Hz",
      "WR": "VR shifting, Music Regular"
    };

    const width = 900, height = 500, margin = { top: 70, right: 120, bottom: 120, left: 120};

    // Select the correct SVG (fix)
    const svg = d3.select(".barchart")
      .attr("width", width)
      .attr("height", height);

    // X and Y scales
    const x = d3.scaleBand()
      .domain(grouped.map(d => d.Senario))
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => d.dMx)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create a tooltip div (hidden by default)
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

// Draw blue bars (dMx)
svg.selectAll(".bar-dMx")
.data(grouped)
.enter()
.append("rect")
.attr("class", "bar-dMx")
.attr("x", d => x(d.Senario))
.attr("y", d => y(d.dMx))
.attr("height", d => y(0) - y(d.dMx))
.attr("width", x.bandwidth() / 2)  // Make space for second bar
.attr("fill", "steelblue")
.on("mouseover", (event, d) => {
  tooltip.style("opacity", 1)
    .html(`dMx: ${d.dMx.toFixed(2)}`); // Display value with 2 decimal places
})
.on("mousemove", (event) => {
  tooltip.style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 20) + "px");
})
.on("mouseout", () => {
  tooltip.style("opacity", 0);
});

// Draw orange bars (dCoPy)
svg.selectAll(".bar-dCoPy")
.data(grouped)
.enter()
.append("rect")
.attr("class", "bar-dCoPy")
.attr("x", d => x(d.Senario) + x.bandwidth() / 2) // Offset to avoid overlap
.attr("y", d => y(d.dCoPy * 700)) // Scaling if needed
.attr("height", d => y(0) - y(d.dCoPy * 700))
.attr("width", x.bandwidth() / 2)
.attr("fill", "orange")
.on("mouseover", (event, d) => {
  tooltip.style("opacity", 1)
    .html(`dCoPy: ${(d.dCoPy * 700).toFixed(2)}`); // Adjust scaling if needed
})
.on("mousemove", (event) => {
  tooltip.style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 20) + "px");
})
.on("mouseout", () => {
  tooltip.style("opacity", 0);
});

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => scenarioLabels[d])) // Custom labels
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", "-6em")
      .attr("dy", "0.9em")
      .attr("transform", "rotate(0)");

    // Add Y axis
    // Define the left Y-axis scale for blue bars (dMx)
    const yLeft = d3.scaleLinear()
    .domain([0, d3.max(grouped, d => d.dMx)])
    .nice()
    .range([height - margin.bottom, margin.top]);

    // Define the right Y-axis scale for orange bars (dCoPy)
    const yRight = d3.scaleLinear()
    .domain([0, d3.max(grouped, d => d.dCoPy)])  // Scale appropriately
    .nice()
    .range([height - margin.bottom, margin.top]);

    // Left Y-axis (for blue bars)
    svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yLeft))
    .call(g => g.select(".domain").attr("stroke", "steelblue")) // Color axis line
    .call(g => g.selectAll(".tick line").attr("stroke", "steelblue")) // Color tick marks
    .style("stroke-width", "2px") // Thicker axis line
    .selectAll("text")
    .attr("fill", "black"); // Keep text black
  

// Right Y-axis (for orange bars)
svg.append("g")
  .attr("transform", `translate(${width - margin.right},0)`)
  .call(d3.axisRight(yRight))
  .call(g => g.select(".domain").attr("stroke", "orange")) // Color axis line
  .call(g => g.selectAll(".tick line").attr("stroke", "orange")) // Color tick marks
  .style("stroke-width", "2px") // Thicker axis line
  .selectAll("text")
  .attr("fill", "black"); // Keep text black

      // Left Y axis title
      svg.append("text")
      .attr("transform", "rotate(-90)") // Rotate to align with Y-axis
      .attr("x", -height / 2)
      .attr("y", margin.left / 3)
      .style("text-anchor", "middle")
      .attr("class", "axis-label")
      .append("tspan")  // First line
      .text("Momement") //Medial-Lateral 
      .attr("x", -height / 2.5)
      .attr("dy", "-0.5em")  // Adjust vertical spacing
      .append("tspan")  // Second line
      .text("(Avg Newton-meters)")
      .attr("x", -height / 2.5)
      .attr("dy", "1.2em"); // Adjust vertical spacing

// // // Right Y-axis title
// // svg.append("text")
// //   .attr("transform", "rotate(90)") // Rotate to align with the right Y-axis
// //   .attr("x", height / 2) // Center along Y-axis
// //   .attr("y", width - margin.right + 40) // Push further inside SVG
// //   .style("text-anchor", "middle") // Center text alignment
// //   .style("fill", "black") // Ensure text is visible
// //   .attr("class", "axis-label")
// //   .append("tspan")  
// //   .text("Anterior-Posterior Movement");

// const rightYAxisLabel =  svg.append("text")
// .attr("transform", "rotate(-90)") // Rotate to align with Y-axis
// .attr("x", -height / 2)
// .attr("y", -margin.left / 2)
// .style("text-anchor", "middle")
// .attr("class", "axis-label")
// // .append("tspan")  // First line
// .text("Anterior-Posterior Pressure")
// rightYAxisLabel.raise();




      svg.append("text")
      .attr("class", "annotation")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 80)
      .style("text-anchor", "middle")
      .text("Scenario");

    // Add annotation
    svg.append("text")
      .attr("class", "annotation")
      .attr("x", width / 2)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .style("font-weight", 900)
      .text("Less Environment Stability ≈ More Movement");

    // Create a legend container
const legend = svg.append("g")
.attr("class", "legend")
.attr("transform", `translate(${width - margin.right - 620}, ${margin.top})`); // Position the legend

// Add blue legend item (dMx)
legend.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", 15)
.attr("height", 15)
.attr("fill", "steelblue");

legend.append("text")
.attr("x", 20)
.attr("y", 12)
.style("font-size", "10px")
.text("Medial-Lateral Momement (Mx)");

// Add orange legend item (dCoPy)
legend.append("rect")
.attr("x", 0)
.attr("y", 25)
.attr("width", 15)
.attr("height", 15)
.attr("fill", "orange");

legend.append("text")
.attr("x", 20)
.attr("y", 37)
.style("font-size", "10px")
.text("Anterior-Posterior Balance (CoPy)");
  
    })
  .catch(error => console.error("Error loading data:", error));

  

