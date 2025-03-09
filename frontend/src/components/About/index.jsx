import React from 'react';
import { AppHeader } from '../AppHeader.jsx';
import { AppFooter } from '../AppFooter.jsx';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      loading: false,
    };
  }

  render() {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow p-6 md:p-10 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Flare Arbitrage Bot (FAB)</h1>

            <section className="mb-8">
              <p className="text-lg leading-relaxed mb-4">
                Welcome to Flare Arbitrage Bot (FAB)—a cutting-edge DeFi arbitrage bot built on the Flare Network. FAB harnesses real-time price data from Flare’s Time Series Oracle (FTSO) and Gemini’s AI-driven analysis to identify and exploit arbitrage opportunities across Kinetic, SparkDEX, and Sceptre. Users deposit currency into our smart contract, receive FAB tokens tied to the bot’s performance, and can cash out by selling or burning tokens at the current price, which increases as the bot generates profits.
              </p>
              <p className="text-lg font-semibold mb-4 text-center">
                <strong>Our mission:</strong> Deliver secure, automated returns to users by capitalizing on Flare’s DeFi ecosystem.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>

              <h3 className="text-xl font-semibold mb-3">User Flow</h3>

              <ol className="list-decimal list-inside mb-6 space-y-3">
                <li>
                  <span className="font-semibold">Deposit Funds:</span>
                  <p className="ml-4">
                    Users send C2FLR (Coston2 testnet currency) to the FAB smart contract wallet. In return, they receive FAB tokens proportional to their deposit (e.g., 1 C2FLR = 1 FAB initially).
                  </p>
                </li>
                <li>
                  <span className="font-semibold">Arbitrage Execution:</span>
                  <p className="ml-4">
                    The bot analyzes opportunities across: Kinetic (borrowing/staking for lending arbitrage), SparkDEX (liquidity pools and perpetual futures), and Sceptre (staking yield discrepancies).
                  </p>
                  <p className="ml-4">
                    <strong>Strategy:</strong> Borrow at low interest rates, stake where returns exceed borrowing costs, or exploit futures mispricings.
                  </p>
                </li>
                <li>
                  <span className="font-semibold">FTSO Integration:</span>
                  <p className="ml-4">
                    Uses FTSO price feeds (e.g., FLR/USD) for real-time asset valuation.
                  </p>
                </li>
                <li>
                  <span className="font-semibold">Gemini Bot Analysis:</span>
                  <p className="ml-4">
                    Our AI-powered “Gemini Bot” (simulated via rule-based logic for MVP) processes FTSO data to estimate returns and recommend optimal arbitrage paths.
                  </p>
                  <p className="ml-4">
                    <strong>Example:</strong> “Borrow FLR at 2%, stake at 5%”.
                  </p>
                </li>
                <li>
                  <span className="font-semibold">Token Value Growth:</span>
                  <p className="ml-4">
                    As the bot generates profits, the FAB token price increases (e.g., via a bonding curve or profit reinvestment).
                  </p>
                  <p className="ml-4">
                    <strong>Example:</strong> Initial price $1, rises to $1.20 after 20% arbitrage gains.
                  </p>
                </li>
                <li>
                  <span className="font-semibold">Cash Out:</span>
                  <p className="ml-4">
                    Users sell or burn FAB tokens at the current price to withdraw profits in C2FLR.
                  </p>
                </li>
              </ol>
            </section>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }
}

export default About;