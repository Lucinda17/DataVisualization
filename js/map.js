function drawmap2(){
    var el_id = 'map';
    var obj = document.getElementById(el_id);
    var width = 960,
        height = 500,
        active = d3.select(null);

    var projection = d3.geoAlbersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    // Define the div for the tooltip
    var div = d3.select("#"+el_id).append("div")	
    .attr("class", "tooltip")				
    .attr("id", 'mapTooltip')
    .style("opacity", 1);

    var svg = d3.select("#"+el_id).append("svg")
        .attr("width", width)
        .attr("height", height);
    
    var color = ["#cc0a00", "#f79000"]

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g")
        .style("stroke-width", "1.5px");
    var g2 = svg.append("g");

    d3.json("data/us.json", function(error, us) {
    if (error) throw error;

    g.selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "feature")
        .attr("fill","back")
        .on("click", clicked);

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "mesh")
        .attr("d", path);


    // Pie chart variables:
    var radius = 10;
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    var arcOutter = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius+1);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d; });

    d3.json("data/map.json", function(error, dd) {
        var points = g.selectAll("g")
            .data(dd)
            .enter()
            .append("g")
            .attr("transform",function(d) { return "translate("+projection([d.lon,d.lat])+")" })
            .attr("class","pies")
            .on("mouseover", function(d) {		
    
                div.transition()		
                    .duration(200)		
                    .style("opacity", 1);		
                div	.html('Case: '+d.case + "<br/>" +
                          'Case Location: '+d.location + "<br/>"+
                          'Total victims:'+d.total + "<br/>"+
                          'Injured: '+d.injured + "<br/>" +
                          'Fatalities: '+d.fatalities)	
                    .style("left", (projection([d.lon,d.lat])[0]) + "px")		
                    .style("top",  (d3.event.pageY)-500 + "px");	
                    // .style("left",(projection([d.lon,d.lat])[0])+"px");
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            })
            .on("click", function(d){
                if (d.state == state){
                    state = "all";
                } else {
                    state = d.state;
                }

                drawLineChart();
                console.log(d.state+" - "+state);
            });
            

            
        var pies = points.selectAll(".pies")
            .data(function(d) { return pie([d.fatalities,d.injured]); })
            .enter()
            .append('g')
            .attr('class','arc');
        
        pies.append("path")
        .attr('d',arc)
        .attr("fill",function(d,i){
            return color[i];     
        });
        pies.append("path")
        .attr('d',arcOutter)
        .style("stroke-width",0)
        .attr("fill","white");
    });
    });

    function clicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    
    g.selectAll(".circle")
        .transition()
        .duration(750)
        .attr("transform", function(d) {
            var t = d3.transform(d3.select(this).attr("transform")).translate;//maintain aold marker translate 
            return "translate(" + t[0] +","+ t[1] + ")scale("+1/scale+")";//inverse the scale of parent
        });  
    }

    function reset() {
    active.classed("active", false);
    active = d3.select(null);

    g.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");
    }

    var YY = 30;
    var XX = 780;
    svg.append("rect")
        .attr("x", 30+XX)
        .attr("y", 30-YY)
        .attr("width","150")
        .attr("height","60")
        .attr("fill","white")
        .style("stroke","black")
        .style("stroke-width",1);
    svg.append("circle").attr("cx",60+XX).attr("cy",50-YY).attr("r", 6).style("fill", "#cc0a00")
    svg.append("circle").attr("cx",60+XX).attr("cy",70-YY).attr("r", 6).style("fill", "#f79000")
    svg.append("text").attr("x", 70+XX).attr("y", 50-YY).text("Fatalities").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 70+XX).attr("y", 70-YY).text("Injured").style("font-size", "15px").attr("alignment-baseline","middle")
    
}
drawmap2();