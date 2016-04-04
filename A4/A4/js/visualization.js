var pathes; // array for all pathes that have data points associate with
var keyArray = [];//array that store keys of each column, used to access each cell in the corresponding column
var keyArray2 = [];//array that store keys of each column, used to access each cell in the corresponding column
var keyArray3 = [];
var datasetTotal = [];//array that store all data points
var datasetUrban = [];
var datasetRural = [];
var countryBars = [];//array that stores all rectagle objects for the urban histogram
var moreCountryBars=[];
var legendList = [
    {
        "Type":"national",
        "color":"black" 
        
    },
    {
        "Type":"urban",
        "color":"blue" 
    },
    {
        "Type":"rural",
        "color":"orange" 
    }];
    
  var legendList2 = [{
        "Type":"urban",
        "color":"blue" 
    },
    {
        "Type":"rural",
        "color":"orange" 
    }];
//below is svg elements
var svg;//svg for the first visualziation which is the national line chart
var svg2;//svg for the second visualziation which is the national histogram
var svg3;//svg for the third visualziation which is the urban histogram of selected country

//below is elements for brushing in the national line chart
var brush;

//belows global variables for scales and axies
var brushableScale;
var scale;
var xScale;
var xScale2;
var duoxScale;
var countryScale;
var countryAxis;
var axis;
var brushableAxis
var xAxis;
var xAxis2;
var scaleMin = 0;
var scaleMax = 100;
var regionSelected;

