// viz.js
    
	var width = 1200,
        height = 700,
        padding_top = 10,
        padding = 40;
	var dataset;
	var user_name = '@realDonaldTrump';
	var viz;
	var xScale, yScale;

  
    user = "realDonaldTrump";
	
	d3.json("datasets/timestamps_dataset.json", function(err, json) {
		if(err) return console.log(err);
		dataset = json;
		getData();
	});
    
    d3.json("datasets/milestones_dataset.json", function(err, json) {
		if(err) return console.log(err);
        milestones = json
        
	});
    
	
	function getData() {
		
        now = new Date()
		offset = now.getTimezoneOffset() // Here we get the offset (in minutes) of our system respect to GMT.
        // In our case (Spain) at this time of the year the value is -120 == GMT+0200 (daylight savings time).
        eastern_america = (60 * -4) // The user timezone is GMT-0400.
        offset = offset + eastern_america
        offset = offset * 60 // In seconds now.
        
        dataset.forEach(function(d) { d.time = new Date((d.created_at + offset) * 1000) }); // JavaScript uses milliseconds.
		createViz();

	};
    
    function getMilestone(data, year, month){

          for(var x in data){
                if(data[x].year == year) return data[x].months[month].milestones.substring(0,800) + "..."; // TODO
            }
          
            return "No data available.";
    }
	
	
	function createViz() {
	
       
	// Creates the svg container.
	 
     viz = d3.select("body").
				append("svg:svg")
                .attr("width", width)
                .attr("height", height);
                
    
    d3.select("body").append("p").text("Extracting and plotting data from a Twitter timeline using Python and D3. User: " + user_name + " Tweets: " + dataset.length).attr("align","center");   
 
    // Adds the background.

     viz.selectAll("image").data([0])
            .enter()
            .append("svg:image")     
            .attr("xlink:href", "http://127.0.0.1/Twitter_user_timeline_time_activity_patterns/img/background.png")
                .attr("x", 20)
                .attr("y", 20)
                .attr("width", 1200)
                .attr("height", 700);  

    // Finds data range.
        var xMin = d3.min(dataset, function(d){ return Math.min(d.time); });
        var xMax = d3.max(dataset, function(d){ return Math.max(d.time); });

        var yMin = d3.min(dataset, function(d){ return Math.min(d.low); });
        var yMax = d3.max(dataset, function(d){ return Math.max(d.high); });

    
      
     // Defines the x scale.

    var xScale = d3.scaleTime()
                    .domain([xMin, xMax])
                            .range([padding, width - padding]);

    
    // Defines the y scale.
	
	yScale = d3.scaleLinear()
                    .domain([0,24])
                            .range([height - padding, padding]);    
        
    // Defines the x axis.

     var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10);  
        
    // Defines the y axis.

     var yAxis = d3.axisLeft(yScale);

            
    // Draws y axis with labels.
    viz.append("g")
        .attr("transform", "translate("+ (padding - 1) +",0)")
        .attr("class","yaxis")
        .call(yAxis);

     // Draws x axis with labels.
    viz.append("g")
        .attr("class", "xaxis axis")  // Two classes, one for css formatting, one for selection.
        .attr("transform", "translate(0," + (height - padding + 2) + ")")
        .call(xAxis);
        
   viz.selectAll("g.tick").select('line').style("stroke", "red") 
    
   viz.append("text")             
      .attr("transform","translate(" + (width/2) + " ," + (height) + ")")
        .style("text-anchor", "middle")
            .attr("class", "xaxis axis") 
                .text("At what date?");
                
   viz.append("text")             
      .attr("transform","translate(" + (padding / 4) + " ," + (height / 2) + ") rotate(-90)")
        .style("text-anchor", "middle")
            .attr("class", "xaxis axis") 
                .text("At what time?");         
         
    // Adds a circle for each Tweet.    
    viz.selectAll('circles').data(dataset).enter().append('circle').attr('cx',function(d){ return xScale(d['time']);})
        .attr('cy', function(d){ return yScale(d['time'].getHours() + (d['time'].getMinutes() * 1 / 60));}).attr('r',2)
        .attr('fill','#00aced') // Twitter Logo colour.
        .on("mouseover", function(d) {
			// get this bar's x/y values, then augment for the tooltip
        
			var xPosition = parseFloat(d3.select(this).attr("cx") - 100);
			var yPosition = parseFloat(d3.select(this).attr("cy"));
            
    
                d3.select("#tooltip")
                        .style("left", xPosition + "px")
                        .style("top", function(){ 
                                  if (yPosition > (height - (height / 4))){ yPosition = yPosition - (height/6); }; // TODO
                                    // Updates the tooltip position and value.
                                    return yPosition + "px"})
                        .select("#milestones")
                        .html(function() {				     
                                month = d.time.getMonth();
                                year = d.time.getFullYear()
                                return (getMilestone(milestones,year,month));                                    
                            
                         }
                             );
                
                
                // Shows the tooltip.
                        d3.select("#tooltip").classed("hidden", false);
                        })
                        // Hides the tooltip.
                        .on("mouseout", function() {
                        // Hides the tooltip.
                        d3.select("#tooltip").classed("hidden", true);
                        });
       
      };   
