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

const scenarioMap = {
    'ECL1': 'Eyes Closed, Music 0.1Hz',
    'ECR': 'Eyes Closed, Music Regular',
    'WL1': 'VR Shifting, Music 0.1Hz',
    'WR': 'VR Shifting, Music Regular'
};

fileNames.forEach(fileName => {
    const displayName = scenarioMap[fileName] || fileName; 
    fileSelect.append("option")
        .attr("value", fileName) 
        .text(displayName); 
});

// first time you scroll on it it animate but subsequent times you can play it to animate
function plotStaticDataMx() {
    const filePathWL1 = `../dsc106_final_project/data/smoothS1/smoothWL1.csv`;
    const filePathECR = `../dsc106_final_project/data/smoothS1/smoothECR.csv`;

    Promise.all([
        d3.csv(filePathWL1).then(data => {
            data.forEach(d => {
                d.Time = +d.Time;
                d.Mx = +d.Mx;
                d.smoothMx = +d.smoothMx;
            });
            return data;
        }),
        d3.csv(filePathECR).then(data => {
            data.forEach(d => {
                d.Time = +d.Time;
                d.Mx = +d.Mx;
                d.smoothMx = +d.smoothMx;
            });
            return data;
        })
    ]).then(([dataWL1, dataECR]) => {
        console.log(`Number of data points for WL1:`, dataWL1.length);
        console.log(`Number of data points for ECR:`, dataECR.length);

        // Normalize Mx values
        function normalize(data, key) {
            const mean = d3.mean(data, d => d[key]);
            const std = d3.deviation(data, d => d[key]);
            console.log(`Mean: ${mean} Std Dev: ${std}`);
            return data.map(d => ({
                Time: d.Time,
                value: (d[key] - mean) / std,
                original: d[key]
            }));
        }

        let normalizedDataMxWL1 = normalize(dataWL1, "Mx");
        let normalizedDataMxWL1smooth = normalize(dataWL1, "smoothMx");
        let normalizedDataMxECR = normalize(dataECR, "Mx");
        let normalizedDataMxECRsmooth = normalize(dataECR, "smoothMx");

        // Create scales
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 40;
        const marginLeft = 50;
        const width = 800;
        const height = 400;

        // Create plot
        const staticSvg = d3.select("#static-plot-Mx")
            .attr("width", width)
            .attr("height", height);
        staticSvg.selectAll("*").remove();

        const xScale = d3.scaleLinear()
            .domain([0, d3.max([...dataWL1, ...dataECR], d => d.Time) + 0.01])
            .range([marginLeft, width - marginRight]);

        const yExtent = d3.extent([...normalizedDataMxWL1, ...normalizedDataMxECR, ...normalizedDataMxECRsmooth, ...normalizedDataMxWL1smooth], d => d.value);
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - marginBottom, marginTop]);

        // Add vertical line
        const verticalLine = staticSvg.append("line")
            .attr("x1", xScale(0))
            .attr("x2", xScale(0))
            .attr("y1", marginTop)
            .attr("y2", height - marginBottom)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4 4");

        // Line generator
        const lineGen = d3.line()
            .x(d => xScale(d.Time))
            .y(d => yScale(d.value));

        // Create a single shared transition
        const sharedTransition = d3.transition()
            .duration(4000)
            .ease(d3.easeLinear);

        // Function to animate line drawing using the shared transition
        function animateLine(path) {
            const totalLength = path.node().getTotalLength();

            path
                .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                .attr("stroke-dashoffset", totalLength)
                .transition(sharedTransition)
                .attr("stroke-dashoffset", 0);
        }

        // Animate the vertical line using the shared transition
        verticalLine
            .transition(sharedTransition)
            .attrTween("x1", function() {
                return function(t) {
                    return xScale(d3.max([...dataWL1, ...dataECR], d => d.Time) * t);
                };
            })
            .attrTween("x2", function() {
                return function(t) {
                    return xScale(d3.max([...dataWL1, ...dataECR], d => d.Time) * t);
                };
            });

        // Draw WL1 line (background)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataMxWL1)
                .attr("fill", "none")
                .attr("stroke", "#fc8d59")
                .attr("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("d", lineGen)
        );

        // Draw ECR line (background)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataMxECR)
                .attr("fill", "none")
                .attr("stroke", "#99d594")
                .attr("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("d", lineGen)
        );

        const tooltip = d3.select("#tooltip")
            .style("position", "absolute")
            .style("padding", "6px 10px")
            .style("border-radius", "4px")
            .style("color", "#fff")
            .style("opacity", 0)
            .style("pointer-events", "none");

        // Draw WL1 line smooth (main focus)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataMxWL1smooth)
                .attr("fill", "none")
                .attr("stroke", "#fc8d59")
                .attr("stroke-width", 2.5)
                .attr("opacity", 1)
                .attr("d", lineGen)
        );

        // Draw WL1 line smooth (main focus) with hover tooltip
        staticSvg.selectAll(".dot-wl1")
            .data(normalizedDataMxWL1smooth)
            .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "transparent") // Make it invisible
            .attr("stroke-width", 10)
            .attr("class", "dot-wl1")
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 3)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`Time: ${d.Time.toFixed(2)}<br>Normalized Value: ${d.value.toFixed(2)}<br>Original Value: ${d.original.toFixed(2)}`) // try to see if you can add the original value too
                    .style("background-color", "#fc8d59")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Draw ECR line smooth (main focus)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataMxECRsmooth)
                .attr("fill", "none")
                .attr("stroke", "#99d594")
                .attr("stroke-width", 2.5)
                .attr("opacity", 1)
                .attr("d", lineGen)
        );
        // Draw ECR line smooth (main focus) with hover tooltip
        staticSvg.selectAll(".dot-ecr")
            .data(normalizedDataMxECRsmooth)
            .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "transparent") // Make it invisible
            .attr("stroke-width", 10)
            .attr("class", "dot-ecr")
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 3)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`Time: ${d.Time.toFixed(2)}<br>Value: ${d.value.toFixed(2)}<br>Original Value: ${d.original.toFixed(2)}`)
                    .style("background-color", "#99d594")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Legend
        const legend = staticSvg.append("g")
            .attr("transform", `translate(${width - 210}, 20)`);

        legend.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#fc8d59");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .text("VR shifting, Music 0.1Hz")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#99d594");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 30)
            .text("Eyes Closed, Music Regular")
            .style("font-size", "12px");

        // X Axis
        staticSvg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(xScale));

        // Y Axis
        staticSvg.append("g")
            .attr("transform", `translate(${marginLeft}, 0)`)
            .call(d3.axisLeft(yScale));

        // Axis labels
        staticSvg.append("text")
            .attr("x", width / 2)
            .attr("y", height - marginBottom + 35)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Time (s)");

        staticSvg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", marginLeft - 30)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Normalized Mx");
    }).catch(error => {
        console.error("Error loading data:", error);
    });
}

