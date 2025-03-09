import React from "react";
import Process from "../Process";

class ArbList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arbList: [
                {
                    symbol: "FLR/USDT",
                    logo: "/flare.png", // Replace with actual logo path
                    currentPrice: 0.0164934,
                    borrowRate: 2.8,
                    stakeRate: 44.75,
                    expectedReturn: 35.15,
                },
                {
                    symbol: "BTC/USDT",
                    logo: "/btc.png", // Replace with actual logo path
                    currentPrice: 85992.64,
                    borrowRate: 3.24,
                    stakeRate: 7.56,
                    expectedReturn: 3.12,
                },
                {
                    symbol: "ETH/USDT",
                    logo: "/eth.png", // Replace with actual logo path
                    currentPrice: 2186.543,
                    borrowRate: 4.5,
                    stakeRate: 10.00,
                    expectedReturn: 4,
                },
            ],
        };
        this.onPressInvest = this.onPressInvest.bind(this);
    }

    onPressInvest(symbol) {
        console.log("Investing in", symbol);
    }

    componentDidMount() {
        this.interval = setInterval(this.updateData, 5000); // Poll every 5 seconds
        this.updateData(); // Initial data fetch
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateData = async () => {
        try {
            const updatedArbList = await Promise.all(
                this.state.arbList.map(async (item) => {
                    const data = await this.fetchData(item.symbol); // Replace with your API call
                    return {
                        ...item,
                        currentPrice: data.currentPrice,
                        borrowRate: data.borrowRate,
                        stakeRate: data.stakeRate,
                        expectedReturn: data.expectedReturn,
                    };
                })
            );
            this.setState({ arbList: updatedArbList });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData = async (symbol) => {
        // Replace this with your actual API call
        // Example:
        const response = await fetch(`/api/arbData?symbol=${symbol}`); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    };

    render() {
        return (
            <div className="relative overflow-x-auto rounded-lg shadow-sm m-4">
                <Process />
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Symbol
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Current Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Borrow Rate
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Stake Rate
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Expected Return
                            </th>
                            <th scope="col" className="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.arbList.map((item) => (
                            <tr
                                key={item.symbol}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
                                >
                                    <img
                                        src={item.logo}
                                        alt={`${item.symbol} Logo`}
                                        className="w-6 h-6 mr-2"
                                    />
                                    {item.symbol}
                                </th>
                                <td className="px-6 py-4">${item.currentPrice.toFixed(2)}</td>
                                <td className="px-6 py-4">{item.borrowRate.toFixed(2)}%</td>
                                <td className="px-6 py-4">{item.stakeRate.toFixed(2)}%</td>
                                <td className="px-6 py-4">{item.expectedReturn.toFixed(2)}%</td>
                                <td className="px-6 py-4">
                                <button onClick={this.onPressInvest} className="connect-wallet">
                                    Invest
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ArbList;
