function drawLineChart(){

    var fn = "";
    if (state=='all'){
        fn = "data/line_vi2.csv";
    } else {
        fn = "data/linechart/line_vi3_"+state+".csv";
    }
    // get the data
    d3.csv(fn, function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.injuries = +d.injuries;
        d.fatalities = +d.fatalities;
        d.total = +d.total;
        d.records = +d.records;
    });


    // append the rectangles for the bar chart
    lc_bar = lc_svg.selectAll("rect")
        .remove()
        .exit()
        .data(data)
        .enter().append("g")
    
    lc_bar.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return lc_x(parseTime(d.date)); })
        .attr("width", "10")
        .attr("y", function(d) { return lc_y(d.total); })
        .attr("height", function(d) { return lc_height - lc_y(d.total); })
        .attr("fill","#404080")
        .on("mouseover", function(d) {
            lc_div.transition()
              .duration(200)
              .style("opacity", 1);
            lc_div.html("Year: "+ d.date.split('/')[2] + "<br/>" +
                     "Occurence: "+ d.records + "<br/>" + 
                     "Total victims: "+d.total + "<br/>" +
                     "Injured: "+d.injuries + "<br/>" +
                     "Fatalities: "+d.fatalities)
              .style("stroke","black")
              .style("stroke-width","1")
              .style("left", (lc_x(parseTime(d.date))) + "px")
              .style("top", (d3.event.pageY)-140 + "px");
            })
          .on("mouseout", function(d) {
            lc_div.transition()
              .duration(500)
              .style("opacity", 0);
            });

    // 7. d3's line generator
    var line = d3.line()
        .x(function(d) { return lc_x(parseTime(d.date))+5; }) // set the x values for the line generator
        .y(function(d) { return lc_y2(d.records); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 9. Append the path, bind the data, and call the line generator 
    var u = lc_svg.selectAll(".line")
        .remove()
        .exit()
        .data(data)
        // .datum(data) // 10. Binds data to the line .attr("class", "line") // Assign a class for styling 

    u.enter().append("path")
        .attr("class", "line") // Assign a class for styling
        .merge(u)
        .transition()
        .duration(1000)
        .attr("fill","none")
        .attr("stroke","#69b3a2")
        .attr("stroke-width",3)
        .attr("d", line(data)); // 11. Calls the line generator 

    lc_svg.selectAll(".dot") // Uses the enter().append() method
        .remove()
        .exit()
        .data(data)
        .enter().append("circle")
        .attr("fill","#69b3a2")
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return lc_x(parseTime(d.date))+5; })
        .attr("cy", function(d) { return lc_y2(d.records); })
        .attr("r", 5)
        .on("mouseover", function(d) {
            lc_div.transition()
              .duration(200)
              .style("opacity", 1);
            lc_div.html("Year: "+ d.date.split('/')[2] + "<br/>" +
                     "Occurence: "+ d.records + "<br/>" + 
                     "Total victims: "+d.total + "<br/>" +
                     "Injured: "+d.injuries + "<br/>" +
                     "Fatalities: "+d.fatalities)
              .style("stroke","black")
              .style("stroke-width","1")
              .style("left", (lc_x(parseTime(d.date))) + "px")
              .style("top", (d3.event.pageY)-140 + "px");
            })
          .on("mouseout", function(d) {
            lc_div.transition()
              .duration(500)
              .style("opacity", 0);
            });
    
    lc_svg.selectAll(".line").transition(t);

    /* Create a shared transition for anything we're animating */
    var t = d3.transition()
    // .delay(750)
    .duration(1000)
    .ease(d3.easeLinear)
    .on("start", function(d) {
        console.log("transition start")
    })
    .on('end', function(d) {
        console.log("transition end")
    });

    lc_svg.append("rect")
        .attr("id","curtain")
        .attr("x", 0)
        .attr("y", 40)
        .attr("width","900")
        .attr("height","400")
        .attr("fill","white")
        .style("stroke-width",1);

    t.select('#curtain')
        .attr('transform', 'translate(' + lc_width + ', 0)')
    
    // Handmade legend
    // svg.append("rect").attr("x", 50).attr("y", 40).attr("width","30").attr("height","40").attr("fill","white").attr("stroke-width","3").attr("stroke","black");
    lc_svg.append("g") 
        .call(d3.axisBottom(lc_x) 
            .tickFormat(d3.timeFormat(xFormat)).tickValues(lc_x.domain().filter(function(d,i){ return !(i%2)}))) 
        .attr("transform", "translate(0," + lc_height + ")") 
        .selectAll("text") 
            .attr("transform","translate(-15,9) rotate(-45)"); 

    // add the y Axis + "<br/>" +
    lc_svg.append("g") 
        .call(d3.axisLeft(lc_y)) 
        .attr("fill","#404080") 
        .attr("stroke","#404080"); 
    lc_svg.append("g") 
        .call(d3.axisRight(lc_y2)) 
        .attr("fill","#69b3a2") 
        .attr("stroke","#69b3a2") 
        .attr("transform", "translate( " + lc_width + ", 0 )"); 
        }); 
} 
var lc_el_id = 'linechart';
var lc_obj = document.getElementById(lc_el_id);
// set the dimensions and margins of the graph
var lc_margin = {top: 20, right: 20, bottom: 30, left: 40},
    lc_width = 660 - lc_margin.left - lc_margin.right,
    lc_height = 400 - lc_margin.top - lc_margin.bottom;