let hasPlayed_mx = false;

// Function to play animation
function playAnimation_mx() {
    plotStaticDataMx();
}

// Intersection Observer to trigger plotStaticDataMx when visible
const plotElement_mx = document.querySelector("#static-plot-Mx");

const observer_mx = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasPlayed_mx) {
                console.log("Plot is in viewport. Starting animation...");
                playAnimation_mx();
                hasPlayed_mx = true;
                observer.unobserve(entry.target);
                // plotStaticDataMx();
                // observer.unobserve(entry.target); // Stop observing once triggered
            }
        });
    },
    { threshold: 0.5 } // Trigger when 50% of the element is in view
);

observer_mx.observe(plotElement_mx);

document.getElementById("replay-btn-mx").addEventListener("click", () => {
    console.log("Replaying animation...");
    hasPlayed_mx = true; // Keep the flag true so it doesn't auto-replay on scroll
    plotStaticDataMx();
});


// Function to load and plot static data for My of WL1 and ECR
function plotStaticDataMy() {
    const filePathWL1 = `../dsc106_final_project/data/smoothS1/smoothWL1.csv`;
    const filePathECR = `../dsc106_final_project/data/smoothS1/smoothECR.csv`;

    Promise.all([
        d3.csv(filePathWL1).then(data => {
            data.forEach(d => {
                d.Time = +d.Time;
                d.My = +d.My;
                d.smoothMy = +d.smoothMy;
            });
            return data;
        }),
        d3.csv(filePathECR).then(data => {
            data.forEach(d => {
                d.Time = +d.Time;
                d.My = +d.My;
                d.smoothMy = +d.smoothMy;
            });
            return data;
        })
    ]).then(([dataWL1, dataECR]) => {
        console.log(`Number of data points for WL1:`, dataWL1.length);
        console.log(`Number of data points for ECR:`, dataECR.length);

        // Normalize Mx values
        function normalize(data, key) {
            const mean = d3.mean(data, d => d[key]);
            const std = d3.deviation(data, d => d[key]);
            console.log(`Mean: ${mean} Std Dev: ${std}`);
            return data.map(d => ({
                Time: d.Time,
                value: (d[key] - mean) / std,
                original: d[key]
            }));
        }

        let normalizedDataMyWL1 = normalize(dataWL1, "My");
        let normalizedDataMyWL1smooth = normalize(dataWL1, "smoothMy");
        let normalizedDataMyECR = normalize(dataECR, "My");
        let normalizedDataMyECRsmooth = normalize(dataECR, "smoothMy");

        // Create scales
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 40;
        const marginLeft = 50;
        const width = 800;
        const height = 400;

        // Create plot
        const staticSvg = d3.select("#static-plot-My")
            .attr("width", width)
            .attr("height", height);
        staticSvg.selectAll("*").remove();

        const xScale = d3.scaleLinear()
            .domain([0, d3.max([...dataWL1, ...dataECR], d => d.Time) + 0.01])
            .range([marginLeft, width - marginRight]);

        const yExtent = d3.extent([...normalizedDataMyWL1, ...normalizedDataMyECR, ...normalizedDataMyECRsmooth, ...normalizedDataMyWL1smooth], d => d.value);
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - marginBottom, marginTop]);

        // Add vertical line
        const verticalLine = staticSvg.append("line")
            .attr("x1", xScale(0))
            .attr("x2", xScale(0))
            .attr("y1", marginTop)
            .attr("y2", height - marginBottom)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4 4");

        // Line generator
        const lineGen = d3.line()
            .x(d => xScale(d.Time))
            .y(d => yScale(d.value));

        // Create a single shared transition
        const sharedTransition = d3.transition()
            .duration(4000)
            .ease(d3.easeLinear);

        // Function to animate line drawing using the shared transition
        function animateLine(path) {
            const totalLength = path.node().getTotalLength();

            path
                .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                .attr("stroke-dashoffset", totalLength)
                .transition(sharedTransition)
                .attr("stroke-dashoffset", 0);
        }

        // Animate the vertical line using the shared transition
        verticalLine
            .transition(sharedTransition)
            .attrTween("x1", function() {
                return function(t) {
                    return xScale(d3.max([...dataWL1, ...dataECR], d => d.Time) * t);
                };
            })
            .attrTween("x2", function() {
                return function(t) {
                    return xScale(d3.max([...dataWL1, ...dataECR], d => d.Time) * t);
                };
            });

        // Draw WL1 line (background)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataMyWL1)
                .attr("fill", "none")
                .attr("stroke", "#fc8d59")
                .attr("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("d", lineGen)
        );

        // Draw ECR line (background)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataMyECR)
                .attr("fill", "none")
                .attr("stroke", "#99d594")
                .attr("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("d", lineGen)
        );

        const tooltip = d3.select("#tooltip")
            .style("position", "absolute")
            .style("padding", "6px 10px")
            .style("border-radius", "4px")
            .style("color", "#fff")
            .style("opacity", 0)
            .style("pointer-events", "none");

        // Draw WL1 line smooth (main focus)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataMyWL1smooth)
                .attr("fill", "none")
                .attr("stroke", "#fc8d59")
                .attr("stroke-width", 2.5)
                .attr("opacity", 1)
                .attr("d", lineGen)
        );

        // Draw WL1 line smooth (main focus) with hover tooltip
        staticSvg.selectAll(".dot-wl1")
            .data(normalizedDataMyWL1smooth)
            .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "transparent") // Make it invisible
            .attr("stroke-width", 10)
            .attr("class", "dot-wl1")
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 3)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`Time: ${d.Time.toFixed(2)}<br>Value: ${d.value.toFixed(2)}<br>Original Value: ${d.original.toFixed(2)}`)
                    .style("background-color", "#fc8d59")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Draw ECR line smooth (main focus)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataMyECRsmooth)
                .attr("fill", "none")
                .attr("stroke", "#99d594")
                .attr("stroke-width", 2.5)
                .attr("opacity", 1)
                .attr("d", lineGen)
        );
        // Draw ECR line smooth (main focus) with hover tooltip
        staticSvg.selectAll(".dot-ecr")
            .data(normalizedDataMyECRsmooth)
            .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "transparent") // Make it invisible
            .attr("stroke-width", 10)
            .attr("class", "dot-ecr")
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 3)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`Time: ${d.Time.toFixed(2)}<br>Value: ${d.value.toFixed(2)}<br>Original Value: ${d.original.toFixed(2)}`)
                    .style("background-color", "#99d594")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Legend
        const legend = staticSvg.append("g")
            .attr("transform", `translate(${width - 210}, 20)`);

        legend.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#fc8d59");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .text("VR shifting, Music 0.1Hz")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#99d594");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 30)
            .text("Eyes Closed, Music Regular")
            .style("font-size", "12px");

        // X Axis
        staticSvg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(xScale));

        // Y Axis
        staticSvg.append("g")
            .attr("transform", `translate(${marginLeft}, 0)`)
            .call(d3.axisLeft(yScale));

        // Axis labels
        staticSvg.append("text")
            .attr("x", width / 2)
            .attr("y", height - marginBottom + 35)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Time (s)");

        staticSvg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", marginLeft - 30)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Normalized My");
    }).catch(error => {
        console.error("Error loading data:", error);
    });
}

