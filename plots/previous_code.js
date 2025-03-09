// WORKS FOR 1 DYNAMIC PLOT
// const width = 800, height = 400, margin = 50;
// const marginTop = 20;
// const marginRight = 20;
// const marginBottom = 40;
// const marginLeft = 40;
// const svg = d3.select("svg");
// let isCOP = true; 

// const subjects = Array.from({ length: 10 }, (_, i) => i + 1);
// const fileNames = ["ECL1", "ECR", "WL1", "WR"];
// const subjectSelect = d3.select("#subject-select");
// const fileSelect = d3.select("#file-select");

// // Populate dropdowns
// subjects.forEach(subject => {
//     subjectSelect.append("option")
//         .attr("value", subject)
//         .text(`Subject ${subject}`);
// });

// fileNames.forEach(fileName => {
//     fileSelect.append("option")
//         .attr("value", fileName)
//         .text(fileName);
// });


// // Function to load and plot data
// function loadAndPlotData(subject, file) {
//     const filePath = `../data/S${subject}/${file}.csv`;
//     d3.csv(filePath).then(data => {
//         data.forEach(d => {
//             d.Time = +d.Time;
//             d.CoPx = +d.CoPx;
//             d.CoPy = +d.CoPy;
//             d.Mx = +d.Mx;
//             d.My = +d.My;
//         });

//         // Normalize function
//         function normalize(data, key) {
//             const mean = d3.mean(data, d => d[key]);
//             const std = d3.deviation(data, d => d[key]);
//             return data.map(d => ({ Time: d.Time, value: (d[key] - mean) / std }));
//         }

//         let normalizedDataX = normalize(data, "CoPx");
//         let normalizedDataY = normalize(data, "CoPy");

//         // Create scales
//         const xScale = d3.scaleLinear()
//             .domain([0, d3.max(data, (d) => d.Time) + 0.01])
//             .range([marginLeft, width - marginRight]);

//         const yExtent = d3.extent([...normalizedDataX, ...normalizedDataY], d => d.value);
//         const yScale = d3.scaleLinear()
//             .domain(yExtent)
//             .range([height - marginBottom, marginTop]);

//         // Clear previous plot
//         svg.selectAll("*").remove();


//         // Create axes
//         const xAxis = d3.axisBottom(xScale);
//         const yAxis = d3.axisLeft(yScale);

//         svg.append("g")
//             .attr("transform", `translate(0, ${height - marginBottom})`)
//             .call(xAxis);

//         svg.append("text")
//             .attr("x", width / 2)
//             .attr("y", height - marginBottom + 35) 
//             .attr("text-anchor", "middle")
//             .style("fill", "black") 
//             .style("font-size", "14px")
//             .text("Time (s)");

//         svg.append("g")
//             .attr("class", "y-axis")
//             .attr("transform", `translate(${marginLeft}, 0)`)
//             .call(yAxis);

//         const yAxisLabel = svg.append("text")
//             .attr("class", "y-axis-label")
//             .attr("transform", "rotate(-90)")
//             .attr("x", -height / 2)
//             .attr("y", marginLeft - 30) 
//             .attr("text-anchor", "middle")
//             .style("font-size", "14px")
//             .text(isCOP ? "Normalized CoPx/CoPy" : "Normalized Mx/My");
        

//         // Line generator
//         const lineGen = d3.line()
//             .x(d => xScale(d.Time))
//             .y(d => yScale(d.value));

//         // Draw lines
//         const pathX = svg.append("path")
//             .datum(normalizedDataX)
//             .attr("fill", "none")
//             .attr("stroke", "blue")
//             .attr("stroke-width", 2)
//             .attr("d", lineGen)

//         const pathY = svg.append("path")
//             .datum(normalizedDataY)
//             .attr("fill", "none")
//             .attr("stroke", "green")
//             .attr("stroke-width", 2)
//             .attr("d", lineGen)

//         // Add legend
//         const legend = svg.append("g")
//             .attr("transform", `translate(${width - 100}, 30)`); 

//         // Create legend items
//         const legendItems = [
//             { color: "blue", label: "CoPx" },
//             { color: "green", label: "CoPy" }
//         ];

//         const updateLegend = () => {
//             // Clear previous legend
//             legend.selectAll("*").remove();

//             // Add updated legend items
//             legendItems.forEach((item, index) => {
//                 legend.append("rect")
//                     .attr("x", 0)
//                     .attr("y", index * 20)
//                     .attr("width", 12)
//                     .attr("height", 12)
//                     .attr("fill", item.color);

