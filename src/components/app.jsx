import React, { useEffect, useState } from 'react'
import { Pane, Combobox } from 'evergreen-ui'
import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"

const axios = require('axios')

// Load Highcharts modules
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/map')(Highcharts)

function App() {
    let symbolArr = [];
    let ohlc = [];
    let volume = [];
    const [data, setData] = useState([]);
    const [dailyData, setDailyData] = useState({});

    useEffect(() => {
        axios.all([
            axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.REACT_APP_FINNHUB_API_KEY}`),
            axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`)
        ]).then(axios.spread((firstResponse, secondResponse) => {
            setData(firstResponse.data);
            setDailyData(secondResponse.data);
        })).catch(err => console.log(err));
    }, []);

    data.map(item => symbolArr.push(item.symbol));
    // console.log(dailyData["Time Series (Daily)"]);

    for (var key in dailyData["Time Series (Daily)"]) {
        if (dailyData["Time Series (Daily)"].hasOwnProperty(key)) {
            ohlc.push([
                Date.parse(key),
                parseInt(dailyData["Time Series (Daily)"][key]["1. open"]),
                parseInt(dailyData["Time Series (Daily)"][key]["2. high"]),
                parseInt(dailyData["Time Series (Daily)"][key]["3. low"]),
                parseInt(dailyData["Time Series (Daily)"][key]["4. close"])
            ]);

            volume.push([
                Date.parse(key),
                parseInt(dailyData["Time Series (Daily)"][key]["5. volume"])
            ])
        }
    }
    console.log(ohlc);

    /* const stockOptions = {
        yAxis: [{
          height: '75%',
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'AAPL'
          }
        }],
        series: [{
            data: ohlc,
            type: 'ohlc',
            name: 'AAPL Stock Price',
            id: 'aapl'
        }, {
            type: 'column',
            id: 'aapl-volume',
            name: 'AAPL Volume',
            data: volume,
            yAxis: 1
        }]
    } */

    const stockOptions = {
        yAxis: [{
          height: '75%',
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'AAPL'
          }
        }],
        series: [{
          data: ohlc,
          type: 'ohlc',
          name: 'AAPL Stock Price',
          id: 'aapl'
        }]
      }

    return (
        <Pane>
            <Combobox openOnFocus width="100%" items={symbolArr} placeholder="Select stock symbol" onChange={selected => console.log(selected)}/>
            <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={stockOptions}/>
        </Pane>
    )
}

export default App;