let hasPlayed_my = false;

// Function to play animation
function playAnimation_my() {
    plotStaticDataMy();
}

// Intersection Observer to trigger plotStaticDataMx when visible
const plotElement_my = document.querySelector("#static-plot-My");

const observer_my = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasPlayed_my) {
                console.log("Plot is in viewport. Starting animation...");
                playAnimation_my();
                hasPlayed_my = true;
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 } // Trigger when 50% of the element is in view
);

observer_my.observe(plotElement_my);

document.getElementById("replay-btn-my").addEventListener("click", () => {
    console.log("Replaying animation...");
    hasPlayed_my = true; // Keep the flag true so it doesn't auto-replay on scroll
    plotStaticDataMy();
});

function plotStaticDataCoPy() {
    const filePathWL1 = `../dsc106_final_project/data/smoothS1/smoothWL1.csv`;
    const filePathECR = `../dsc106_final_project/data/smoothS1/smoothECR.csv`;

    Promise.all([
        d3.csv(filePathWL1).then(data => {
            data.forEach(d => {
                d.Time = +d.Time;
                d.CoPy = +d.CoPy;
                d.smoothCoPy = +d.smoothCoPy;
            });
            return data;
        }),
        d3.csv(filePathECR).then(data => {
            data.forEach(d => {
                d.Time = +d.Time;
                d.CoPy = +d.CoPy;
                d.smoothCoPy = +d.smoothCoPy;
            });
            return data;
        })
    ]).then(([dataWL1, dataECR]) => {
        console.log(`Number of data points for WL1:`, dataWL1.length);
        console.log(`Number of data points for ECR:`, dataECR.length);

        // Normalize Mx values
        function normalize(data, key) {
            const mean = d3.mean(data, d => d[key]);
            const std = d3.deviation(data, d => d[key]);
            console.log(`Mean: ${mean} Std Dev: ${std}`);
            return data.map(d => ({
                Time: d.Time,
                value: (d[key] - mean) / std,
                original: d[key]
            }));
        }

        let normalizedDataCoPyWL1 = normalize(dataWL1, "CoPy");
        let normalizedDataCoPyWL1smooth = normalize(dataWL1, "smoothCoPy");
        let normalizedDataCoPyECR = normalize(dataECR, "CoPy");
        let normalizedDataCoPyECRsmooth = normalize(dataECR, "smoothCoPy");

        // Create scales
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 40;
        const marginLeft = 50;
        const width = 800;
        const height = 400;

        // Create plot
        const staticSvg = d3.select("#static-plot-CoPy")
            .attr("width", width)
            .attr("height", height);
        staticSvg.selectAll("*").remove();

        const xScale = d3.scaleLinear()
            .domain([0, d3.max([...dataWL1, ...dataECR], d => d.Time) + 0.01])
            .range([marginLeft, width - marginRight]);

        const yExtent = d3.extent([...normalizedDataCoPyWL1, ...normalizedDataCoPyECR, ...normalizedDataCoPyECRsmooth, ...normalizedDataCoPyWL1smooth], d => d.value);
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - marginBottom, marginTop]);

        // Add vertical line
        const verticalLine = staticSvg.append("line")
            .attr("x1", xScale(0))
            .attr("x2", xScale(0))
            .attr("y1", marginTop)
            .attr("y2", height - marginBottom)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4 4");

        // Line generator
        const lineGen = d3.line()
            .x(d => xScale(d.Time))
            .y(d => yScale(d.value));

        // Create a single shared transition
        const sharedTransition = d3.transition()
            .duration(4000)
            .ease(d3.easeLinear);

        // Function to animate line drawing using the shared transition
        function animateLine(path) {
            const totalLength = path.node().getTotalLength();

            path
                .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                .attr("stroke-dashoffset", totalLength)
                .transition(sharedTransition)
                .attr("stroke-dashoffset", 0);
        }

        // Animate the vertical line using the shared transition
        verticalLine
            .transition(sharedTransition)
            .attrTween("x1", function() {
                return function(t) {
                    return xScale(d3.max([...dataWL1, ...dataECR], d => d.Time) * t);
                };
            })
            .attrTween("x2", function() {
                return function(t) {
                    return xScale(d3.max([...dataWL1, ...dataECR], d => d.Time) * t);
                };
            });

        // Draw WL1 line (background)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataCoPyWL1)
                .attr("fill", "none")
                .attr("stroke", "#fc8d59")
                .attr("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("d", lineGen)
        );

        // Draw ECR line (background)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataCoPyECR)
                .attr("fill", "none")
                .attr("stroke", "#99d594")
                .attr("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("d", lineGen)
        );

        const tooltip = d3.select("#tooltip")
            .style("position", "absolute")
            .style("padding", "6px 10px")
            .style("border-radius", "4px")
            .style("color", "#fff")
            .style("opacity", 0)
            .style("pointer-events", "none");

        // Draw WL1 line smooth (main focus)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataCoPyWL1smooth)
                .attr("fill", "none")
                .attr("stroke", "#fc8d59")
                .attr("stroke-width", 2.5)
                .attr("opacity", 1)
                .attr("d", lineGen)
        );

        // Draw WL1 line smooth (main focus) with hover tooltip
        staticSvg.selectAll(".dot-wl1")
            .data(normalizedDataCoPyWL1smooth)
            .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "transparent") // Make it invisible
            .attr("stroke-width", 10)
            .attr("class", "dot-wl1")
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 3)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`Time: ${d.Time.toFixed(2)}<br>Value: ${d.value.toFixed(2)}<br>Original Value: ${d.original.toFixed(2)}`)
                    .style("background-color", "#fc8d59")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Draw ECR line smooth (main focus)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataCoPyECRsmooth)
                .attr("fill", "none")
                .attr("stroke", "#99d594")
                .attr("stroke-width", 2.5)
                .attr("opacity", 1)
                .attr("d", lineGen)
        );
        // Draw ECR line smooth (main focus) with hover tooltip
        staticSvg.selectAll(".dot-ecr")
            .data(normalizedDataCoPyECRsmooth)
            .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "transparent") // Make it invisible
            .attr("stroke-width", 10)
            .attr("class", "dot-ecr")
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 3)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`Time: ${d.Time.toFixed(2)}<br>Value: ${d.value.toFixed(2)}<br>Original Value: ${d.original.toFixed(2)}`)
                    .style("background-color", "#99d594")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Legend
        const legend = staticSvg.append("g")
            .attr("transform", `translate(${width - 210}, 20)`);

        legend.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#fc8d59");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .text("VR shifting, Music 0.1Hz")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#99d594");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 30)
            .text("Eyes Closed, Music Regular")
            .style("font-size", "12px");

        // X Axis
        staticSvg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(xScale));

        // Y Axis
        staticSvg.append("g")
            .attr("transform", `translate(${marginLeft}, 0)`)
            .call(d3.axisLeft(yScale));

        // Axis labels
        staticSvg.append("text")
            .attr("x", width / 2)
            .attr("y", height - marginBottom + 35)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Time (s)");

        staticSvg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", marginLeft - 30)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Normalized CoPy");
    }).catch(error => {
        console.error("Error loading data:", error);
    });
}

