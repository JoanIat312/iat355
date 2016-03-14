var pathes; // array for all pathes that have data points associate with
var keyArray = [];//array that store keys of each column, used to access each cell in the corresponding column
var keyArray2 = [];//array that store keys of each column, used to access each cell in the corresponding column
var dataset = [];//array that store all data points
var yearArray = [];//array that stroe all years used in the year line chart and urban histogram
var countryArray = [];//array that stroe all country names used in the national histogram
var bars = [];//array that stores all rectagle objects for the national histogram
var countryBars = [];//array that stores all rectagle objects for the urban histogram

//below is svg elements
var svg;//svg for the first visualziation which is the national line chart
var svg2;//svg for the second visualziation which is the national histogram
var svg3;//svg for the third visualziation which is the urban histogram of selected country

//below is elements for brushing in the national line chart
var brush;
var slider;
var handler;

//belows global variables for scales and axies
var scale;
var xScale;
var countryScale;
var countryAxis;
var axis;
var xAxis;

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
                    dataset = points;
                    //dataset = [points[0]];
					//initialize svg element
                    svg = d3.select(".svg1-container svg");
					//call functions that draws the scale and draw all pathes that represent the data points
                    drawScale(svg, points);
                    drawPath(points);
    
                }
            });
        
		
		//the function that draws the scale
		//takes two arguments, which are the svg the visualization is going to draw upon, 
		//and the data points user selected
		function drawScale(svg, points){
			
			//store all keys into the key array
			//console will display all keys for easy understanding
			keyArray = d3.keys(points[0]);
            for(var i = 0; i < keyArray.length-1; i++){
                yearArray[i] = keyArray[i];
            }
			
			//display the name of the dataset in html
			document.getElementsByTagName("h2")[0].innerHTML = keyArray[11];
            
			//calculate the scale
			//a common scale of 0 to 100 is used for all three line charts since we are dealing with percentage
			//result stored in the global variable
            scale = d3.scale.linear()
				.domain([0, 100])
				.range([650, 50]);//the y location the scale is mapped to on screen
            xScale = d3.scale.ordinal()
            .domain(yearArray)
            .rangePoints([65, screen.width-60]);
			//display the axis using the scale just calcualted at the left position x: 100, y: 0
            axis = d3.svg.axis()
				.orient("left")
				.scale(scale)
				svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(65, 0)")
				.call(axis);
            
            //initializing brush on the x axis
            brush = d3.svg.brush()
            .x(xScale)
            .extent([0, 0])
            .on("brush", brushed)
            .on("brushend", brushend);
           
            //display x axis
            svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0, 670)")
			.call(d3.svg.axis()
                .scale(xScale)
                .orient("bottom"))
             .select(".domain")
             .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
              .attr("class", "halo");
              
             //initializing slider for brushing
            slider = svg.append("g")
            .attr("class", "slider")
            .call(brush);
            slider.selectAll(".extent,.resize")
                .remove();
            slider.select(".background")
                .attr("height", 40);
                
             //initializing handle for the slider
            handle = slider.append("circle")
                .attr("class", "handle")
                .attr("transform", "translate(0,670)")
                .attr("r", 9);
            slider.call(brush.event)
                .transition() // gratuitous intro!
                    .duration(750)
                    .call(brush.extent([70, 70]))
                    .call(brush.event);
		}//end of drawScale
		
       //called when user is performing brushing
       function brushed() {
            var value = brush.extent()[1];
            if (d3.event.sourceEvent) { // not a programmatic event
                
                //ser the max and min value user can brush on the slider
                if(d3.mouse(this)[0] > 70 && d3.mouse(this)[0] < 1300){
                    //set the position of the handle to the mouse position
                    value = d3.mouse(this)[0];
                }else if (d3.mouse(this)[0] <= 70){
                    value = 70;
                }else{
                    value = 1300;
                }
                brush.extent([value, value]);
            }
                
                handle.attr("cx", value);
            }
        function brushend() {
            var year;
            if (!d3.event.sourceEvent) {
                return; // only transition after input
            }
            var value = brush.extent()[1];                    
             if (d3.event.sourceEvent) { // not a programmatic event
                if(d3.mouse(this)[0] > 70 && d3.mouse(this)[0] < 1300){
                    value = d3.mouse(this)[0];
                    
                    //below is how I did snapping for different years
                    //since I was using ordinal scale for years, I could not figure out how should I do round up/down
                    //so I did it manually, but I am expecting there is a much better way of doing it
                    if(value >= 70 && value <= 130){
                        value = 70;
                        year = "2000";
                    }else if (value >= 130 && value < 252 ){
                        value = 190;
                        year = "2001";
                    }else if (value >= 252 && value < 377){
                        value = 315;
                        year = "2002";
                    }else if (value >= 377 && value < 500){
                        value = 440;
                        year = "2003";
                    }else if (value >= 500 && value < 623){
                        value = 560;
                        year = "2004";
                    }else if(value >= 623 && value < 748){
                        value = 686;
                        year = "2005";
                    }else if(value >= 748 && value < 873){
                        value = 810;
                        year = "2006";
                    }else if (value >= 873 && value < 996){
                        value = 936;
                        year = "2007";
                    }else if (value >= 996 && value < 1119){
                        value = 1057;
                        year = "2008";
                    }else if (value >= 1119 && value < 1241){
                        value = 1182;
                        year = "2009";
                    }else{
                        value = 1300;
                        year = "2010";
                    }
                }else if (d3.mouse(this)[0] <= 70){
                    value = 70;
                    year = "2000";
                }else{
                    value = 1300;
                     year = "2010";
                }
                 brush.extent([value, value]);
                 //call function to display the national histogram
                 loadSelection(year);
            } 
             
             console.log(value);
            
        }
        
        //load data for the national histogram
        function loadSelection(year){
            var dataset2 = [];
            for(var i = 0; i < dataset.length; i++){
                //create a new dataset that only has the value of the selected year of all countries
                var datapoint = new Object();
                datapoint[keyArray[11]] = dataset[i][keyArray[11]];
                datapoint[year] = dataset[i][year];
                dataset2.push(datapoint);
                
            }
            //console.log(dataset2);
            //call function to draw the national histogram
            drawAnotherHist(dataset2, year);
        }
        
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
			pathes = svg.selectAll("path")
			.data(points)
			.enter()
			.append("path")
			.attr({
				//set the path position
				d:function(d, i){
					//all pathes shares the same beginning x position which is the year of 2000
					//the y position is determined by the data scaled to the scale we are using
					str = "M65 " + scale(d[keyArray[0]]);
					//loop through all years (2001 - 2009) exclude data from 2000
					//and the last one which is the name of the country
					for(var i = 1; i < keyArray.length-1; i++){
						//all the empty cells in the datasheet is set to be - 99
						//only draw lines when there is data in the cell
                        if(+d[keyArray[i]] >= 0){
							//the y position increases 100 every other year
						  str += " L" + ((screen.width - 60) / 10) *i + " " + scale(+d[keyArray[i]]);
                        } else{
							//log the name of the country and the year of the cell that is missing data
                            //console.log("missing data from country " + d[keyArray[11]] + 
                            //"in the year " + keyArray[i]);
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
                 tip.show(d)
                 selectedCountry = d[keyArray[11]];
                 updatePath();
                 updateBar();
                 
             })
             //click to display the urban histogram of the selected country
             .on("click" ,function(d){
                  selectedCountry = d[keyArray[11]];
                  loadUrbanSelection();
             })
             //hide the tooltip when mouse leaves the line
             .on('mouseout', function(d){
                 tip.hide(d);
             })
		}
		
		//this function changes the style of the path when user hover over it
        function updatePath(){
            svg.selectAll("path")
            .transition().duration(200)
            .attr({
                
				//hover over set the path to red, otherwise black
				stroke: function(d){
					if(d[keyArray[11]] == selectedCountry){
						return "#FF0000";
					}else{
						return "#000";
					}
				},
				//hover over set the path to full opacity, otherwise low opacity
				"stroke-opacity":function(d){
					if(d[keyArray[11]] == selectedCountry){
						return "1";
					}else{
						return "0.4";
					}
				},
				//hover over set the path to be thicker, otherwise skinner
				"stroke-width":function(d){
					if(d[keyArray[11]] == selectedCountry){
						return "4";
					}else{
						return "1";
					}
				}
			})
            
        }//end of updatePath
        
        //draws the second visualization which is the national histogram
        //controlled by the brush in the first visualization
         function drawAnotherHist(points, year){
            for(var i = 0; i < points.length; i++){
                countryArray[i] = points[i][keyArray[11]];
            }
            document.getElementsByTagName("h3")[0].innerHTML = keyArray[11] + " of the year " + year;

            //initializing svg elements
            svg2 = d3.select(".svg2-container svg");
             axis = d3.svg.axis()
                .orient("left")
                .scale(scale)
                svg2.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(60, 0)")
                .call(axis);
                
            //initializing the scale for all countries
            countryScale = d3.scale.ordinal()
            .domain(countryArray)
            .rangePoints([65, screen.width-60]);
            countryAxis = d3.svg.axis()
                .orient("bottom")
                .scale(countryScale)
                 svg2.append("g")
                .attr("class", "countryName")
                .attr("transform", "translate(0, 660)")
                .call(countryAxis);
            
            //initializing tootip    
            var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10,0])
           .html(function(d) {
                    
                    return "<strong>Country:</strong> <span style='color:red'>" + d[keyArray[11]] + "</span>";
                    
                })   
            svg2.call(tip);  
            
            //initializing bar arrays
            bars = svg2.selectAll("rect")
            .data(points)
            .enter()
            .append("g")
            .attr("class", "bar");
            
            //create rectagle for all data points in the bar array
            bars.append("rect")
            .attr("x", function(d){
                return countryScale(d[keyArray[11]]);
            })
            .attr("y", function(d){
                return scale(d[year]);
            })
            .attr("width", "2")
            .attr("height", function(d){
                if(650 - scale(d[year]) > 0){
                    return  650 - scale(d[year]);
                }else{
                    console.log("missing data from country " + d[keyArray[11]] + 
                            "in the year " + year);
                }
            })
             
             //handles user inputs
             //changes color and thickness
             //also display a tooltip of the country name the bar represents
             //the corresponding bar in the national line chart will also be hightlighted
             .on("mouseover", function(d, i){
                 selectedCountry = d[keyArray[11]];
                 updateBar();
                 updatePath();
                 tip.show(d);
             })
              .on("click" ,function(d){
                  selectedCountry = d[keyArray[11]];
                  loadUrbanSelection();
             })
             .on('mouseout', function(d){
                 tip.hide(d);
             })
             //update all bars when user select a different year
              bars = svg2.selectAll("rect")
              .data(points)
             .transition().duration(1000)
             .attr("x", function(d){
                return countryScale(d[keyArray[11]]);
            })
            .attr("y", function(d){
                return scale(d[year]);
            })
            .attr("width", "2")
            .attr("height", function(d){
                if(650 - scale(d[year]) > 0){
                    return  650 - scale(d[year]);
                }else{
                    console.log("missing data from country " + d[keyArray[11]] + 
                            "in the year " + year);
                }
            })
           
        }
        
        //handles style of the bars
        function updateBar(){
             svg2.selectAll("rect")
                .transition().duration(200)
                .attr({
                    fill: function(d){
					if(d[keyArray[11]] == selectedCountry){
						return "#FF0000";
					}else{
						return "#000";
					}
				},
                width:function(d){
                    if(d[keyArray[11]] == selectedCountry){
						return "5";
					}else{
						return "2";
					}
                }
             })
        }
        
        //load data from the second source when user click any line or bar in either the national line chart or the national histogram
        function loadUrbanSelection(){
            var row = [];
            var datasetUrban = [];
            d3.csv("http://www.sfu.ca/~yitingl/data/urban.csv")
            .row(function(d){
			    return d;
            })
			//error checking 
            .get(function(error, points){
                if(error){
                    console.error("Error occured while reading file. " + error);
                }else{
					//alert user that the file loaded successfully
					//store all data points into the array
                    datasetUrban = points;
                    //stores keys of the second dataset into the another key array
                    keyArray2 = d3.keys(points[0]);
                    // loop through the second dataset to find the row of the selected country
                    datasetUrban.forEach (function(d){
                        if(d[keyArray2[11]] == selectedCountry){
                           for(var i = 0; i < keyArray.length - 1; i ++){
                               //fill up the row with the values of the country
                               var datapoint = new Object();
                               datapoint.year = keyArray2[i];
                               datapoint.value = d[keyArray2[i]];
                               row.push(datapoint);
                           }
                        }else{
                            console.log("didnt found")
                        }
                    });
                    
                    //call function to draw the urban histogram of the selected country
                     drawUrbanHistogram(row);
                     //console.log(row);
                }
            });
           
        }
        
        //draws the scale and the histogram of the urban propotion of the selected country
        function drawUrbanHistogram(row){
           //set the title of the third visualization
            document.getElementsByTagName("h4")[0].innerHTML = keyArray2[11] + " of the country " + selectedCountry;
            //initializing svg elements
            svg3 = d3.select(".svg3-container svg");
            
            //draw the two axies
            //the same as the national line chart
            axis = d3.svg.axis()
				.orient("left")
				.scale(scale)
				svg3.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(60, 0)")
				.call(axis);
            xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            svg3.append("g")
            .attr("class", "xAxis")
		    .attr("transform", "translate(10, 660)")
			.call(xAxis);
            
            //initializing tooltip which display the value of the bar
            var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-5,0])
            .html(function(d) {
                    
                    return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";
                    
                })   
            svg3.call(tip); 
             
             //initializing countrybar array with datapoints
            countryBars = svg3.selectAll("rect")
            .data(row)
            .enter()
            .append("g")
            .attr("class", "bar");
            
            //add rectagle for each datapoints in the countryBars array
            countryBars.append("rect")
            .attr("x", function(d){
                return xScale(d.year);
            })
            .attr("y", function(d){
                return scale(d.value);
            })
            .attr("width", "20")
            .attr("height", function(d){
                if(660 - scale(d.value) > 0){
                    return  660 - scale(d.value);
                }else{
                    console.log("missing data from country " + selectedCountry + 
                            "in the year " + d.year);
                }
            //handle user interactions
            //display tooltip, change color and thickness
            }).on("mouseover", function(d, i){
                 tip.show(d)
                 updateUrbanBar(d.year);
                 
             })
             .on('mouseout', function(d){
                 tip.hide(d);
                 svg3.selectAll("rect")
                .transition().duration(200)
                .attr({
                    fill: "#000",
                    width: "20"
             })
             })
             console.log(row);
             //update all bars when user select another country
            countryBars=svg3.selectAll("rect")
            .data(row)
            .transition().duration(1000)
            .attr("x", function(d){
                return xScale(d.year);
            })
            .attr("y", function(d){
                return scale(d.value);
            })
            .attr("width", "20")
            .attr("height", function(d){
                if(660 - scale(d.value) > 0){
                    return  660 - scale(d.value);
                }else{
                    console.log("missing data from country " + selectedCountry + 
                            "in the year " + d.year);
                }
            })
        }
        
        //handle styling of the third visualziation
        function updateUrbanBar(year){
            svg3.selectAll("rect")
                .transition().duration(200)
                .attr({
                    fill: function(d){
					if(d.year == year){
						return "#FF0000";
					}else{
						return "#000";
					}
				},
                width:function(d){
                    if(d.year == year){
						return "30";
					}else{
						return "20";
					}
                }
             })
        }