//                 legend.append("text")
//                     .attr("x", 15)
//                     .attr("y", index * 20 + 12)
//                     .text(item.label)
//                     .style("font-size", "12px")
//                     .attr("alignment-baseline", "middle");
//             });
//         };

//         updateLegend();

//         // Button event listener
//         d3.select("#toggleButton").on("click", () => {
//             isCOP = !isCOP; 

//             const newDataX = normalize(data, isCOP ? "CoPx" : "Mx");
//             const newDataY = normalize(data, isCOP ? "CoPy" : "My");

//             // Recalculate the yExtent based on the new dataset
//             const yExtent = d3.extent([...newDataX, ...newDataY], d => d.value);
//             yScale.domain(yExtent); 

//             // Update y-axis
//             svg.select(".y-axis")
//                 .transition()
//                 .duration(500)
//                 .call(d3.axisLeft(yScale));

//             pathX.datum(newDataX).transition().duration(500).attr("d", lineGen);
//             pathY.datum(newDataY).transition().duration(500).attr("d", lineGen);

//             d3.select("#toggleButton").text(isCOP ? "Switch to Mx/My" : "Switch to CoPx/CoPy");

//             // Update legend based on the toggle state
//             legendItems[0].label = isCOP ? "CoPx" : "Mx";
//             legendItems[1].label = isCOP ? "CoPy" : "My";

//             d3.select(".y-axis-label")
//                 .transition()
//                 .duration(500)
//                 .text(isCOP ? "Normalized CoPx/CoPy" : "Normalized Mx/My");

//             updateLegend(); // Update the legend
//         });
//     }).catch(error => console.error("Error loading file:", error));
// }

// // Load initial data
// const initialSubject = subjectSelect.node().value;
// const initialFile = fileSelect.node().value;
// loadAndPlotData(initialSubject, initialFile);

// // Update plot when dropdowns change
// subjectSelect.on("change", function () {
//     const selectedSubject = d3.select(this).property("value");
//     const selectedFile = fileSelect.property("value");
//     isCOP = true;
//     d3.select("#toggleButton").text("Switch to Mx/My");
//     loadAndPlotData(selectedSubject, selectedFile);
// });

// fileSelect.on("change", function () {
//     const selectedSubject = subjectSelect.property("value");
//     const selectedFile = d3.select(this).property("value");
//     isCOP = true;
//     d3.select("#toggleButton").text("Switch to Mx/My");
//     loadAndPlotData(selectedSubject, selectedFile);
// });

// WORKS WITH 3 plots
// const width = 800, height = 400, staticHeight = 300;
// const marginTop = 20, marginRight = 20, marginBottom = 40, marginLeft = 40;

// const mainSvg = d3.select("#main-plot");
// const staticSvg1 = d3.select("#static-plot-1");
// const staticSvg2 = d3.select("#static-plot-2");

// let isCOP = true; // Tracks whether we're displaying CoP (true) or Mx/My (false)

// const subjects = Array.from({ length: 10 }, (_, i) => i + 1);
// const fileNames = ["ECL1", "ECR", "WL1", "WR"];
// const subjectSelect = d3.select("#subject-select");
// const fileSelect = d3.select("#file-select");

// // Populate dropdowns
// subjects.forEach(subject => {
//     subjectSelect.append("option")
//         .attr("value", subject)
//         .text(`Subject ${subject}`);
// });

// fileNames.forEach(fileName => {
//     fileSelect.append("option")
//         .attr("value", fileName)
//         .text(fileName);
// });

// // Function to normalize data
// function normalize(data, key) {
//     const mean = d3.mean(data, d => d[key]);
//     const std = d3.deviation(data, d => d[key]);
//     return data.map(d => ({ Time: d.Time, value: (d[key] - mean) / std }));
// }

// // Function to load and plot data
// function loadAndPlotData(subject, file, targetSvg, height, isStatic) {
//     const filePath = `../data/S${subject}/${file}.csv`;
//     d3.csv(filePath).then(data => {
//         data.forEach(d => {
//             d.Time = +d.Time;
//             d.CoPx = +d.CoPx;
//             d.CoPy = +d.CoPy;
//             d.Mx = +d.Mx;
//             d.My = +d.My;
//         });

//         let normalizedDataX = normalize(data, isCOP ? "CoPx" : "Mx");
//         let normalizedDataY = normalize(data, isCOP ? "CoPy" : "My");

