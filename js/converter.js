
var amount = $('#amountInput').val();
var rows = 2;
var cols = 2; // not include head line
var colCurrencies = ["USD","HKD"];
var rowCurrencies = ["USD","HKD"];
var rowToIndex = {
	"USD":1,
	"HKD":2
}

var colToIndex = {
	"USD":1,
	"HKD":2
}
var rowRates = {}

const prefix = 'https://api.exchangeratesapi.io/latest?base=';
var tableHTML = document.getElementById("maintablebody");
//http://exchangeratesapi.io/

refresh();

function refresh() {
	
    
    for (var i = 0; i < rows; i++ ) {

    	var url = prefix + rowCurrencies[i];
    	fetch(url, {
	        method: 'get'
	    })
	    .then(response => response.json())
	    .then(jsonData => {
	    	var baseCurrency = jsonData.base;
	    	rowRates[baseCurrency] = jsonData;
			for (var k = 0; k < cols; k++) {
				tableHTML.children[rowToIndex[baseCurrency]].children[colToIndex[colCurrencies[k]]].textContent = (jsonData.rates[colCurrencies[k]] * amount).toFixed(2).toString();
				//console.log(baseCurrency + " " + colCurrencies[k] + " " +jsonData.rates[colCurrencies[k]]  );
			}
	    })
	    .catch(error => console.error(error));
    }

    //jsonRes.rates[]
}

function fetchFromBase(base) {
	var url = 'https://api.exchangeratesapi.io/latest?base=' + base;
	var jsonRes = '';
	fetch(url, {
        method: 'get'
    })
    .then(response => response.json())
    .then(jsonData => jsonRes = jsonData)
    .catch(error => console.error(error));
    var table = document.getElementById("maintablebody");
    for (var i = 0; i < rows; i++) {
    	for (var j = 0; j < cols; j++) {

    	}
    }
    //jsonRes.rates[]

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

		var url = prefix + input;
		fetch(url, {
	        method: 'get'
	    })
	    .then(response => response.json())
	    .then(jsonData => {
	    	var baseCurrency = jsonData.base;
	    	rowRates[baseCurrency] = jsonData;
	    	var temp = '<tr><td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input+'</td>';
			for (var k = 0; k < cols; k++) {
				temp += '<td>' + (jsonData.rates[colCurrencies[k]] * amount).toFixed(2).toString() + '</td>';
			}
			temp += '</tr>';
			tableHTML.innerHTML += temp;
	    	
	    })
	    .catch(error => console.error(error));
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

    	tableChildren[0].innerHTML += '<td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input + '</td>'; // head line
		for (var k = 0; k < rows; k++) {
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

		var url = prefix + input;
		fetch(url, {
	        method: 'get'
	    })
	    .then(response => response.json())
	    .then(jsonData => {
	    	var baseCurrency = jsonData.base;
	    	rowRates[baseCurrency] = jsonData;
	    	var temp = '<tr><td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input + '</td>';
			for (var k = 0; k < cols; k++) {
				temp += '<td>' + (jsonData.rates[colCurrencies[k]] * amount).toFixed(2).toString() + '</td>';
			}
			temp += '</tr>';
			tableHTML.innerHTML += temp;

			cols += 1;
			colCurrencies.push(input);
			colToIndex[input] = cols;

			var tableChildren = tableHTML.children;
	    	tableChildren[0].innerHTML += '<td><img height="25" width="25" src="css/flags/' + input + '.svg">' + input + '</td>'; // head line
			for (var k = 0; k < rows; k++) {
				tableChildren[k+1].innerHTML += '<td>' + (rowRates[rowCurrencies[k]].rates[input] * amount).toFixed(2).toString() +'</td>';
			}
	    	
	    })
	    .catch(error => console.error(error));
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
    console.log(input);
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
