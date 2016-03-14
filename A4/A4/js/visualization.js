var pathes; // array for all pathes that have data points associate with
var keyArray = [];
var keyArray2 = [];//array that store keys of each column, used to access each cell in the corresponding column
var dataset = [];//array that store all data points
var yearArray = [];
var countryArray = [];
var bars = [];
//below is all global variables
var svg;
var svg2;
var scale;
var xScale;
var countryScale;
var countryAxis;
var axis;
var xAxis;
var selectedCountry;



        d3.csv("http://www.sfu.ca/~yitingl/data/national.csv")
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
			//console.log("Here is the list of keys of the dataset: " + yearArray);
			
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
			
			//createdashed lines to indicate different x (years) in the visualization
			//except the first year because it is represented by the scale
			//the last key is excluded because it is the name of the dataset
			//which does not have numerical data associate with
			xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            svg.append("g")
            .attr("class", "xAxis")
		    .attr("transform", "translate(0, 670)")

			.call(xAxis);
            for(var i = 0; i < keyArray.length-1; i++){
				svg.append("line")
				.attr({
					//increase x position by 100 based on the number of years it is representing
					//y position remain the same for all dashed lines
                    x1:65 + ((screen.width) / 11)*i,
                    y1:50,
                    x2:65 + ((screen.width) / 11)*i,
                    y2:650,
					//the style of the line
                    "stroke-width": 1.5,
                    "stroke-linecap":"round",
                    "stroke-dasharray":"1, 10",

                });
				//display the x axis which is the year using keyArray
				/*svg.append("text")
				.attr({
					x: 90 + i *100,
					y: 670,
					class:"filter_label"
				})
                 .on("click", function(){
                    //drawAnotherHist(selectedCountry);
                    alert(i);
                })
				.text(keyArray[i])*/
               
			}//end of for
			d3.selectAll(".xAxis .tick")
            .on("click", function(d){
                var dataset2 = [];
               for(var i = 0; i < points.length; i++){
                var datapoint = new Object();
                datapoint[keyArray[11]] = points[i][keyArray[11]];
                datapoint[d] = points[i][d];
                dataset2.push(datapoint);
                
            }
                drawAnotherHist(dataset2, d);
                
            })
		}//end of drawScale
		
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
            .on('click', tip.show)
             .on("mouseover", function(d, i){
                 selectedCountry = d[keyArray[11]];
                 updatePath();
                 updateBar();
             })
             .on('mouseout', tip.hide)
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
						return "#BAB09E";
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
        
         function drawAnotherHist(points, year){
            for(var i = 0; i < points.length; i++){
                countryArray[i] = points[i][keyArray[11]];
            }
            document.getElementsByTagName("h3")[0].innerHTML = keyArray[11] + " of the year " + year;
            console.log(year);
            //console.log(points);
            svg2 = d3.select(".svg2-container svg");
             axis = d3.svg.axis()
                .orient("left")
                .scale(scale)
                svg2.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(60, 0)")
                .call(axis);


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
                
            var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10,0])
           .html(function(d) {
                    
                    return "<strong>Country:</strong> <span style='color:red'>" + d[keyArray[11]] + "</span>";
                    
                })   
            svg2.call(tip);  
        
            bars = svg2.selectAll("rect")
            .data(points)
            .enter()
            .append("g")
            .attr("class", "bar");
            
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
             .on('click', tip.show)
             .on("mouseover", function(d, i){
                 selectedCountry = d[keyArray[11]];
                 updateBar();
                 updatePath();
             })
             .on('mouseout', tip.hide)
             
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
        function updateBar(){
             svg2.selectAll("rect")
                .transition().duration(200)
                .attr({
                    fill: function(d){
					if(d[keyArray[11]] == selectedCountry){
						return "#FF0000";
					}else{
						return "#BAB09E";
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
        /*function loadSelection(){
            var row = [];
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
                    dataset2 = points;
                    keyArray2 = d3.keys(points[0]);
                    //console.log(dataset2);
                    dataset2.forEach (function(d){
                        //console.log(d[keyArray[11]]);
                        if(d[keyArray2[11]] == selectedCountry){
                            row = d;
                            console.log(row);
                        }else{
                            console.log("didnt found")
                        }
                    });
                    //dataset = [points[0]];
					//initialize svg element
                     drawHistogram(row);
                     
                }
            });
           
        }
        function drawHistogram(row){
            var svg2 = svg = d3.select("body").append("svg");
            //call functions that draws the scale and draw all pathes that represent the data points
            axis = d3.svg.axis()
                .orient("left")
                .scale(scale)
                svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(100, 0)")
                .call(axis);
                console.log(keyArray2);
            for(var i = 1; i < keyArray2.length-1; i++){
                svg.append("text")
                .attr({
                    x: 90 + i *100,
                    y: 680,
                    class:"filter_label"
                })
                .text(keyArray2[i])
                //console.log(keyArray2);
            }
            var bars = svg2.selectAll(".bar")
            .data(row)
            .enter()
            .append("g")
            .attr("class", "bar");
            
            bars.append("rect")
            .attr("x", function(d){
                return 200;
            })
            .attr("y", 200)
            .attr("width",100)
            .attr("height", function(d){ 
                return 100;
            });
            /*for(var i = 0; i < keyArray.length; i++){
                if(dataset2[i][keyArray[11]] == selectedCountry){
                    console.log(dataset2[i]);
                }
            }*/
        
        
       