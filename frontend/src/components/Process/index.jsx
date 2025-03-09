import React from "react";
import {Bank, Robot, CashStack, Cash} from "react-bootstrap-icons";

const FABProcess = () => {
    return (
        <section className="flex-grow py-12 bg-gray-100">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1: Invest & Receive Tokens */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="mb-4 flex justify-center">
                            <Bank className="text-5xl text-orange-500"/>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Invest & Receive Tokens</h2>
                        <p className="text-gray-600 mb-4">
                            Send C2FLR to the FAB smart contract and receive FAB tokens instantly at the current rate.
                        </p>
                        <a href="#invest" className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                            Start Investing
                        </a>
                    </div>

                    {/* Step 2: Bot Performs Arbitrage */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="mb-4 flex justify-center">
                            <Robot className="text-5xl text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Bot Performs Arbitrage</h2>
                        <p className="text-gray-600 mb-4">
                            Our bot exploits loan, futures, and staking opportunities across Kinetic, SparkDEX, and Sceptre.
                        </p>
                        <a href="#details" className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                            Learn More
                        </a>
                    </div>

                    {/* Step 3: Sell/Burn Tokens for Profit */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="mb-4 flex justify-center">
                            <CashStack className="text-5xl text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Sell/Burn for Profit</h2>
                        <p className="text-gray-600 mb-4">
                            Sell or burn your FAB tokens to withdraw C2FLR at the updated price based on bot profits.
                        </p>
                        <a href="#withdraw" className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                            Cash Out
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FABProcess;