// set the ranges
var lc_x = d3.scaleBand()
        .range([0, lc_width])
        .padding(0.1);
var lc_y = d3.scaleLinear()
        .range([lc_height, 0]);

var lc_y2 = d3.scaleLinear()
        .range([lc_height,0]);

d3.csv('data/line_vi3.csv', function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.injuries = +d.injuries;
        d.fatalities = +d.fatalities;
        d.total = +d.total;
        d.records = +d.records;
    });
// Scale the range of the data in the domains
    lc_x.domain(data.map(function(d) { return parseTime(d.date); }));
    lc_y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    lc_y2.domain([0,d3.max(data, function(d) {return d.records+2; })]).nice();
});

var lc_div = d3.select("#"+lc_el_id).append("div")
        .attr("class", "tooltip")
        .attr("id","line")
        .style("opacity", 0);
        
var lc_svg = d3.select("#"+lc_el_id).append("svg")
    .attr("width", lc_width + lc_margin.left + lc_margin.right)
    .attr("height", lc_height + lc_margin.top + lc_margin.bottom)
.append("g")
    .attr("transform", 
        "translate(" + lc_margin.left + "," + lc_margin.top + ")");

// var lc_g = lc_svg.append("g")
//     .attr("transform", "translate(" + lc_margin.left + "," + lc_margin.top + ")");

var YY = 30;
var lc_sq = d3.select('#linechart').append("rect")
    .attr("x", 30)
    .attr("y", 30-YY)
    .attr("width","140")
    .attr("height","40")
    .attr("fill","pink")
    .style("stroke","black")
    .style("stroke-width",1);
lc_svg.append("circle").attr("cx",60).attr("cy",40-YY).attr("r", 6).style("fill", "#69b3a2")
lc_svg.append("circle").attr("cx",60).attr("cy",60-YY).attr("r", 6).style("fill", "#404080")
lc_svg.append("text").attr("x", 70).attr("y", 40-YY).text("Occurence").style("font-size", "15px").attr("alignment-baseline","middle")
lc_svg.append("text").attr("x", 70).attr("y", 60-YY).text("Total victims").style("font-size", "15px").attr("alignment-baseline","middle")


// add the x Axis + "<br/>" +

var xFormat = "%Y";;
var parseTime = d3.timeParse("%m/%d/%Y");
drawLineChart();