let hasPlayed_CoPy = false;

// Function to play animation
function playAnimation_CoPy() {
    plotStaticDataCoPy();
}

const plotElement_CoPy = document.querySelector("#static-plot-CoPy");

const observer_CoPy = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasPlayed_CoPy) {
                console.log("Plot is in viewport. Starting animation...");
                playAnimation_CoPy();
                hasPlayed_CoPy = true;
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 } // Trigger when 50% of the element is in view
);

observer_CoPy.observe(plotElement_CoPy);

document.getElementById("replay-btn-copy").addEventListener("click", () => {
    console.log("Replaying animation...");
    hasPlayed_CoPy = true; // Keep the flag true so it doesn't auto-replay on scroll
    plotStaticDataCoPy();
});

function plotStaticDataCoPx() {
    const filePathWL1 = `../dsc106_final_project/data/smoothS1/smoothWL1.csv`;
    const filePathECR = `../dsc106_final_project/data/smoothS1/smoothECR.csv`;

    Promise.all([
        d3.csv(filePathWL1).then(data => {
            data.forEach(d => {
                d.Time = +d.Time;
                d.CoPx = +d.CoPx;
                d.smoothCoPx = +d.smoothCoPx;
            });
            return data;
        }),
        d3.csv(filePathECR).then(data => {
            data.forEach(d => {
                d.Time = +d.Time;
                d.CoPx = +d.CoPx;
                d.smoothCoPx = +d.smoothCoPx;
            });
            return data;
        })
    ]).then(([dataWL1, dataECR]) => {
        console.log(`Number of data points for WL1:`, dataWL1.length);
        console.log(`Number of data points for ECR:`, dataECR.length);

        // Normalize Mx values
        function normalize(data, key) {
            const mean = d3.mean(data, d => d[key]);
            const std = d3.deviation(data, d => d[key]);
            console.log(`Mean: ${mean} Std Dev: ${std}`);
            return data.map(d => ({
                Time: d.Time,
                value: (d[key] - mean) / std,
                original: d[key]
            }));
        }

        let normalizedDataCoPxWL1 = normalize(dataWL1, "CoPx");
        let normalizedDataCoPxWL1smooth = normalize(dataWL1, "smoothCoPx");
        let normalizedDataCoPxECR = normalize(dataECR, "CoPx");
        let normalizedDataCoPxECRsmooth = normalize(dataECR, "smoothCoPx");

        // Create scales
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 40;
        const marginLeft = 50;
        const width = 800;
        const height = 400;

        // Create plot
        const staticSvg = d3.select("#static-plot-CoPx")
            .attr("width", width)
            .attr("height", height);
        staticSvg.selectAll("*").remove();

        const xScale = d3.scaleLinear()
            .domain([0, d3.max([...dataWL1, ...dataECR], d => d.Time) + 0.01])
            .range([marginLeft, width - marginRight]);

        const yExtent = d3.extent([...normalizedDataCoPxWL1, ...normalizedDataCoPxECR, ...normalizedDataCoPxECRsmooth, ...normalizedDataCoPxWL1smooth], d => d.value);
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - marginBottom, marginTop]);

        // Add vertical line
        const verticalLine = staticSvg.append("line")
            .attr("x1", xScale(0))
            .attr("x2", xScale(0))
            .attr("y1", marginTop)
            .attr("y2", height - marginBottom)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4 4");

        // Line generator
        const lineGen = d3.line()
            .x(d => xScale(d.Time))
            .y(d => yScale(d.value));

        // Create a single shared transition
        const sharedTransition = d3.transition()
            .duration(4000)
            .ease(d3.easeLinear);

        // Function to animate line drawing using the shared transition
        function animateLine(path) {
            const totalLength = path.node().getTotalLength();

            path
                .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                .attr("stroke-dashoffset", totalLength)
                .transition(sharedTransition)
                .attr("stroke-dashoffset", 0);
        }

        // Animate the vertical line using the shared transition
        verticalLine
            .transition(sharedTransition)
            .attrTween("x1", function() {
                return function(t) {
                    return xScale(d3.max([...dataWL1, ...dataECR], d => d.Time) * t);
                };
            })
            .attrTween("x2", function() {
                return function(t) {
                    return xScale(d3.max([...dataWL1, ...dataECR], d => d.Time) * t);
                };
            });

        // Draw WL1 line (background)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataCoPxWL1)
                .attr("fill", "none")
                .attr("stroke", "#fc8d59")
                .attr("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("d", lineGen)
        );

        // Draw ECR line (background)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataCoPxECR)
                .attr("fill", "none")
                .attr("stroke", "#99d594")
                .attr("stroke-width", 1)
                .attr("opacity", 0.3)
                .attr("d", lineGen)
        );

        const tooltip = d3.select("#tooltip")
            .style("position", "absolute")
            .style("padding", "6px 10px")
            .style("border-radius", "4px")
            .style("color", "#fff")
            .style("opacity", 0)
            .style("pointer-events", "none");

        // Draw WL1 line smooth (main focus)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataCoPxWL1smooth)
                .attr("fill", "none")
                .attr("stroke", "#fc8d59")
                .attr("stroke-width", 2.5)
                .attr("opacity", 1)
                .attr("d", lineGen)
        );

        // Draw WL1 line smooth (main focus) with hover tooltip
        staticSvg.selectAll(".dot-wl1")
            .data(normalizedDataCoPxWL1smooth)
            .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "transparent") // Make it invisible
            .attr("stroke-width", 10)
            .attr("class", "dot-wl1")
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 3)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`Time: ${d.Time.toFixed(2)}<br>Value: ${d.value.toFixed(2)}<br>Original Value: ${d.original.toFixed(2)}`)
                    .style("background-color", "#fc8d59")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Draw ECR line smooth (main focus)
        animateLine(
            staticSvg.append("path")
                .datum(normalizedDataCoPxECRsmooth)
                .attr("fill", "none")
                .attr("stroke", "#99d594")
                .attr("stroke-width", 2.5)
                .attr("opacity", 1)
                .attr("d", lineGen)
        );
        // Draw ECR line smooth (main focus) with hover tooltip
        staticSvg.selectAll(".dot-ecr")
            .data(normalizedDataCoPxECRsmooth)
            .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "transparent") // Make it invisible
            .attr("stroke-width", 10)
            .attr("class", "dot-ecr")
            .attr("cx", d => xScale(d.Time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 3)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`Time: ${d.Time.toFixed(2)}<br>Value: ${d.value.toFixed(2)}<br>Original Value: ${d.original.toFixed(2)}`)
                    .style("background-color", "#99d594")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Legend
        const legend = staticSvg.append("g")
            .attr("transform", `translate(${width - 210}, 20)`);

        legend.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#fc8d59");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .text("VR shifting, Music 0.1Hz")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#99d594");

        legend.append("text")
            .attr("x", 15)
            .attr("y", 30)
            .text("Eyes Closed, Music Regular")
            .style("font-size", "12px");

        // X Axis
        staticSvg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(xScale));

        // Y Axis
        staticSvg.append("g")
            .attr("transform", `translate(${marginLeft}, 0)`)
            .call(d3.axisLeft(yScale));

        // Axis labels
        staticSvg.append("text")
            .attr("x", width / 2)
            .attr("y", height - marginBottom + 35)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Time (s)");

        staticSvg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", marginLeft - 30)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Normalized CoPx");
    }).catch(error => {
        console.error("Error loading data:", error);
    });
}

