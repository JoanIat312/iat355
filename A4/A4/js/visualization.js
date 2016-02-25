var pathes;
var keyArray = [];
var axisArray = [];
var svg;
var scale;
var dataset = [];
var selectedCountry;
//load dataset from web
	d3.csv("http://www.sfu.ca/~yitingl/data2.csv")
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
			for(var i = 0; i < keyArray.length-1; i++){
				
				scale = d3.scale.linear()
				.domain([100, 0])
				.range([650, 50]);
				
				axisArray[i] = d3.svg.axis()
				.orient("left")
				.scale(scale)
				svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + (100 + i*120) + ", 0)")
				.call(axisArray[i]);
				
				svg.append("text")
				.attr({
					x: 90 + i *120,
					y: 670,
					class:"filter_label"
				})
				.text(keyArray[i])
				
				//---------------------------//
				/*
				var minCountry2010 = d3.min(points, function(d){
					return +d[keyArray[2]];
				});
				var maxCountry2010 = d3.max(points, function(d){
					return +d[keyArray[2]];
				});
				
				country2010Scale = d3.scale.linear()
				.domain([minCountry2010, maxCountry2010])
				.range([20, 1350]);
				
				country2010Axis = d3.svg.axis()
				.scale(country2010Scale)
				svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0, 300)")
				.call(country2010Axis);
				
				svg.append("text")
				.attr({
					x:20,
					y:330,
					class:"filter_label"
				})
				.text("Country total for year 2010")
				//-----------------------//
				
				var minUrban2000 = d3.min(points, function(d){
					return +d[keyArray[3]];
				});
				var maxUrban2000 = d3.max(points, function(d){
					return +d[keyArray[3]];
				});
				
				urban2000Scale = d3.scale.linear()
				.domain([minUrban2000, maxUrban2000])
				.range([20, 1350]);
				
				urban2000Axis = d3.svg.axis()
				.scale(urban2000Scale)
				svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0, 360)")
				.call(urban2000Axis);
				
				svg.append("text")
				.attr({
					x:20,
					y:350,
					class:"filter_label"
				})
				.text("Urban total for year 2000")
				
				//---------------------------------------//
				
				var minUrban2010 = d3.min(points, function(d){
					return +d[keyArray[4]];
				});
				var maxUrban2010 = d3.max(points, function(d){
					return +d[keyArray[4]];
				});
				
				urban2010Scale = d3.scale.linear()
				.domain([minUrban2010, maxUrban2010])
				.range([20, 1350]);
				
				urban2010Axis = d3.svg.axis()
				.scale(country2010Scale)
				svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0, 660)")
				.call(country2010Axis);
				
				svg.append("text")
				.attr({
					x:20,
					y:690,
					class:"filter_label"
				})
				.text("Urban total for year 2010")
			}*/
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
					for(var i = 1; i < axisArray.length; i++){
						str += " L" + (100+(i)*120) + " " + scale(+d[keyArray[i]]); 
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
						return "1";
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