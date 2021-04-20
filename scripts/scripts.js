/*
* Author: Patrick
* Description: javascript implementation for index.html
*/

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
var myChart = 0;

// when the page loads
window.addEventListener("DOMContentLoaded", updateCoinsList());
window.addEventListener("DOMContentLoaded", updateCurrencyList());

// var end = getTime();
// operationTime(end, start);


/**
 * fetch coingecko, the list of coins available
 * @returns data - .json() from fetch url
 */
async function getCoinsList() {
    try {
        let coinsListURL = "https://api.coingecko.com/api/v3/coins/list";
        let response = await fetch(coinsListURL);
        if (response.status == 200) {
            let data = await response.json();
            return data;
        }
    } catch (error) {
        alert(`Error fetching API\nStatus: ${response.status}\n${response.statusText}`);;

    } 
}

/*
 * Iterate through response.json() and append coin id to list
 */
function updateCoinsList() {
    getCoinsList().then(data => {
        let coinsList = document.getElementById("coins-list");
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
        let currencyListURL = "https://api.coingecko.com/api/v3/simple/supported_vs_currencies";
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

// Add currencies to currencyList
function updateCurrencyList() {
    getCurrencyList().then(function(data) {
        let currencyList = document.getElementById("currency-list");
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
        let coinPriceURL = "https://api.coingecko.com/api/v3/simple/price";
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
        let coinID = document.getElementById("coin");
        let vsCurrencyID = document.getElementById("vs-currency");
        let valueID = document.getElementById("value");
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
 * Passes UNIX time stamp and converts into MM:DD HH:mm:ss format
 * @param {*} unixTime 
 * @returns monthArray[date.getMonth()], date.getDay(), date.Hours, date.getMinute(), date.getSeconds()
 */
function convertTime(unixTime) {
    let date = new Date(unixTime);
    let monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
        "Nov", "Dec"];
    return `${monthArray[date.getMonth()]} ${date.getDate()}   ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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
                unixTime.push(convertTime(dataInfo["prices"][x][0]));
            }
            let labels = unixTime;
            let data = {
                labels: labels,
                datasets: [{
                    label: `${currency}`,
                    fill: true,
                    data: values,
                    borderColor: "rgba(79, 13, 209, 1)",
                    backgroundColor: "rgba(2, 112, 116, 0.5)",
                    borderWidth: 2,
                    tension: 0.15,
                }]
            };       
            let config = {
                type: "line", 
                data, 
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: "black"
                            }
                        },
                        title: {
                            display: true,
                            text: 'Market Chart\n(past 24)',
                            color: "rgba(79, 13, 209, 0.95)",
                            font: {
                                size: 20,
                                weight: "bold"
                            }
                        },
                        datalabels: {
                            color: "black",
                            font: {
                                weight: "bold",
                                size: 20
                            } 
                        },                          
                    },
                    scales: {
                        x:{
                            display: true,
                            title: {
                                display: true,
                                text: "MM/dd HH:mm:ss",
                                color:"black"
                            },
                            ticks: {
                                color: "black"
                            }                       
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: `${currency}`,
                                color:"black"
                            },
                            ticks: {
                                color: "black"                                
                            } 
                        }
                    },
                    interaction: {
                        mode: "index",
                        intersect: true
                    }
                }
            };
        if (typeof myChart === "object") {
            myChart.destroy();
            myChart = new Chart(document.getElementById("myChart"), config);
        } else {
            myChart = new Chart(document.getElementById("myChart"), config);
        }                    
    });
}

/**
 * passes #coins-list and #currencies-list and displays values via an alert method 
 */
 async function acceptValues() {
    let coin = document.getElementById("coins-list").value;
    let currency = document.getElementById("currency-list").value;
    displayPrice(coin, currency);
    displayMarketChart(coin, currency);
}