var selectedCountry;//global variable to link the two national visualization

        //load the national data from server
        d3.csv("http://www.sfu.ca/~yitingl/data/national.csv")
            .row(function(d){
			return d;
            })
			//error checking 
            .get(function(error, points){
                if(error){
                    console.error("Error occured while reading file. " + error);
                }else{
					//store all data points into the array
                    datasetTotal = points;
                    keyArray = d3.keys(datasetTotal[0]);
                    //dataset = points[1];
					//initialize svg element
                    svg = d3.select(".svg1-container svg");
                   
					//call functions that draws the scale and draw all pathes that represent the data points
                    drawScale();
                    drawPath(datasetTotal);
                }
            });
            
            d3.csv("http://www.sfu.ca/~yitingl/data/urban.csv")
            .row(function(d){
			return d;
            })
			//error checking 
            .get(function(error, points){
                if(error){
                    console.error("Error occured while reading file. " + error);
                }else{
					//store all data points into the array
                    datasetUrban = points;
                    
                }
            });
            
            d3.csv("http://www.sfu.ca/~yitingl/data/rural.csv")
            .row(function(d){
			return d;
            })
			//error checking 
            .get(function(error, points){
                if(error){
                    console.error("Error occured while reading file. " + error);
                }else{
					//store all data points into the array
                    datasetRural = points;
                   
                }
            });
        function loadSelection(){
            var row = [];
            var row2 = [];
            var row3 = [];
            var row4 = [];
            
            datasetTotal.forEach (function(d){
            if(d[keyArray[11]] == selectedCountry){
                row3.push(d);
                 for(var i = 0; i < keyArray.length - 3; i ++){
                        
                        //fill up the row with the values of the country
                        var datapoint = new Object();
                        datapoint.year = keyArray[i];
                        datapoint.value = d[keyArray[i]];
                        row4.push(datapoint);
                    }
                }else{
                    //console.log("didnt found")
                }
            });
            keyArray3 = d3.keys(datasetRural[0]);
            // loop through the second dataset to find the row of the selected country
            datasetRural.forEach (function(d){
                if(d[keyArray3[11]] == selectedCountry){
                    row3.push(d);
                    for(var i = 0; i < keyArray.length - 3; i ++){
                        
                        //fill up the row with the values of the country
                        var datapoint = new Object();
                        datapoint.year = keyArray3[i];
                        datapoint.value = d[keyArray3[i]];
                        row.push(datapoint);
                    }
                }else{
                    //console.log("didnt found")
                }
            });
            
            //call function to draw the urban histogram of the selected country
            
                //console.log(row)
            
            keyArray2 = d3.keys(datasetUrban[0]);
            // loop through the second dataset to find the row of the selected country
            datasetUrban.forEach (function(d){
                if(d[keyArray2[11]] == selectedCountry){
                    row3.push(d);
                    
                    for(var i = 0; i < keyArray.length - 3; i ++){
                        //fill up the row with the values of the country
                        var datapoint = new Object();
                        datapoint.year = keyArray2[i];
                        datapoint.value = d[keyArray2[i]];
                        row2.push(datapoint);
                    }
                }else{
                    //console.log("didnt found")
                }
            });
            
            //call function to draw the urban histogram of the selected country
                //console.log(row);
            drawUrbanHistogram(row2);
            drawRuralHistogram(row);
            drawCountryPath(row3);
            drawUrbanDots(row2);
            drawRuralDots(row);
            drawNationalDots(row4);
        }
        
		//the function that draws the scale
		//takes two arguments, which are the svg the visualization is going to draw upon, 
		//and the data points user selected
		function drawScale(){
			svg = d3.select(".svg1-container svg");
			//store all keys into the key array
			//console will display all keys for easy understandin
			
			//display the name of the dataset in html
			document.getElementsByTagName("h2")[0].innerHTML = "Proportion of the population using improved drinking water sources, national";
            document.getElementsByTagName("h3")[0].innerHTML = "Proportion of the population using improved drinking water sources";
            document.getElementsByTagName("h4")[0].innerHTML = "Proportion of the population using improved drinking water sources, urban and rural ";
			//calculate the scale
			//a common scale of 0 to 100 is used for all three line charts since we are dealing with percentage
			//result stored in the global variable
           //the y location the scale is mapped to on screen
            brushableScale = d3.scale.linear()
				.domain([scaleMin, scaleMax])
				.range([350, 50]);
            brushableAxis = d3.svg.axis()
                    .scale(brushableScale)
                    .orient("left")
                
            svg.append("g")
            .attr("class", "axis")
            .transition().duration(500)
            .attr("transform", "translate(30, 0)")
            .call(brushableAxis);
            
             brush = d3.svg.brush()
            .y(brushableScale)
            .on("brushstart", brushstart)
            .on("brush", brushed)
            .on("brushend", brushend);
            
            svg.append("g")
                .attr("class", "brush")
                .attr("transform", "translate(30, 0)")
                .call(brush)
                .selectAll(".brush rect")
                .attr("x", -10)
                .attr("width", 20);
            xScale = d3.scale.linear()
            .domain([2000, 2010])
            .range([30, screen.width/2.2]);
            xScale2 = d3.scale.linear()
            .domain([2000, 2010])
            .range([30, screen.width/2.6]);
			//display the axis using the scale just calcualted at the left position x: 100, y: 0
            xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
            svg.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0, 350)")
                .call(xAxis);
            //initializing brush on the x axis
           
          
          svg2 = d3.select(".svg2-container svg");
          //calculate the scale
			//a common scale of 0 to 100 is used for all three line charts since we are dealing with percentage
			//result stored in the global variable
			//display the axis using the scale just calcualted at the left position x: 100, y: 0
            
            scale = d3.scale.linear()
            .domain([0, 100])
            .range([360, 50]);
            axis = d3.svg.axis()
            .orient("left")
            .scale(scale)
            xAxis2 = d3.svg.axis()
                    .scale(xScale2)
                    .orient("bottom")
            svg2.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(30, 0)")
            .call(axis);
            svg2.append("g")
                    .attr("class", "xAxis")
                    .attr("transform", "translate(0, 360)")
                    .call(xAxis2);
		   var legend2 = svg2.selectAll(".legend")
            .data(legendList)
            .enter().append("g")
            .attr("class", "legend");
            
            legend2.append("rect")
            .attr("x", function(d,i){
                return 200 + i*80;
            })
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d){
                return d.color;
            })
            
            legend2.append("text")
            .attr("x", function(d, i){
                return 215 + i *80;
            })
            .attr("y", 5)
            .attr("dy", ".35em")
            .text(function(d) { return d.Type;})
            
            svg3 = d3.select(".svg3-container svg");
                duoxScale = d3.scale.linear()
                .domain([2000, 2010])
                .range([50, screen.width*0.9]);
                //draw the two axies
                //the same as the national line chart
                axis = d3.svg.axis()
                    .orient("left")
                    .scale(scale)
                    svg3.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(40, -10)")
                    .call(axis);
                xAxis = d3.svg.axis()
                .scale(duoxScale)
                .orient("bottom")
                svg3.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(10, 350)")
                .call(xAxis);
                
                
            var legend3 = svg3.selectAll(".legend")
            .data(legendList2)
            .enter().append("g")
            .attr("class", "legend");
            
            legend3.append("rect")
            .attr("x", function(d,i){
                return 600 + i*70;
            })
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d){
                return d.color;
            })
            
            legend3.append("text")
            .attr("x", function(d, i){
                return 615 + i *70;
            })
            .attr("y", 5)
            .attr("dy", ".35em")
            .text(function(d) { return d.Type;})
        }//end of drawScale

        function brushstart(){
            scaleMin = 0;
            scaleMax = 100;
            brushableScale.domain([scaleMin, scaleMax]);
            svg.select(".axis").call(brushableAxis);
            drawPath(datasetTotal);
           
        }
        
       //called when user is performing brushing
       function brushed() {
       
                 if (d3.event.sourceEvent) { // not a programmatic event
                    scaleMin = brush.empty()? 0 : d3.round(brush.extent()[0], 0);
                    scaleMax = brush.empty()? 100 : d3.round(brush.extent()[1], 0);
                 }
               
                
                
            }
        function brushend() {
             brushableScale.domain([scaleMin, scaleMax]);
             svg.select(".axis").call(brushableAxis);
             drawPath(datasetTotal);
        }
        
        //load data for the national histogram
        
		//the function draws a path for each data point
		//also update the path if user made a new selection
		function drawPath(points){
             var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-5,0])
            .html(function(d) {
                    
                    return "<strong>Country:</strong> <span style='color:red'>" + d[keyArray[11]] + "</span>";
                    
                })   
            svg.call(tip);  
			var str = "";
			pathes = svg.selectAll(".pathes")
			.data(points)
			.enter()
            .append("g")
            .attr("class", "pathes");
            pathes.append("path")
			.attr({
				//set the path position
				d:function(d, i){
					//all pathes shares the same beginning x position which is the year of 2000
					//the y position is determined by the data scaled to the scale we are using
					//str = "M30 " + brushableScale(d[keyArray[0]]);
                    //str = "M30";
					//loop through all years (2001 - 2009) exclude data from 2000
					//and the last one which is the name of the country
					for(var i = 0; i < keyArray.length-3; i++){
						//all the empty cells in the datasheet is set to be - 99
						//only draw lines when there is data in the cell
                        if(brushableScale(+d[keyArray[i]]) >= 50 && brushableScale(+d[keyArray[i]]) <= 350){
							//the y position increases 100 every other year
                          if(str == ""){
                              str = "M30 " + brushableScale(+d[keyArray[i]]);
                          }else{  
						      str += " L" + ((screen.width / 2.2) / 10) *i + " " + brushableScale(+d[keyArray[i]]);
                        }    
                        } else{
                                
                            }
                        }
                        return str;
				},
				//set the style of the path
                stroke:"black",
                "stroke-opacity":0.4
			})
			//call the updatePath function when user hover over a line on the chart
            //also shows a tooltip which display the name of the country that the line represents
             .on("mouseover", function(d, i){
                 if(regionSelected == null || regionSelected == "All"){
                    tip.show(d)
                    selectedCountry = d[keyArray[11]];
                    updatePath();
                }else{
                    if(d[keyArray[13]] == regionSelected){
                         tip.show(d)
                        selectedCountry = d[keyArray[11]];
                        updatePath();
                    }
                }

                 
             })
             //click to display the urban histogram of the selected country
             .on("click" ,function(d){
                 if(regionSelected == null || regionSelected == "All"){
         
                    selectedCountry = d[keyArray[11]];
                    loadSelection();
                }else{
                    if(d[keyArray[13]] == regionSelected){
                        selectedCountry = d[keyArray[11]];
                        loadSelection();
                    }
                }
             })
             //hide the tooltip when mouse leaves the line
             .on('mouseout', function(d){
                 tip.hide(d);
             })
             
             svg.selectAll(".pathes path")
            .data(points)
            .transition().duration(200)
			.attr({
				d:function(d, i){
                     str  = "";
					//loop through all years (2001 - 2009) exclude data from 2000
					//and the last one which is the name of the country
					for(var i = 1; i < keyArray.length-3; i++){
						//all the empty cells in the datasheet is set to be - 99
						//only draw lines when there is data in the cell
                        if(brushableScale(+d[keyArray[i]]) >= 50 && brushableScale(+d[keyArray[i]]) <= 350){
							//the y position increases 100 every other year
                          if(str == ""){
                              str = "M30 " + brushableScale(+d[keyArray[i]]);
                          }else{  
						      str += " L" + (30 + 59 *i) + " " + brushableScale(+d[keyArray[i]]);
                        }    
                        } else{
                                
                            }
                        }
					return str;
				},
                 stroke:"black",
                "stroke-opacity":0.4
			})
		}
        
        function loadRegion(region){
            regionSelected = region;
                svg.selectAll(".pathes path")
                .transition().duration(200)
                .attr({
                    
                    //hover over set the path to red, otherwise black
                    stroke: function(d){
                        if(d[keyArray[13]] == region){
                            return "#2A5769";
                        }
                        else{
                            return "#BAB09E";
                        }
                    },
                    //hover over set the path to full opacity, otherwise low opacity
                    "stroke-opacity":function(d){
                        if(d[keyArray[13]] == region){
                            return "1";
                        }else{
                            return "0.4";
                        }
                    }
                    //hover over set the path to be thicker, otherwise skinner
                })
        }
		
        function drawNationalDots(points){
            var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-5,0])
            .html(function(d) {
                    
                    return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";
                    
                })   
            svg2.call(tip);  
            var dots = svg2.selectAll(".nationaldot")
            .data(points)
            .enter()
            .append("g")
            .attr("class", "nationaldot");
            dots.append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d){
                return xScale2(+d.year);
            })
            .attr("cy", function(d){
                return scale(d.value);
            })
             .on("mouseover", function(d, i){
                 tip.show(d)
           
                 
             })
             .on('mouseout', function(d){
                 tip.hide(d);
             })
            .style("fill", "red");
          
          dots = svg2.selectAll(".nationaldot circle")
          .data(points)
          .transition().duration(200)
          .attr("r", 3.5)
            .attr("cx", function(d){
                return xScale2(+d.year);
            })
            .attr("cy", function(d){
                return scale(d.value);
            })
            .style("fill", "red")
            .style("stroke", "1px black solid");
           
        }
        function drawUrbanDots(points){
            var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-5,0])
            .html(function(d) {
                    
                    return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";
                    
                })   
            svg2.call(tip);  
            var dots = svg2.selectAll(".urbandot")
            .data(points)
            .enter()
            .append("g")
            .attr("class", "urbandot");
            dots.append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d){
                return xScale2(+d.year);
            })
            .attr("cy", function(d){
                return scale(d.value);
            })
             .on("mouseover", function(d, i){
                 tip.show(d)
           
                 
             })
             .on('mouseout', function(d){
                 tip.hide(d);
             })
            .style("fill", "red");
          
          dots = svg2.selectAll(".urbandot circle")
          .data(points)
          .transition().duration(200)
          .attr("r", 3.5)
            .attr("cx", function(d){
                return xScale2(+d.year);
            })
            .attr("cy", function(d){
                return scale(d.value);
            })
            .style("fill", "red");
        }
        
        function drawRuralDots(points){
             var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-5,0])
            .html(function(d) {
                    
                    return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";
                    
                })   
            svg2.call(tip);  
            var dots = svg2.selectAll(".ruraldot")
            .data(points)
            .enter()
            .append("g")
            .attr("class", "ruraldot");
            dots.append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d){
                return xScale2(+d.year);
            })
            .attr("cy", function(d){
                return scale(d.value);
            })
            .on("mouseover", function(d, i){
                 tip.show(d)
           
                 
             })
             .on('mouseout', function(d){
                 tip.hide(d);
             })
            .style("fill", "red");
          
          dots = svg2.selectAll(".ruraldot circle")
          .data(points)
          .transition().duration(200)
          .attr("r", 3.5)
            .attr("cx", function(d){
                return xScale2(+d.year);
            })
            .attr("cy", function(d){
                return scale(d.value);
            })
            .style("fill", "red");
        }
        function drawCountryPath(points){
            
            document.getElementsByTagName("h3")[0].innerHTML = "Proportion of the population using improved drinking water sources of " + selectedCountry;  
            var str = "";
			console.log(points);
            var urbanpath = svg2.selectAll(".pathes")
			.data(points)
			.enter()
            .append("g")
            .attr("class", "pathes");
            
			urbanpath.append("path")
			.attr({
				//set the path position
				d:function(d, i){
					//all pathes shares the same beginning x position which is the year of 2000
					//the y position is determined by the data scaled to the scale we are using
					str = "M30 " + scale(+d[keyArray2[0]]);
					//loop through all years (2001 - 2009) exclude data from 2000
					//and the last one which is the name of the country
					for(var i = 1; i < keyArray2.length-3; i++){
						//all the empty cells in the datasheet is set to be - 99
						//only draw lines when there is data in the cell
                        if(+d[keyArray2[i]] >= 0){
							//the y position increases 100 every other year
						  str += " L" + (30 + 49.5*i) + " " + scale(+d[keyArray2[i]]);
                        } else{
							//log the name of the country and the year of the cell that is missing data
                            //console.log("missing data from country " + d[keyArray[11]] + 
                            //"in the year " + keyArray[i]);
                        }
					}
					return str;
				},
				//set the style of the path
                stroke:function(d){
                 if(d3.keys(d)[11].includes("total")){
                     return "black";
                     
                 }else if (d3.keys(d)[11].includes("urban")){
                     return "blue";
                 }else{
                     return "orange";
                 }   
                },
                "stroke-width":1
			})
           var text = svg2.selectAll(".update")
           .data(points)
           .enter()
           .append("g")
           .attr("class", "update");
           
            text.append("text")
            .attr("transform", function(d){
                return "translate(532," + scale(d[keyArray2[10]])+3  + " )";
            })
            .text(function(d){
                return "Rate of Change: " + d["Rate of Change"];
            })
             svg2.selectAll(".pathes path")
             .data(points)
             .transition().duration(200)
             .attr({
                 //set the path position
				d:function(d, i){
					//all pathes shares the same beginning x position which is the year of 2000
					//the y position is determined by the data scaled to the scale we are using
					str = "M30 " + scale(d[keyArray2[0]]);
					//loop through all years (2001 - 2009) exclude data from 2000
					//and the last one which is the name of the country
					for(var i = 1; i < keyArray2.length-3; i++){
						//all the empty cells in the datasheet is set to be - 99
						//only draw lines when there is data in the cell
                        if(+d[keyArray2[i]] >= 0){
							//the y position increases 100 every other year
						  str += " L" + (30 + 49.5*i)  + " " + scale(+d[keyArray2[i]]);
                        } else{
							
                        }
					}
					return str;
				},
				//set the style of the path
                stroke:function(d){
                 if(d3.keys(d)[11].includes("total")){
                     return "black";
                     
                 }else if (d3.keys(d)[11].includes("urban")){
                     return "blue";
                 }else{
                     return "orange";
                 }   
                },
                "stroke-width":1
             })
             svg2.selectAll(".update text")
             .data(points)
             .attr("transform", function(d){
                return "translate(532," + (scale(d[keyArray2[10]])+2)  + " )";
            })
            .text(function(d){
                return "Rate of Change: " + d["Rate of Change"];
            })

        }
		//this function changes the style of the path when user hover over it
        function updatePath(){
            svg.selectAll(".pathes path")
            .transition().duration(200)
            .attr({
                
				//hover over set the path to red, otherwise black
				stroke: function(d){
					if(d[keyArray[11]] == selectedCountry && (regionSelected == null || regionSelected == "All")){
						return "#FF0000";
					}else if(d[keyArray[13]] == regionSelected){
                        if(d[keyArray[11]] == selectedCountry){
                            return "#2A5769";
                        }else{
                             return "#2A5769";
                        }
                    }
                    else{
						return "#BAB09E";
					}
				},
				//hover over set the path to full opacity, otherwise low opacity
				"stroke-opacity":function(d){
					if(d[keyArray[11]] == selectedCountry && (regionSelected == null || regionSelected == "All")){
						return "1";
					}else if(d[keyArray[13]] == regionSelected){
                        if(d[keyArray[11]] == selectedCountry){
                            return "#1";
                        }else{
                             return "0.6";
                        }
                    }else{
						return "0.4";
					}
				},
				//hover over set the path to be thicker, otherwise skinner
				"stroke-width":function(d){
					if(d[keyArray[11]] == selectedCountry && (regionSelected == null || regionSelected == "All")){
						return "3";
					}else if(d[keyArray[11]] == selectedCountry && d[keyArray[13]] == regionSelected){
                        return "3";
                    }
                    else{
						return "1";
					}
				}
			})
            
        }//end of updatePath
        //load data from the second source when user click any line or bar in either the national line chart or the national histogram
       
        //draws the scale and the histogram of the urban propotion of the selected country
        function drawUrbanHistogram(row){
            document.getElementsByTagName("h4")[0].innerHTML = "Proportion of the population using improved drinking water sources, urban and rural of the country " + selectedCountry;
            //initializing tooltip which display the value of the bar
            var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-5,0])
            .html(function(d) {
                    
                    return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";
                    
                })   
            svg3.call(tip); 
             
             //initializing countrybar array with datapoints
            countryBars = svg3.selectAll(".bar")
            .data(row)
            .enter()
            .append("g")
            .attr("class", "bar");
            
            //add rectagle for each datapoints in the countryBars array
            countryBars.append("rect")
            .attr("x", function(d){
                return duoxScale(d.year) - 10;
            })
            .attr("y", function(d){
                return scale(d.value);
            })
            .attr("width", "20")
            .attr("height", function(d){
                if(350 - scale(d.value) > 0){
                    return  350 - scale(d.value);
                }else{
                    console.log("missing data from country " + selectedCountry + 
                            "in the year " + d.year);
                }
            //handle user interactions
            //display tooltip, change color and thickness
            })
            .attr("opacity", "0.5")
            .on("mouseover", function(d, i){
                 tip.show(d)
                 updateUrbanBar(d.year);
                 
             })
             .on('mouseout', function(d){
                 tip.hide(d);
                 svg3.selectAll("rect")
                .transition().duration(200)
                .attr({
                   opacity:"0.5"
             })
             })
             //console.log(row);
             //update all bars when user select another country
            countryBars = svg3.selectAll(".bar rect")
            .data(row)
            .transition().duration(1000)
            .attr("x", function(d){
                return duoxScale(d.year)-10;
            })
            .attr("y", function(d){
                return scale(d.value);
            })
            .attr("width", "20")
            .attr("height", function(d){
                if(350 - scale(d.value) > 0){
                    return  350 - scale(d.value);
                }else{
                    console.log("missing data from country " + selectedCountry + 
                            "in the year " + d.year);
                }
            })
            .attr("opacity", "0.5")
        }
        
        //handle styling of the third visualziation
        function updateUrbanBar(year){
            svg3.selectAll(".bar rect")
                .transition().duration(200)
                .attr({
                    opacity: function(d){
					if(d.year == year){
						return "1";
					}else{
						return "0.5";
					}
				}
                })
              
        }
        
     
         //draws the scale and the histogram of the urban propotion of the selected country
        function drawRuralHistogram(row){
           //set the title of the third visualization
           // document.getElementsByTagName("h4")[0].innerHTML = keyArray3[11] + " of the country " + selectedCountry;
            //initializing svg elements
           
            //draw the two axies
            //the same as the national line chart
            var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-5,0])
            .html(function(d) {
                    
                    return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";
                    
                })   
            svg3.call(tip); 
             
             //initializing countrybar array with datapoints
            moreCountryBars = svg3.selectAll(".moreBar")
            .data(row)
            .enter()
            .append("g")
            .attr("class", "moreBar");
            
            //add rectagle for each datapoints in the countryBars array
            moreCountryBars.append("rect")
            .attr("x", function(d){
                return duoxScale(d.year) + 10;
            })
            .attr("y", function(d){
                return scale(d.value);
            })
            .attr("width", "20")
            .attr("height", function(d){
                if(350 - scale(d.value) > 0){
                    return  350 - scale(d.value);
                }else{
                    console.log("missing data from country " + selectedCountry + 
                            "in the year " + d.year);
                }
            //handle user interactions
            //display tooltip, change color and thickness
            })
            .attr("opacity", "0.5")
            .on("mouseover", function(d, i){
                 tip.show(d)
                 updateRuralBar(d.year);
                 
             })
             .on('mouseout', function(d){
                 tip.hide(d);
                 svg3.selectAll("rect")
                .transition().duration(200)
                .attr({
                    opacity:"0.5"
             })
             })
             //console.log(row);
             //update all bars when user select another country
            moreCountryBars = svg3.selectAll(".moreBar rect")
            .data(row)
            .transition().duration(1000)
            .attr("x", function(d){
                return duoxScale(d.year)+10;
            })
            .attr("y", function(d){
                return scale(d.value);
            })
            .attr("width", "20")
            .attr("height", function(d){
                if(350 - scale(d.value) > 0){
                    return  350 - scale(d.value);
                }else{
                    console.log("missing data from country " + selectedCountry + 
                            "in the year " + d.year);
                }
            })
            .attr("opacity", "0.5")
        }
        
        //handle styling of the third visualziation
        function updateRuralBar(year){
            svg3.selectAll(".moreBar rect")
                .transition().duration(200)
                .attr({
                    opacity: function(d){
					if(d.year == year){
						return "1";
					}else{
						return "0.5";
					}
				}
                })
              
        }