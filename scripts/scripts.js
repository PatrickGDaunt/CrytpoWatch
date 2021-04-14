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
// const marketChartURL = "https://api.coingecko.com/api/v3/coins/";

const coinsList = document.getElementById("coins-list");
const currencyList = document.getElementById("currencies-list");
const coinID = document.getElementById("coin");
const vsCurrencyID = document.getElementById("vs-currency");
const valueID = document.getElementById("value");
// const marketChartID = document.getElementById("market-chart");

// when the page loads
window.addEventListener("DOMContentLoaded", updateCryptoList());
window.addEventListener("DOMContentLoaded", updateCurrencyList());

// var end = getTime();
// operationTime(end, start);


/**
 * fetch coingecko, the list of coins available
 * @returns data - .json() from fetch url
 */
async function getCoinsList() {
    let response = await fetch(cryptoListURL);
    if (response.status == 200) {
        let data = await response.json();
        return data;
    }
    else {
        alert(`Error fetching API\nStatus: ${response.status}\n${response.statusText}`);
    } 
}

/*
 * Iterate through response.json() and append coin id to list
 */
function updateCryptoList() {
    getCoinsList().then(data => {
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
 * @returns data - returns the market price per coin relative to the currency
 */
async function getPrice(coin, currency) { 
    try {
        let URL = coinPriceURL + `?ids=${coin}&vs_currencies=${currency}`;
        var response = await fetch(URL);
        if (response.status==200){
            var data = await response.json();
            return data;
        }   
    } catch (error) {
        alert(`${error}\nError fetching API\nStatus: ${response.status}\n${response.statusText}`);
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
 * Fetch data from API historical data
 * specify up to the last 30 days and
 * time intervals of: minutely, hourly, daily 
 * @param {*} coin
 * @param {*} currency
 * @returns: data.json()
 */
async function getMarketChart(coin, currency) {
    try {
        let interval = "hourly";
        let marketChartData = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${currency}&days=1&interval=${interval}`;
        let response = await fetch(marketChartData);
        var dataInfo = await response.json();
        return dataInfo;
    } catch (error) {
        alert(`Error fetching API\nStatus: ${response.status}\n${response.statusText}\n${error}`);
    }
}
/**
 * Create historical data line graph uing Chart.js
 * display time vs price
 *  
 */
function displayMarketChart(coin, currency) {
    let marketData = getMarketChart(coin, currency).then(
        dataInfo => {
            let values = [];
            let unixTime = []
            for (let x = 0; x < dataInfo["prices"].length; x++){
                values.push(dataInfo["prices"][x][1]);
                unixTime.push(dataInfo["prices"][x][0]);
            }
            let labels = unixTime;
            let data = {
                labels: labels,
                datasets: [{
                    label: `Prices in ${currency}`,
                    data: values,
                    borderColor: 'black',
                    backgroundColor: 'white',
                }]
            };       
            let config = {type: "line", data, options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Market Chart'
                    }   
                }
            }};
        var myChart = new Chart(document.getElementById("myChart"), config);
        alert(dataInfo["prices"][1][0]);
    });
}

/**
 * passes #coins-list and #currencies-list and displays values via an alert method 
 */
 async function acceptValues() {
    let coin = document.getElementById("coins-list").value;
    let currency = document.getElementById("currencies-list").value;
    document.getElementById("row").className = "row-new";
    document.getElementById("coins-list").className = "form-group-new";
    document.getElementById("currencies-list").className = "form-group-new";
    document.getElementById("data").className = "data-display-new";
    // document.getElementById("vs-currency").className = "data-display-new";
    // document.getElementById("value").className = "data-display-new";
    // alert(`Cryptocurrency: ${coin}, Currency: ${currency}`);
    displayPrice(coin, currency);
    displayMarketChart(coin, currency);
}
