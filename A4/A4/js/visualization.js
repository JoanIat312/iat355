var pathes;
var keyArray = [];
var axisArray = [];
var svg;
var scale;
var dataset = [];
var selectedCountry;
var url;
//load dataset from web

		function loadData(selection){
            if(selection == "national"){
                url = "http://www.sfu.ca/~yitingl/data/national.csv";
            }else if(selection == "urban"){
                url = "http://www.sfu.ca/~yitingl/data/urban.csv";
            }else if(selection == "rural"){
                url = "http://www.sfu.ca/~yitingl/data/rural.csv";
            }
            
			d3.csv(url)
            .row(function(d){
			return d;
            })
            .get(function(error, points){
                if(error){
                    console.error("Error occured while reading file. " + error);
                }else{
                    alert(selection + " data loaded");
                    dataset = points;
                    //dataset = [points[0]];
                    svg = d3.select("svg");
                    drawScale(svg, dataset);
                    drawPath(dataset);
    
                }
            });//end of row
		}
        
		
		function drawScale(svg, points){
			keyArray = d3.keys(points[0]);
			document.getElementsByTagName("h2")[0].innerHTML = keyArray[11];
            
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
			for(var i = 1; i < keyArray.length-1; i++){
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
				},
                stroke:"black",
                "stroke-opacity":0.04,
                "stroke-width":1
			})
			.on("mouseover", function(d,i){
				selectedCountry = d[keyArray[11]];
				updatePath();
			})
            
            svg.selectAll("path")
            .data(points)
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
				},
                stroke:"black",
                "stroke-opacity":0.04,
                "stroke-width":1
			})
			
		}
        function updatePath(){
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