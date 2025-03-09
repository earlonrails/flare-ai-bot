import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { AppHeader } from "../AppHeader.jsx";
import { AppFooter } from "../AppFooter.jsx";

const getRandomPercentageChange = () => {
  const min = 0.25;
  const max = 2;
  const change = (Math.random() * (max - min) + min) / 100;
  return Math.random() < 0.5 ? -change : change;
};

// Generate historical data for the last 6 hours
const generateHistoricalData = () => {
  let price = 1.0; // Starting price in C2FLR (adjusted from 100 to match FAB context)
  let data = [];
  const now = new Date();
  const numCandles = 720; // 6 hours at 30s intervals (21,600s / 30s)

  for (let i = numCandles; i > 0; i--) {
    let timestamp = new Date(now.getTime() - i * 30000); // 30s intervals
    let open = price;
    let close = open * (1 + getRandomPercentageChange());
    let high = Math.max(open, close) * (1 + getRandomPercentageChange());
    let low = Math.min(open, close) * (1 - getRandomPercentageChange());

    data.push({ x: timestamp, y: [open, high, low, close] });
    price = close;
  }

  return data;
};

const FABToken = () => {
  const [series, setSeries] = useState([{ data: generateHistoricalData() }]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prevSeries) => {
        const lastClose = prevSeries[0].data[prevSeries[0].data.length - 1].y[3];

        let open = lastClose;
        let close = open * (1 + getRandomPercentageChange());
        let high = Math.max(open, close) * (1 + getRandomPercentageChange());
        let low = Math.min(open, close) * (1 - getRandomPercentageChange());

        let newCandle = { x: new Date(), y: [open, high, low, close] };

        let updatedData = [...prevSeries[0].data, newCandle].slice(-720); // Keep last 6 hours

        return [{ data: updatedData }];
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const options = {
    chart: {
      type: "candlestick",
      height: 500,
      background: "#fff",
      zoom: { enabled: true }, // Allow zooming
    },
    xaxis: {
      type: "datetime",
      range: 6 * 60 * 60 * 1000, // 6 hours in milliseconds (21,600,000 ms)
    },
    yaxis: {
      tooltip: { enabled: true },
      title: { text: "Price (C2FLR)" } // Added for clarity
    },
    title: {
      text: "FABToken Live Candlestick Chart (Last 6 Hours)",
      align: "center",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Chart options={options} series={series} type="candlestick" height={500} width={1000} />
      </div>
      <AppFooter />
    </div>
  );
};

export default FABToken;