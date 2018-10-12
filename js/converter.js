//http://exchangeratesapi.io/
//window.localStorage.clear();
var amount = $('#amountInput').val();
var rows = 2;
var cols = 2; // not include head line
var colCurrencies = ["CNY","HKD"];
var rowCurrencies = ["CNY","HKD"];
var rowToIndex = {
	"CNY":1,
	"HKD":2
}

var colToIndex = {
	"CNY":1,
	"HKD":2
}
var rowRates = {}
var localStorage;

const prefix = 'https://api.exchangeratesapi.io/latest?base=';
const ONE_HOUR = 1000 * 60 * 60; //mili second

var tableHTML = document.getElementById("maintablebody");

if(window.localStorage == undefined){
    alert("Broser does not support localstorage, you cannot use this website");
}else{
	localStorage = window.localStorage;
}
var now = new Date();
var nowms = now.getTime();
var needUpdate = false;

localStorage["time"] = nowms;

if (nowms - Number(localStorage["time"]) < ONE_HOUR ) {
	needUpdate = false;
	//rowRates = JSON.parse(JSON.stringify(localStorage));
} else {
	needUpdate = true;
}


refresh();

function refresh() {
    for (var i = 0; i < rows; i++ ) {
    	var baseCurrency = rowCurrencies[i];
    	if (needUpdate || localStorage[baseCurrency] == undefined ) {
    		var url = prefix + rowCurrencies[i];
	    	fetch(url, {
		        method: 'get'
		    })
		    .then(response => response.json())
		    .then(jsonData => {
		    	var baseCurrency = jsonData.base;
		    	rowRates[baseCurrency] = jsonData;
		    	localStorage[baseCurrency] = JSON.stringify(jsonData);
				for (var k = 0; k < cols; k++) {
					tableHTML.children[rowToIndex[baseCurrency]].children[colToIndex[colCurrencies[k]]].textContent = (jsonData.rates[colCurrencies[k]] * amount).toFixed(2).toString();
				}
		    })
		    .catch(error => {
		    	console.error(error)
		    	refresh();

		    });
    	} else {
    		for (var k = 0; k < cols; k++) {
    			if(rowRates[baseCurrency] == undefined){
    				rowRates[baseCurrency] = JSON.parse(localStorage[baseCurrency]);	
    			}
				tableHTML.children[rowToIndex[baseCurrency]].children[colToIndex[colCurrencies[k]]].textContent = (rowRates[baseCurrency].rates[colCurrencies[k]] * amount).toFixed(2).toString();
			}
    	}
    	
    }

}

function addRow(input) {
	if (input.length > 5) {
		alert("Please select one country");
	}else if(rowToIndex[input] != undefined) {
		alert("Already exists in rows");
	} else {
		rows += 1;
		console.log("add row clicked: " + input);
		rowCurrencies.push(input);
		rowToIndex[input] = rows;

		if (needUpdate || localStorage[input] == undefined) { // or this json is not in localStorage
			var url = prefix + input;
			fetch(url, {
		        method: 'get'
		    })
		    .then(response => response.json())
		    .then(jsonData => {
		    	var baseCurrency = jsonData.base;
		    	rowRates[baseCurrency] = jsonData;
		    	localStorage[baseCurrency] = JSON.stringify(jsonData);
		    	// row head line:
		    	var temp = '<tr><td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input + '<button class="close hoverButton" onclick="deleteRow(' + rows + ')">x</button></td>';
				for (var k = 0; k < cols; k++) {
					temp += '<td>' + (jsonData.rates[colCurrencies[k]] * amount).toFixed(2).toString() + '</td>';
				}
				temp += '</tr>';
				tableHTML.innerHTML += temp;
		    	
		    })
		    .catch(error => console.error(error));
		} else {
			var baseCurrency = input;
			var temp = '<tr><td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input + '<button class="close hoverButton" onclick="deleteRow(' + rows + ')">x</button></td>';
			for (var k = 0; k < cols; k++) {
				if(rowRates[baseCurrency] == undefined){
    				rowRates[baseCurrency] = JSON.parse(localStorage[baseCurrency]);	
    			}
				temp += '<td>' + (rowRates[baseCurrency].rates[colCurrencies[k]] * amount).toFixed(2).toString() + '</td>';
			}
			temp += '</tr>';
			tableHTML.innerHTML += temp;
		}
	}
}

