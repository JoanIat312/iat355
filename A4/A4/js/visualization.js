var pathes;
var keyArray = [];
var axisArray = [];
var svg;
var scale;
var dataset = [];
var selectedCountry;
//load dataset from web
	d3.csv("http://www.sfu.ca/~yitingl/data/national.csv")
		.row(function(d){
			return d;
		})
		.get(function(error, points){
			if(error){
				console.error("Error occured while reading file. " + error);
			}else{
				dataset = points;
				//dataset = [points[0]];
				console.log(dataset);
				svg = d3.select("svg");
				visualization();
				drawScale(svg, dataset);
				drawPath(dataset);
  
			}
		});//end of row
		
		function visualization(){
			
		}
		
		function drawScale(svg, points){
			keyArray = d3.keys(points[0]);
			document.getElementsByTagName("h2")[0].innerHTML = keyArray[11];
			console.log(keyArray);
            
            scale = d3.scale.linear()
				.domain([100, 0])
				.range([650, 50]);
            var axis = d3.svg.axis()
				.orient("left")
				.scale(scale)
				svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + (100) + ", 0)")
				.call(axis);
                var max, min;
			for(var i = 1; i < keyArray.length-1; i++){
				 max = d3.max(points, function(d){
						return +d[keyArray[i]];
					});
                   min = d3.min(points, function(d){
						return +d[keyArray[i]];
					});
                    console.log(min, max);
				
				svg.append("line")
				.attr({
                    x1:100 + i * 100,
                    y1:50,
                    x2:100 + i * 100,
                    y2:650,
                    "stroke-width": 2,
                    stroke:"#5184AF",
                    "stroke-linecap":"round",
                    "stroke-dasharray":"1, 10"
                });
				
				svg.append("text")
				.attr({
					x: 90 + i *100,
					y: 670,
					class:"filter_label"
				})
				.text(keyArray[i])
			}
			
		}
		
		function drawPath(points){
			var str = "";
			pathes = svg.selectAll("path")
			.data(points)
			.enter()
			.append("path")
			.attr({
				d:function(d, i){
                      
					str = "M100 " + scale(d[keyArray[0]]);
					for(var i = 1; i < keyArray.length-1; i++){
                        if(+d[keyArray[i]] >= 0){
						  str += " L" + (100+(i)*100) + " " + scale(+d[keyArray[i]]);
                        } else{
                            console.log("missing data from country " + d[keyArray[11]] + 
                            "in the year " + keyArray[i]);
                        }
					}
					return str;
				}
			})
			.on("mouseover", function(d,i){
				selectedCountry = d[keyArray[11]];
				drawPath(points);
			})
			svg.selectAll("path").attr({
				stroke: function(d){
					if(d[keyArray[11]] == selectedCountry){
						return "#FF0000";
					}else{
						return "#000";
					}
				},
				"stroke-opacity":function(d){
					if(d[keyArray[11]] == selectedCountry){
						return "2";
					}else{
						return "0.4";
					}
				},
				"stroke-width":function(d){
					if(d[keyArray[11]] == selectedCountry){
						return "2";
					}else{
						return "1";
					}
				}
			})
            
			
		}
		
		function showValue(d){
		  d3.select("#output").text(JSON.stringify(d));
		  console.log(d);
		}