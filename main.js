/*
* Author: Patrick
* Description: javascript implementation for index.html
*/


 

// // Measure execution time
// // Declare variables
// var end, start;
// // Assign a new date object to the start variable
// // at the beggining of the block you wish to measure
// start = new Date();

// // Date object
// var realTime = new Date();
// realTime = realTime.toDateString();
// console.log(realTime);

// // Assign a new date object to the end variable
// // at the end of the block you wish to measure
// end = new Date();
// // Display message
// // console.log((end.getTime() - start.getTime()) + " msec");
// var executionTime = (end.getTime() - start.getTime()) + " milliseconds!";
// console.log(executionTime); //



/**
 * 
 * @returns the time in milliseconds the function was called
 */
function getTime() {
    let time = new Date();
    return time.getTime();
}

function operationTime(endTime, startTime) {
    operationTime = (endTime - startTime) + " msec";
    console.log(operationTime);
}  

// Variables
const cryptoListURL = "https://api.coingecko.com/api/v3/coins/list";
// var coinsList = document.getElementById("coins-list");

// when the page loads
window.addEventListener("load", check());

function check() {
    alert("LOADED");
}

// retruebve the list of coins from the API
async function getCoinsList() {
            let response = await fetch(cryptoListURL);
            if (response.ok) {
                let json = await response.json();
                alert("HTTP-Status: " + response.status);
            } else {
                alert(`HTTP-Error: {response.status}`);
            }
            return response;
        }

// add coins to drop down list
function updateCryptoList() {    
    var coinsList = document.getElementById("coins-list");
        for (var x = 0; x < 9; x++) {
            let option = document.createElement("option");
            option.textContent = x;
            coinsList.appendChild(option);            
        }
}

function createOption(text) {
    let option = document.createElement("option");
    option.textContent = text;
    return option;
}  
let end = getTime();
operationTime(end, start);