//         // Create scales
//         const xScale = d3.scaleLinear()
//             .domain([0, d3.max(data, d => d.Time) + 0.01])
//             .range([marginLeft, width - marginRight]);

//         const yExtent = d3.extent([...normalizedDataX, ...normalizedDataY], d => d.value);
//         const yScale = d3.scaleLinear()
//             .domain(yExtent)
//             .range([height - marginBottom, marginTop]);

//         // Clear previous plot
//         targetSvg.selectAll("*").remove();

//         // Create axes
//         const xAxis = d3.axisBottom(xScale);
//         const yAxis = d3.axisLeft(yScale);

//         // Add plot title
//         targetSvg.append("text")
//             .attr("x", width / 2)
//             .attr("y", marginTop - 5)  // Position above the plot
//             .attr("text-anchor", "middle")
//             .style("font-size", "16px")
//             .style("font-weight", "bold")
//             .text(isStatic ? `Static Plot: ${file}` : `Subject ${subject} - ${file} (${isCOP ? "CoP" : "Mx/My"})`);

//         targetSvg.append("g")
//             .attr("transform", `translate(0, ${height - marginBottom})`)
//             .call(xAxis);

//         targetSvg.append("g")
//             .attr("class", "y-axis")
//             .attr("transform", `translate(${marginLeft}, 0)`)
//             .call(yAxis);

//         targetSvg.append("text")
//             .attr("x", width / 2)
//             .attr("y", height - marginBottom + 35) 
//             .attr("text-anchor", "middle")
//             .style("font-size", "14px")
//             .text("Time (s)");

//         targetSvg.append("text")
//             .attr("class", "y-axis-label")
//             .attr("transform", "rotate(-90)")
//             .attr("x", -height / 2)
//             .attr("y", marginLeft - 30) 
//             .attr("text-anchor", "middle")
//             .style("font-size", "14px")
//             .text(isCOP ? "Normalized CoPx/CoPy" : "Normalized Mx/My");
        
//         // Line generator
//         const lineGen = d3.line()
//             .x(d => xScale(d.Time))
//             .y(d => yScale(d.value));

//         // Draw lines
//         targetSvg.append("path")
//             .datum(normalizedDataX)
//             .attr("fill", "none")
//             .attr("stroke", "blue")
//             .attr("stroke-width", 2)
//             .attr("d", lineGen);

//         targetSvg.append("path")
//             .datum(normalizedDataY)
//             .attr("fill", "none")
//             .attr("stroke", "green")
//             .attr("stroke-width", 2)
//             .attr("d", lineGen);

//         // Add legend for main plot
//         if (!isStatic) {
//             const legend = targetSvg.append("g")
//                 .attr("transform", `translate(${width - 100}, 30)`);

//             const legendItems = [
//                 { color: "blue", label: isCOP ? "CoPx" : "Mx" },
//                 { color: "green", label: isCOP ? "CoPy" : "My" }
//             ];

//             legendItems.forEach((item, index) => {
//                 legend.append("rect")
//                     .attr("x", 0)
//                     .attr("y", index * 20)
//                     .attr("width", 12)
//                     .attr("height", 12)
//                     .attr("fill", item.color);

//                 legend.append("text")
//                     .attr("x", 15)
//                     .attr("y", index * 20 + 12)
//                     .text(item.label)
//                     .style("font-size", "12px")
//                     .attr("alignment-baseline", "middle");
//             });
//         }
//     }).catch(error => console.error("Error loading file:", error));
// }

// // Function to update all plots
// function updateAllPlots() {
//     const selectedSubject = subjectSelect.property("value");
//     const selectedFile = fileSelect.property("value");

//     loadAndPlotData(selectedSubject, selectedFile, mainSvg, height, false);
//     loadAndPlotData(1, "ECR", staticSvg1, staticHeight, true);
//     loadAndPlotData(1, "WL1", staticSvg2, staticHeight, true);
// }

// // Load initial data
// const initialSubject = subjectSelect.node().value;
// const initialFile = fileSelect.node().value;

// updateAllPlots();

// // Update plot when dropdowns change
// subjectSelect.on("change", updateAllPlots);
// fileSelect.on("change", updateAllPlots);

// // Toggle button functionality
// d3.select("#toggleButton").on("click", function () {
//     isCOP = !isCOP;
//     d3.select(this).text(isCOP ? "Switch to Mx/My" : "Switch to CoP");
//     updateAllPlots();
// });