function addCol(input) {
	if (input.length > 5) {
		alert("Please select one country");
	}else if(colToIndex[input] != undefined) {
		alert("Already exists in columns");
	} else {
		cols += 1;
		console.log("add col clicked: " + input);
		colCurrencies.push(input);
		colToIndex[input] = cols;
		var tableChildren = tableHTML.children;
		// col head line:
    	tableChildren[0].innerHTML += '<td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input +'<button class="close hoverButton" onclick="deleteCol(' + cols + ')">x</button></td>'; // head line
		for (var k = 0; k < rows; k++) {
			if(rowRates[rowCurrencies[k]] == undefined){
    				rowRates[rowCurrencies[k]] = JSON.parse(localStorage[rowCurrencies[k]]);	
    		}
			tableChildren[k+1].innerHTML += '<td>' + (rowRates[rowCurrencies[k]].rates[input] * amount).toFixed(2).toString() +'</td>';
		}
	}
}

function addRowCol(input) {
	if (input.length > 5) {
		alert("Please select one country");
	}else if(colToIndex[input] != undefined) {
		alert("Already exists in columns");
	} else if(rowToIndex[input] != undefined) {
		alert("Already exists in rows");
	} else {
		rows += 1;
		console.log("add row clicked: " + input);
		rowCurrencies.push(input);
		rowToIndex[input] = rows;

		if (needUpdate || localStorage[input]  == undefined ) { // or this json is not in localStorage
			var url = prefix + input;
			fetch(url, {
		        method: 'get'
		    })
		    .then(response => response.json())
		    .then(jsonData => {
		    	var baseCurrency = jsonData.base;
		    	rowRates[baseCurrency] = jsonData;
		    	localStorage[baseCurrency] = JSON.stringify(jsonData);
		    	// row head line
		    	var temp = '<tr><td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input + '<button class="close hoverButton" onclick="deleteRow(' + rows + ')">x</button></td>';
				for (var k = 0; k < cols; k++) {
					temp += '<td>' + (jsonData.rates[colCurrencies[k]] * amount).toFixed(2).toString() + '</td>';
				}
				temp += '</tr>';
				tableHTML.innerHTML += temp;

				cols += 1;
				colCurrencies.push(input);
				colToIndex[input] = cols;

				var tableChildren = tableHTML.children;
				//col head line
		    	tableChildren[0].innerHTML += '<td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input +'<button class="close hoverButton" onclick="deleteCol(' + cols + ')">x</button></td>'; // head line
				for (var k = 0; k < rows; k++) {
					if(rowRates[rowCurrencies[k]] == undefined) {
						rowRates[rowCurrencies[k]] = JSON.parse(localStorage[rowCurrencies[k]]);
					}
					tableChildren[k+1].innerHTML += '<td>' + (rowRates[rowCurrencies[k]].rates[input] * amount).toFixed(2).toString() +'</td>';
				}
		    	
		    })
		    .catch(error => console.error(error));
		} else {
			var baseCurrency = input;
			// row head line
	    	var temp = '<tr><td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input + '<button class="close hoverButton" onclick="deleteRow(' + rows + ')">x</button></td>';
			for (var k = 0; k < cols; k++) {
				if(rowRates[baseCurrency] == undefined) {
						rowRates[baseCurrency] = JSON.parse(localStorage[baseCurrency]);
					}
				temp += '<td>' + (rowRates[baseCurrency].rates[colCurrencies[k]] * amount).toFixed(2).toString() + '</td>';
			}
			temp += '</tr>';
			tableHTML.innerHTML += temp;

			cols += 1;
			colCurrencies.push(input);
			colToIndex[input] = cols;

			var tableChildren = tableHTML.children;
			// col head line
	    	tableChildren[0].innerHTML += '<td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input +'<button class="close hoverButton" onclick="deleteCol(' + cols + ')">x</button></td>'; // head line
			for (var k = 0; k < rows; k++) {
				tableChildren[k+1].innerHTML += '<td>' + (rowRates[rowCurrencies[k]].rates[input] * amount).toFixed(2).toString() +'</td>';
			}
		}
	}
}

function OKClick(input) {
    var tableHTML = document.getElementById("maintablebody");
	console.log("input is " + input);
	for (var i = 0; i < rows; i++ ) {
		for (var j = 0; j < cols; j++){
			tableHTML.children[i+1].children[j+1].textContent = (Number(tableHTML.children[i+1].children[j+1].textContent)/Number(amount)*Number(input)).toFixed(2);
		}
		
	}
	amount = input;

}

function countryClick(input) {
    //console.log(input);
    document.getElementById("selectCountry").innerHTML = '<img height="25" width="25" src="css/flags/' + input + '.svg">' + input;
}

function dropdownFunc() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function interChangeCountry() {
	var country1 = document.getElementById("selectCountry1").innerHTML;
	document.getElementById("selectCountry1").innerHTML = document.getElementById("selectCountry2").innerHTML;
	document.getElementById("selectCountry2").innerHTML = country1;

}

//
function deleteRow(index) {
	var children = tableHTML.children;
	tableHTML.removeChild(children[index]);
	delete rowToIndex[rowCurrencies[index]];
	rowCurrencies.splice(index,1);
	rows -= 1;

}

