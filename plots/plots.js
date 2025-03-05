const width = 800, height = 400, margin = 50;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 40;
const marginLeft = 40;
const svg = d3.select("svg");
let isCOP = true; 

const subjects = Array.from({ length: 10 }, (_, i) => i + 1);
const fileNames = ["ECL1", "ECR", "WL1", "WR"];
const subjectSelect = d3.select("#subject-select");
const fileSelect = d3.select("#file-select");

// Populate dropdowns
subjects.forEach(subject => {
    subjectSelect.append("option")
        .attr("value", subject)
        .text(`Subject ${subject}`);
});

fileNames.forEach(fileName => {
    fileSelect.append("option")
        .attr("value", fileName)
        .text(fileName);
});

// // Create tooltip div (initially hidden)
// const tooltip = d3.select("body").append("div")
//     .attr("class", "chart-tooltip")
//     .style("visibility", "hidden");

// Function to load and plot data
function loadAndPlotData(subject, file) {
    const filePath = `../data/S${subject}/${file}.csv`;
    d3.csv(filePath).then(data => {
        data.forEach(d => {
            d.Time = +d.Time;
            d.CoPx = +d.CoPx;
            d.CoPy = +d.CoPy;
            d.Mx = +d.Mx;
            d.My = +d.My;
        });

        // Normalize function
        function normalize(data, key) {
            const mean = d3.mean(data, d => d[key]);
            const std = d3.deviation(data, d => d[key]);
            return data.map(d => ({ Time: d.Time, value: (d[key] - mean) / std }));
        }

        let normalizedDataX = normalize(data, "CoPx");
        let normalizedDataY = normalize(data, "CoPy");

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.Time) + 0.01])
            .range([marginLeft, width - marginRight]);

        const yExtent = d3.extent([...normalizedDataX, ...normalizedDataY], d => d.value);
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - marginBottom, marginTop]);

        // Clear previous plot
        svg.selectAll("*").remove();


        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(xAxis);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - marginBottom + 35) 
            .attr("text-anchor", "middle")
            .style("fill", "black") 
            .style("font-size", "14px")
            .text("Time (s)");

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${marginLeft}, 0)`)
            .call(yAxis);

        const yAxisLabel = svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", marginLeft - 30) 
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text(isCOP ? "Normalized CoPx/CoPy" : "Normalized Mx/My");
        

        // Line generator
        const lineGen = d3.line()
            .x(d => xScale(d.Time))
            .y(d => yScale(d.value));

        // Draw lines
        const pathX = svg.append("path")
            .datum(normalizedDataX)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("d", lineGen)

        const pathY = svg.append("path")
            .datum(normalizedDataY)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("d", lineGen)

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 100}, 30)`); 

        // Create legend items
        const legendItems = [
            { color: "blue", label: "CoPx" },
            { color: "green", label: "CoPy" }
        ];

        const updateLegend = () => {
            // Clear previous legend
            legend.selectAll("*").remove();

            // Add updated legend items
            legendItems.forEach((item, index) => {
                legend.append("rect")
                    .attr("x", 0)
                    .attr("y", index * 20)
                    .attr("width", 12)
                    .attr("height", 12)
                    .attr("fill", item.color);

                legend.append("text")
                    .attr("x", 15)
                    .attr("y", index * 20 + 12)
                    .text(item.label)
                    .style("font-size", "12px")
                    .attr("alignment-baseline", "middle");
            });
        };

        updateLegend();

        // Button event listener
        d3.select("#toggleButton").on("click", () => {
            isCOP = !isCOP; 

            const newDataX = normalize(data, isCOP ? "CoPx" : "Mx");
            const newDataY = normalize(data, isCOP ? "CoPy" : "My");

            // Recalculate the yExtent based on the new dataset
            const yExtent = d3.extent([...newDataX, ...newDataY], d => d.value);
            yScale.domain(yExtent); 

            // Update y-axis
            svg.select(".y-axis")
                .transition()
                .duration(500)
                .call(d3.axisLeft(yScale));

            pathX.datum(newDataX).transition().duration(500).attr("d", lineGen);
            pathY.datum(newDataY).transition().duration(500).attr("d", lineGen);

            d3.select("#toggleButton").text(isCOP ? "Switch to Mx/My" : "Switch to CoPx/CoPy");

            // Update legend based on the toggle state
            legendItems[0].label = isCOP ? "CoPx" : "Mx";
            legendItems[1].label = isCOP ? "CoPy" : "My";

            d3.select(".y-axis-label")
                .transition()
                .duration(500)
                .text(isCOP ? "Normalized CoPx/CoPy" : "Normalized Mx/My");

            updateLegend(); // Update the legend
        });
    }).catch(error => console.error("Error loading file:", error));
}

// Load initial data
const initialSubject = subjectSelect.node().value;
const initialFile = fileSelect.node().value;
loadAndPlotData(initialSubject, initialFile);

// Update plot when dropdowns change
subjectSelect.on("change", function () {
    const selectedSubject = d3.select(this).property("value");
    const selectedFile = fileSelect.property("value");
    isCOP = true;
    d3.select("#toggleButton").text("Switch to Mx/My");
    loadAndPlotData(selectedSubject, selectedFile);
});

fileSelect.on("change", function () {
    const selectedSubject = subjectSelect.property("value");
    const selectedFile = d3.select(this).property("value");
    isCOP = true;
    d3.select("#toggleButton").text("Switch to Mx/My");
    loadAndPlotData(selectedSubject, selectedFile);
});

// //tooltip
// var tooltip = document.getElementById("tooltip");
// circles.forEach(circle => {
//     circle.on("mouseover", function (e) {
//         let { population, cases } = e.target.options.customData;
//         let municipality = e.target.getPopup().getContent().split("<strong>")[1].split("</strong>")[0]; // Extract municipality name

//         tooltip.innerHTML = `
//             <strong>${municipality}</strong><br>
//             Average Cases: ${cases.toFixed(2)}<br>
//             Average Population: ${population.toLocaleString()}<br>
//             Cases per Capita: ${(cases / population * 100).toFixed(2)}%
//         `;

//         tooltip.style.display = "block";
//         tooltip.style.left = (e.originalEvent.pageX + 10) + "px";
//         tooltip.style.top = (e.originalEvent.pageY + 10) + "px";
//     });

//     circle.on("mousemove", function (e) {
//         tooltip.style.left = (e.originalEvent.pageX + 10) + "px";
//         tooltip.style.top = (e.originalEvent.pageY + 10) + "px";
//     });

//     circle.on("mouseout", function () {
//         tooltip.style.display = "none";
//     });
// });