let hasPlayed_CoPx = false;

// Function to play animation
function playAnimation_CoPx() {
    plotStaticDataCoPx();
}

const plotElement_CoPx = document.querySelector("#static-plot-CoPx");

const observer_CoPx = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasPlayed_CoPx) {
                console.log("Plot is in viewport. Starting animation...");
                playAnimation_CoPx();
                hasPlayed_CoPx = true;
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 } // Trigger when 50% of the element is in view
);

observer_CoPx.observe(plotElement_CoPx);

document.getElementById("replay-btn-copx").addEventListener("click", () => {
    console.log("Replaying animation...");
    hasPlayed_CoPx = true; // Keep the flag true so it doesn't auto-replay on scroll
    plotStaticDataCoPx();
});

// Function to load and plot dynamic data (existing code)
function loadAndPlotData(subject, file) {
    const filePath = `../dsc106_final_project/data/S${subject}/${file}.csv`;
    d3.csv(filePath).then(data => {
        data.forEach(d => {
            d.Time = +d.Time;
            d.CoPx = +d.CoPx;
            d.CoPy = +d.CoPy;
            d.Mx = +d.Mx;
            d.My = +d.My;
        });

        // Normalize function for dynamic plot
        function normalize(data, key) {
            const mean = d3.mean(data, d => d[key]);
            const std = d3.deviation(data, d => d[key]);
            return data.map(d => ({ Time: d.Time, value: (d[key] - mean) / std }));
        }

        let normalizedDataX = normalize(data, "CoPx");
        let normalizedDataY = normalize(data, "CoPy");

        // Create scales for dynamic plot
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.Time) + 0.01])
            .range([marginLeft, width - marginRight]);

        const yExtent = d3.extent([...normalizedDataX, ...normalizedDataY], d => d.value);
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - marginBottom, marginTop]);

        const svg = d3.select("#main-plot");
        // Clear previous plot
        svg.selectAll("*").remove();

        // Create axes for dynamic plot
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

        // Line generator for dynamic plot
        const lineGen = d3.line()
            .x(d => xScale(d.Time))
            .y(d => yScale(d.value));

        // Draw lines for dynamic plot
        const pathX = svg.append("path")
            .datum(normalizedDataX)
            .attr("fill", "none")
            .attr("stroke", "#5ab4ac")
            .attr("stroke-width", 2)
            .attr("d", lineGen);

        const pathY = svg.append("path")
            .datum(normalizedDataY)
            .attr("fill", "none")
            .attr("stroke", "#d8b365")
            .attr("stroke-width", 2)
            .attr("d", lineGen);

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 100}, 30)`);

        const legendItems = [
            { color: "#5ab4ac", label: "CoPx" },
            { color: "#d8b365", label: "CoPy" }
        ];

        const updateLegend = () => {
            // Clear previous legend
            legend.selectAll("*").remove();
                legend.append("rect")
                .attr("x", -10)
                .attr("y", -10)
                .attr("width", 70) 
                .attr("height", legendItems.length * 20 + 10) 
                .style("fill", "#f0f0f0") 
                .style("stroke", "black") // Border color
                .style("stroke-width", 1)
                .style("rx", 4) 
                .style("ry", 4); 

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
                    .attr("y", index * 20 + 10)
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

// Load the static plot first
plotStaticDataMx();
plotStaticDataMy();
plotStaticDataCoPy();
plotStaticDataCoPx();

// Load initial dynamic data
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
console.log("Plots.js loaded!");