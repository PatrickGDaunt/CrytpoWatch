/*
* Author: Patrick
* Description: javascript implementation for index.html
*/



var start = getTime();

/**
 * Testing functions
 * @returns the time in milliseconds the function was called
 */
function getTime() {
    let time = new Date();
    return time.getTime();
}

function operationTime(endTime, startTime) {
    operationTime = (endTime - startTime) + " msec";
    alert(operationTime);
} 

function check() {
    alert("javascript loaded");
}

// Variables
const cryptoListURL = "https://api.coingecko.com/api/v3/coins/list";
const currencyListURL = "https://api.coingecko.com/api/v3/simple/supported_vs_currencies";
const coinPriceURL = "https://api.coingecko.com/api/v3/simple/price";

const coinsList = document.getElementById("coins-list");
const currencyList = document.getElementById("currencies-list");
const coinID = document.getElementById("coin");
const vsCurrencyID = document.getElementById("vs-currency");
const valueID = document.getElementById("value");

// when the page loads
window.addEventListener("DOMContentLoaded", updateCryptoList());
window.addEventListener("DOMContentLoaded", updateCurrencyList());

// var end = getTime();
// operationTime(end, start);

// retrieve the list of coins from the API
async function getCoinsList() {
    let response = await fetch(cryptoListURL);
    //     .then(response => response.json());
    // return response; 
    if (response.status == 200) {
        let data = await response.json();
        return data;
    }
    else {
        alert(`Error fetching API\nStatus: ${response.status}\n${response.statusText}`);
    } 
}

/*
 * Iterate through response and add crypto id to list
 */
function updateCryptoList() {
    getCoinsList().then(function(data){
        for (var num = 0; num < data.length; num++){
            let option = createOption(data[num].id);
            coinsList.appendChild(option);
        }                 
    });
}

/**
 * retrieve the list of currencies used by the API
 * @returns response.json() of currencyListURL
 */
async function getCurrencyList() {
    try {
        var response = await fetch(currencyListURL); 
    } catch (error) {
        alert(error);

    }    
    if (response.status == 200) {
        let data = await response.json();
        return data;
    }
    else {
        alert(`Error fetching API\nStatus: ${response.status}\n${response.statusText}`);
    }  
}

// Add currencies to currenciesList
function updateCurrencyList() {
    getCurrencyList().then(function(data) {
        for (var num = 0; num < data.length; num++){
            let option = createOption(data[num]);
            currencyList.appendChild(option);
        }
    });
}

/**
 * creates an element from arguement
 * @param {*} text 
 * @returns option
 */
function createOption(text) {
    let option = document.createElement("option");
    option.textContent = text;
    return option;
} 

/**
 * fetches price
 * @param {*} coin 
 * @param {*} currency 
 * @returns data
 */
async function getPrice(coin, currency) { 
    try {
        alert("API price loading");
        let URL = coinPriceURL + `?ids=${coin}&vs_currencies=${currency}`;
        var response = await fetch(URL);
        var data = await response.json();
        return data;     
    } catch (error) {
        alert(error);
    }
    if (response.status != 200) {
        alert(`Error fetching API\nStatus: ${response.status}\n${response.statusText}`);
    }  
}

/**
 * Displays price values from the fetch
 * @param {*} coin 
 * @param {*} currency 
 */
function displayPrice(coin="bitcoin", currency="cad") { 
    let value = getPrice(coin, currency).then(data =>{
        let value = data[coin][currency];
        coinID.textContent = coin;
        vsCurrencyID.textContent = currency;
        valueID.textContent = value;       
    });        
}

/**
 * passes #coins-list and #currencies-list and displays values via an alert method 
 */
 async function acceptValues() {
    let coin = document.getElementById("coins-list").value;
    let currency = document.getElementById("currencies-list").value;
    // alert(`Cryptocurrency: ${coin}, Currency: ${currency}`);
    displayPrice(coin, currency);
}
