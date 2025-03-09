import asyncio
import requests
import google.generativeai as genai
from web3 import AsyncHTTPProvider, AsyncWeb3
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("ARBITRAGE_GEMINI_KEY")

# Configure Gemini API Key
genai.configure(api_key=GEMINI_API_KEY)

# Flare Network (FTSO) setup
FTSOV2_ADDRESS = "0x3d893C53D9e8056135C26C8c638B76C8b60Df726"
RPC_URL = "https://coston2-api.flare.network/ext/C/rpc"

# Ethereum FTSO Feed ID
ETH_FEED_ID = "0x014554482f55534400000000000000000000000000"

# SparkDEX API URL for Ethereum price
SPARKDEX_API = "https://api.sparkdex.ai/price/latest?symbols=ETH"

ABI = '[{"inputs":[{"internalType":"address","name":"_addressUpdater","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FTSO_PROTOCOL_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fastUpdater","outputs":[{"internalType":"contract IFastUpdater","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fastUpdatesConfiguration","outputs":[{"internalType":"contract IFastUpdatesConfiguration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAddressUpdater","outputs":[{"internalType":"address","name":"_addressUpdater","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedById","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"int8","name":"","type":"int8"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedByIdInWei","outputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"int8","name":"","type":"int8"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedByIndexInWei","outputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getFeedId","outputs":[{"internalType":"bytes21","name":"","type":"bytes21"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21","name":"_feedId","type":"bytes21"}],"name":"getFeedIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes21[]","name":"_feedIds","type":"bytes21[]"}],"name":"getFeedsById","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"int8[]","name":"","type":"int8[]"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes21[]","name":"_feedIds","type":"bytes21[]"}],"name":"getFeedsByIdInWei","outputs":[{"internalType":"uint256[]","name":"_values","type":"uint256[]"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_indices","type":"uint256[]"}],"name":"getFeedsByIndex","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"int8[]","name":"","type":"int8[]"},{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_indices","type":"uint256[]"}],"name":"getFeedsByIndexInWei","outputs":[{"internalType":"uint256[]","name":"_values","type":"uint256[]"},{"internalType":"uint64","name":"_timestamp","type":"uint64"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"relay","outputs":[{"internalType":"contract IRelay","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"_contractNameHashes","type":"bytes32[]"},{"internalType":"address[]","name":"_contractAddresses","type":"address[]"}],"name":"updateContractAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"components":[{"internalType":"uint32","name":"votingRoundId","type":"uint32"},{"internalType":"bytes21","name":"id","type":"bytes21"},{"internalType":"int32","name":"value","type":"int32"},{"internalType":"uint16","name":"turnoutBIPS","type":"uint16"},{"internalType":"int8","name":"decimals","type":"int8"}],"internalType":"struct FtsoV2Interface.FeedData","name":"body","type":"tuple"}],"internalType":"struct FtsoV2Interface.FeedDataWithProof","name":"_feedData","type":"tuple"}],"name":"verifyFeedData","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'  # noqa: E501

async def fetch_flare_eth_price():
    """Fetch Ethereum price from Flare Network (FTSO)."""
    w3 = AsyncWeb3(AsyncHTTPProvider(RPC_URL))
    ftso = w3.eth.contract(address=w3.to_checksum_address(FTSOV2_ADDRESS), abi=ABI)  # Replace with correct ABI
    
    try:
        feeds, decimals, timestamp = await ftso.functions.getFeedsById([ETH_FEED_ID]).call()
        eth_price = feeds[0] / (10 ** decimals[0])
        return eth_price
    except Exception as e:
        print(f"Error fetching Flare ETH price: {e}")
        return None

def fetch_sparkdex_eth_price():
    """Fetch Ethereum price from SparkDEX."""
    headers = {"accept": "application/json"}
    response = requests.get(SPARKDEX_API, headers=headers)

    if response.status_code == 200:
        spark_prices = response.json()
        return float(spark_prices["ETH"])
    else:
        print(f"Error fetching SparkDEX ETH price: {response.status_code}")
        return None

def predict_arbitrage(flare_price, sparkdex_price):
    """
    Calls the fine-tuned Gemini model to predict whether we should arbitrage or not.

    Parameters:
        flare_price (float): Ethereum price from Flare (FTSO).
        sparkdex_price (float): Ethereum price from SparkDEX.

    Returns:
        int: 1 if arbitrage is possible, 0 otherwise.
    """

    # Construct the prompt
    prompt = f"""
    Given the following Ethereum prices:
    - Flare Network (FTSO): ${flare_price:.4f}
    - SparkDEX: ${sparkdex_price:.4f}

    Should an arbitrage trade be executed? 
    - Return 1 if the price difference is large enough to profit after transaction costs.
    - Return 0 if there is no significant arbitrage opportunity.
    """

    # Call the Gemini model
    model = genai.GenerativeModel("gemini-1.5-pro")  # Adjust model name if needed
    response = model.generate_content(prompt)

    # Extract model response (Ensure it's either 1 or 0)
    try:
        result = int(response.text.strip())  # Convert response to integer (1 or 0)
        return result if result in [0, 1] else 0  # Ensure only 1 or 0 is returned
    except ValueError:
        return 0  # Default to no arbitrage if response is unclear

async def main():
    """Main loop to fetch real-time prices and check for arbitrage opportunities."""
    while True:
        print("\n🔄 Fetching real-time Ethereum prices...")

        # Fetch prices from Flare (FTSO) and SparkDEX
        flare_eth_price = await fetch_flare_eth_price()
        sparkdex_eth_price = fetch_sparkdex_eth_price()

        print("Prices:")
        print(f"    Flare's ETH: {flare_eth_price}")
        print(f"    SparkDEX's ETH: {sparkdex_eth_price}")

        if flare_eth_price is None or sparkdex_eth_price is None:
            print("⚠ Error fetching one or both prices. Skipping this cycle.")
        else:
            # Predict arbitrage opportunity
            arbitrage_decision = predict_arbitrage(flare_eth_price, sparkdex_eth_price)
            print(f"\n🚀 Arbitrage Decision: {arbitrage_decision} (1 = Trade, 0 = No Trade)")

        # Wait 30 seconds before fetching prices again
        await asyncio.sleep(30)

# Run the arbitrage prediction loop
asyncio.run(main())
