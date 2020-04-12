function drawmap2(){
    var width = 960,
        height = 500,
        active = d3.select(null);

    var projection = d3.geoAlbersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

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
        .on("click", clicked);

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "mesh")
        .attr("d", path);

    /*
    d3.json('data/map_data.json', function (locations){
        console.log('stores', locations);

        g.selectAll('circle')
                .data(locations)
                .enter()
                .append('circle')
                .attr('cx', function(d) {return projection([d.lon, d.lat])[0]})
                .attr('cy', function(d) {return projection([d.lon, d.lat])[1]})
                .attr('r', function(d) {return [d.total]})
    });*/

    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .attr("id", 'map')
    .style("opacity", 0);


    // Pie chart variables:
    var radius = 10;
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d; });

    var color = d3.schemeCategory10;

    d3.json("data/map_data.json", function(error, dd) {
        // console.log(dd);
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
                div	.html('Case Location: '+d.location + "<br/>"+
                          'Total victims:'+d.total + "<br/>"+
                          'Injured: '+d.injured + "<br/>" +
                          'Fatalities: '+d.fatalities)	
                    .style("left", (d3.event.pageX - 235) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
            
        // points.append("text")
        //     .attr("y", function(d) { return -d.total-5})
        //     .text(function(d) { return d.location })
        //     .attr("font-size","0.5em")
        //     .style('text-anchor','middle');
            
        var pies = points.selectAll(".pies")
            .data(function(d) { return pie([d.fatalities,d.injured]); })
            .enter()
            .append('g')
            .attr('class','arc');
        
        pies.append("path")
        .attr('d',arc)
        .attr("fill",function(d,i){
            return color[i+1];     
        });
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
}
drawmap2();