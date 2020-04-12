
function drawLineChart(){

    var el_id = 'linechart';
    var obj = document.getElementById(el_id);
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        // width = 960 - margin.left - margin.right,
        // height = 500 - margin.top - margin.bottom;
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
    var y = d3.scaleLinear()
            .range([height, 0]);
    
    var y2 = d3.scaleLinear()
            .range([height,0]);
    
    var div = d3.select("#"+el_id).append("div")
            .attr("class", "tooltip")
            .attr("id","line")
            .style("opacity", 0);
            
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#"+el_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("Text")
    //     .attr
    //     .text("Map");

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xFormat = "%Y";;
    var parseTime = d3.timeParse("%m/%d/%Y");
    // get the data
    d3.csv("data/line_vi2.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.injuries = +d.injuries;
        d.fatalities = +d.fatalities;
        d.total = +d.total;
        d.records = +d.records;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return parseTime(d.date); }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    y2.domain([0,d3.max(data, function(d) {return d.records+2; })]).nice();

    // append the rectangles for the bar chart
    var bar = svg.selectAll("rect")
        .data(data)
        .enter().append("g")
    
    bar.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(parseTime(d.date)); })
        .attr("width", "10")
        .attr("y", function(d) { return y(d.total); })
        .attr("height", function(d) { return height - y(d.total); })
        .attr("fill","#404080")
        .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", 1);
            div.html("Year: "+ d.date.split('/')[2] + "<br/>" +
                     "Occurence: "+ d.records + "<br/>" + 
                     "Total victims: "+d.total + "<br/>" +
                     "Injured: "+d.injuries + "<br/>" +
                     "Fatalities: "+d.fatalities)
              .style("stroke","black")
              .style("stroke-width","1")
              .style("left", (x(parseTime(d.date))) + "px")
              .style("top", (d3.event.pageY)-140 + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });

    // labels on the bar chart
    // bar.append("text")
    //     .attr("dy","1.3em")
    //     .attr("x",function(d){return x(parseTime(d.date))+12})
    //     .attr("y",function(d){return y(d.total)-15;})
    //     .attr("text-anchor","middle")
    //     .attr("font-size","0.5em")
    //     .attr("fill","black")
    //     .text(function(d){
    //         return d.total;
    //     }); 


    // 7. d3's line generator
    var line = d3.line()
        .x(function(d) { return x(parseTime(d.date))+5; }) // set the x values for the line generator
        .y(function(d) { return y2(d.records); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
        // .datum(data) // 10. Binds data to the line .attr("class", "line") // Assign a class for styling 
        .attr("class", "line") // Assign a class for styling
        .attr("fill","none")
        .attr("stroke","#69b3a2")
        .attr("stroke-width",3)
        .attr("d", line(data)); // 11. Calls the line generator 

    svg.selectAll(".dot") // Uses the enter().append() method
        .data(data)
        .enter().append("circle")
        .attr("fill","#69b3a2")
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return x(parseTime(d.date))+5; })
        .attr("cy", function(d) { return y2(d.records); })
        .attr("r", 5)
        .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", 1);
            div.html("Year: "+ d.date.split('/')[2] + "<br/>" +
                     "Occurence: "+ d.records + "<br/>" + 
                     "Total victims: "+d.total + "<br/>" +
                     "Injured: "+d.injuries + "<br/>" +
                     "Fatalities: "+d.fatalities)
              .style("stroke","black")
              .style("stroke-width","1")
              .style("left", (x(parseTime(d.date))) + "px")
              .style("top", (d3.event.pageY)-140 + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });
    
    svg.selectAll(".line").transition(t);

    /* Create a shared transition for anything we're animating */
    var t = d3.transition()
    .delay(750)
    .duration(1000)
    .ease(d3.easeLinear)
    .on("start", function(d) {
        console.log("transition start")
    })
    .on('end', function(d) {
        console.log("transition end")
    });

    svg.append("rect")
        .attr("id","curtain")
        .attr("x", 0)
        .attr("y", 40)
        .attr("width","900")
        .attr("height","400")
        .attr("fill","white")
        .style("stroke-width",1);

    t.select('#curtain')
        .attr('transform', 'translate(' + width + ', 0)')
    
    // Handmade legend
    // svg.append("rect").attr("x", 50).attr("y", 40).attr("width","30").attr("height","40").attr("fill","white").attr("stroke-width","3").attr("stroke","black");
    var YY = 30;
    svg.append("rect")
        .attr("x", 30)
        .attr("y", 30-YY)
        .attr("width","140")
        .attr("height","40")
        .attr("fill","white")
        .style("stroke","black")
        .style("stroke-width",1);
    svg.append("circle").attr("cx",60).attr("cy",40-YY).attr("r", 6).style("fill", "#69b3a2")
    svg.append("circle").attr("cx",60).attr("cy",60-YY).attr("r", 6).style("fill", "#404080")
    svg.append("text").attr("x", 70).attr("y", 40-YY).text("Occurence").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 70).attr("y", 60-YY).text("Total victims").style("font-size", "15px").attr("alignment-baseline","middle")
 
 
    // add the x Axis + "<br/>" +
    svg.append("g") 
        .call(d3.axisBottom(x) 
            .tickFormat(d3.timeFormat(xFormat)).tickValues(x.domain().filter(function(d,i){ return !(i%2)}))) 
        .attr("transform", "translate(0," + height + ")") 
        .selectAll("text") 
            .attr("transform","translate(-15,9) rotate(-45)"); 
 
    // add the y Axis + "<br/>" +
    svg.append("g") 
        .call(d3.axisLeft(y)) 
        .attr("fill","#404080") 
        .attr("stroke","#404080"); 
    svg.append("g") 
        .call(d3.axisRight(y2)) 
        .attr("fill","#69b3a2") 
        .attr("stroke","#69b3a2") 
        .attr("transform", "translate( " + width + ", 0 )"); 
    }); 
} 
drawLineChart();