function deleteCol(index) {
	var children = tableHTML.children;
	for(var i = 0; i <= rows; i++) {
		children[i].removeChild(children[i].children[index]);
	}
	delete colToIndex[colCurrencies[index]];
	colCurrencies.splice(index,1);
	cols -= 1;
}
//************************************ Chart ***************************************
		var json;
		var canvas = document.getElementById('canvas'),
			context = canvas.getContext('2d'),
			width = canvas.width = 800,
			height = canvas.height = 400;
		var data = {}; // 1 2 3 4 5, 8 9 10...
		var dataIndex = {}; // 1 2 3 4 5 6 7 8 9 ...
		var maxY=0 ,minY=999999, diff=0;
		var bgColor = "#ffffe0", lineColor = "#082567", dotColor="#b8a1cf", highlightColor="#ff8033", axisColor = "#000000" ;
	
	function drawChartOKclicked(xCountry, yCountry, year, month) {
		
		maxY=0 ,minY=999999, diff=0;
		context.clearRect(0, 0, canvas.width, canvas.height);
		var nextMonth = year + "-" + (Number(month)+1) + "-";
		var month = year + "-" + month + "-";
		
		
		//https://api.exchangeratesapi.io/history?start_at=2018-08-01&end_at=2018-09-01&symbols=ILS&base=USD
		json = {"end_at":"2018-09-01","start_at":"2018-08-01","rates":{"2018-08-21":{"JPY":127.01,"CNY":7.8748},"2018-08-06":{"JPY":128.68,"CNY":7.9066},"2018-08-02":{"JPY":129.43,"CNY":7.9518},"2018-08-14":{"JPY":126.42,"CNY":7.8488},"2018-08-30":{"JPY":130.32,"CNY":7.9887},"2018-08-07":{"JPY":128.88,"CNY":7.9171},"2018-08-24":{"JPY":128.97,"CNY":7.9326},"2018-08-16":{"JPY":126.02,"CNY":7.8396},"2018-08-23":{"JPY":128.31,"CNY":7.9643},"2018-08-15":{"JPY":125.67,"CNY":7.8298},"2018-08-01":{"JPY":130.81,"CNY":7.9519},"2018-08-13":{"JPY":126.11,"CNY":7.8537},"2018-08-22":{"JPY":128.08,"CNY":7.947},"2018-08-03":{"JPY":129.3,"CNY":7.9195},"2018-08-27":{"JPY":129.16,"CNY":7.9396},"2018-08-29":{"JPY":129.73,"CNY":7.9626},"2018-08-20":{"JPY":126.25,"CNY":7.8351},"2018-08-17":{"JPY":125.75,"CNY":7.842},"2018-08-08":{"JPY":128.72,"CNY":7.9231},"2018-08-09":{"JPY":128.84,"CNY":7.9053},"2018-08-10":{"JPY":127.07,"CNY":7.8468},"2018-08-31":{"JPY":129.05,"CNY":7.9664},"2018-08-28":{"JPY":130.03,"CNY":7.9641}},"base":"EUR"}
		

		

		var url = "https://api.exchangeratesapi.io/history?start_at=" + month +"01&end_at=" + nextMonth + "01&symbols=" + yCountry +"&base=" + xCountry;
		fetch(url, {
		    method: 'GET',
		  })
		  .then((response) => response.json())
		  .then((responseJson) => {
		  	json = responseJson;
		    chartAfterJson();
		  });
	function chartAfterJson() {
		drawChart();

		function drawChart() {
			for(var a=1; a <= 9; a++) {
				if(json["rates"][month+"0"+a.toString()]== undefined){
					data[a] = undefined;
				}else{

					data[a] = json["rates"][month+"0"+a.toString()][yCountry];
					if(Number(data[a])>maxY) {
						maxY=Number(data[a]);
					}
					if(Number(data[a])<minY) {
						minY=Number(data[a]);
					}
				}
			}
			
			for(var a=10; a <= 30; a++) {
				if(json["rates"][month+a.toString()]== undefined){
					data[a] = undefined;
				}else{
					data[a] = json["rates"][month+a.toString()][yCountry];
					if(Number(data[a])>maxY) {
						maxY=Number(data[a]);
					}
					if(Number(data[a])<minY) {
						minY=Number(data[a]);
					}
				}
			}
			// maxY = Math.ceil(maxY);

			context.fillStyle = bgColor;
			context.fillRect(0, 0, width, height);

			//draw coordinate axis
			context.lineWidth="3";
			context.strokeStyle="black";
			context.beginPath();
			context.moveTo(100, 25);
			context.lineTo(100, 375);
			context.lineTo(750, 375);
			context.stroke();

			//draw origin
			context.font = "15px Arial";
			context.fillStyle = axisColor;
			context.fillText("0",80,380);

			// var i=1
			// for(; i<=30; i++) { // draw x coordinate
			// 	context.fillText(i.toString(),85+20*i,390);
			// 	context.beginPath();
			// 	context.moveTo(90+20*i, 375);
			// 	context.lineTo(90+20*i, 370);
			// 	context.stroke();
			// }

			// draw y
			var precision = 4;
			if(maxY > 100) {
				precision = 2;
			} else if (maxY > 10) {
				precision = 3;
			} else {
				precision = 4;
			}
			var unit = (maxY-minY) / 10;
			for(var j=0; j<=10; j++) { 
				context.fillText((j*unit+minY).toFixed(precision).toString(),50,360-j*30);
				context.beginPath();
				context.moveTo(100, 355-j*30);
				context.lineTo(105, 355-j*30);
				context.stroke();
			}

			//X Y label
			context.fillText(xCountry,85+20*32,390);
			context.fillText(yCountry,60,30);

			

			var left = 100;
			var prev_stat = -1;
			var move_left_by = 20;
			
			diff = maxY - minY;
			var day = 1;
			for(var i=1; i<=31; i++) {
				if(data[i] != undefined) {
					the_stat = data[i];
					dataIndex[day] = the_stat;
				
					// draw X coordinate
					context.strokeStyle = axisColor;
					context.fillText(i.toString(),95+20*day,390);
					context.beginPath();
					context.moveTo(100+20*day, 375);
					context.lineTo(100+20*day, 370);
					context.stroke();

					// draw data
					if(prev_stat > 0) {
						context.strokeStyle = lineColor;
						
	 					context.beginPath();
						context.moveTo(left, 355-(prev_stat-minY)/diff*300);
						context.lineTo(left+move_left_by, 355-(the_stat-minY)/diff*300);
						context.lineWidth = 3;
						context.stroke();

						//draw dot
						context.beginPath();
						context.arc(left, 355-(prev_stat-minY)/diff*300, 2, 0, 2 * Math.PI, false);
						context.strokeStyle = dotColor;
						context.stroke();
					}
					prev_stat = the_stat;
					left += move_left_by;
					day += 1;
				}
			}
			//draw last dot
			context.beginPath();
			context.arc(left, 355-(prev_stat-minY)/diff*300, 2, 0, 2 * Math.PI, false);
			context.strokeStyle = dotColor;
			context.stroke();
			//write the last day rate to showData
			document.getElementById("showData").textContent = dataIndex[day-1].toFixed(4);

      }



      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
     
      var prev_whichPoint = -1;
      canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        var whichPoint = Math.round((mousePos.x-120) / 20) + 1;
        if(prev_whichPoint!=whichPoint && dataIndex[whichPoint] != undefined) {
        	if(dataIndex[whichPoint] != undefined) {
        		document.getElementById("showData").textContent = dataIndex[whichPoint].toFixed(4);
        	}
	        drawChart();

	        //draw highlight
	        context.beginPath();
			context.arc(whichPoint*20+100, 355-(dataIndex[whichPoint]-minY)/diff*300, 3, 0, 2 * Math.PI, false);
			context.strokeStyle = highlightColor;
			context.stroke();
	        //console.log(whichPoint + ": " +(whichPoint*20+80) + ", " +(355-(dataIndex[whichPoint]-minY)/diff*300));
	        prev_whichPoint = whichPoint;
    	}
      }, false);
  }
} // drawChartOKclicked bracket
     function chartOK() {
     	var country1 = $('#selectCountry1').text();
     	var country2 = $('#selectCountry2').text();
     	var year = document.getElementById('selectYear').value;
     	var month = document.getElementById('selectMonth').value;
     	if(country1.length>5) {
     		alert("Please select one base country");
     	} else if(country2.length>5) {
     		alert("Please select one target country");
     	} else if(year.length>5) {
     		alert("Please select year");
     	} else if(month.length>5) {
     		alert("Please select month");
     	} else if(country1==country2) {
     		alert("Please select different countries");
     	} else {
     		document.getElementById('showCountry1').textContent = " 1" + country1 + " = ";
     		document.getElementById('showCountry2').textContent = country2;
     		console.log('chartOK clicked');
     		drawChartOKclicked(country1,country2,year, month);	
     	}
     }
   

   //**********************
   function countryClick1(input) {
    console.log(input);
    document.getElementById("selectCountry1").innerHTML = '<img height="25" width="25" src="css/flags/' + input + '.svg">' + input;
	}
	function countryClick2(input) {
    console.log(input);
    document.getElementById("selectCountry2").innerHTML = '<img height="25" width="25" src="css/flags/' + input + '.svg">' + input;
	}
