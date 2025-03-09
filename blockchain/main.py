# kinetic_guard_blockchain.py
import os
import logging
from web3 import Web3
from kinetic_abi import KINETIC_ABI

# Configure logging
logging.basicConfig(level=logging.INFO, filename="kinetic_guard.log")
logger = logging.getLogger(__name__)

FLARE_RPC_URL = os.getenv("FLARE_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")  # In TEE in production
KINETIC_CONTRACT_ADDRESS = os.getenv("KINETIC_CONTRACT_ADDRESS")

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(FLARE_RPC_URL))
if not w3.is_connected():
    logger.error("Failed to connect to Flare network")
    raise ConnectionError("Cannot connect to Flare RPC")

# User account (stubbed; TEE would manage this)
account = w3.eth.account.from_key(PRIVATE_KEY)
w3.eth.default_account = account.address

# Kinetic contract instance
kinetic = w3.eth.contract(address=KINETIC_CONTRACT_ADDRESS, abi=KINETIC_ABI)

class KineticGuardBlockchain:
    """Blockchain interaction layer for KineticGuard loan management."""

    def __init__(self):
        """Initialize with Web3 and Kinetic contract."""
        self.w3 = w3
        self.kinetic = kinetic
        self.account = account
        logger.info(f"Initialized KineticGuard for account {self.account.address}")

    def _sign_and_send_tx(self, tx):
        """
        Sign and send a transaction using TEE-stored key.

        Parameters:
            tx (dict): Transaction dictionary to sign and send.

        Returns:
            str: Transaction hash.
        """
        # In production, this would use TEE (e.g., SGX enclave) to sign
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        logger.info(f"Sent transaction: {tx_hash.hex()}")
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        if receipt.status == 1:
            logger.info(f"Transaction {tx_hash.hex()} succeeded")
            return tx_hash.hex()
        else:
            logger.error(f"Transaction {tx_hash.hex()} failed")
            raise ValueError("Transaction failed")

    async def deposit_collateral(self, amount: int):
        """
        Deposit FLR as collateral into Kinetic.

        Parameters:
            amount (int): Amount of FLR (in wei) to deposit.

        Returns:
            str: Transaction hash.
        """
        tx = self.kinetic.functions.depositCollateral(amount).build_transaction({
            "from": self.account.address,
            "nonce": self.w3.eth.get_transaction_count(self.account.address),
            "gas": 200000,
            "gasPrice": self.w3.to_wei("50", "gwei")
        })
        return self._sign_and_send_tx(tx)

    async def borrow_asset(self, amount: int):
        """
        Borrow FUSD against collateral from Kinetic.

        Parameters:
            amount (int): Amount of FUSD (in wei) to borrow.

        Returns:
            str: Transaction hash.
        """
        tx = self.kinetic.functions.borrow(amount).build_transaction({
            "from": self.account.address,
            "nonce": self.w3.eth.get_transaction_count(self.account.address),
            "gas": 200000,
            "gasPrice": self.w3.to_wei("50", "gwei")
        })
        return self._sign_and_send_tx(tx)

    async def repay_loan(self, amount: int):
        """
        Repay a portion or full Kinetic loan.

        Parameters:
            amount (int): Amount of FUSD (in wei) to repay.

        Returns:
            str: Transaction hash.
        """
        tx = self.kinetic.functions.repay(amount).build_transaction({
            "from": self.account.address,
            "nonce": self.w3.eth.get_transaction_count(self.account.address),
            "gas": 200000,
            "gasPrice": self.w3.to_wei("50", "gwei")
        })
        return self._sign_and_send_tx(tx)

    async def get_collateral_balance(self) -> int:
        """
        Query the user’s collateral balance on Kinetic.

        Returns:
            int: Collateral amount in wei.
        """
        balance = self.kinetic.functions.getCollateralBalance(self.account.address).call()
        logger.info(f"Collateral balance for {self.account.address}: {balance} wei")
        return balance

    async def get_health_factor(self) -> float:
        """
        Query the user’s health factor on Kinetic.

        Returns:
            float: Health factor (e.g., 1.5 for 150%).
        """
        factor = self.kinetic.functions.getHealthFactor(self.account.address).call()
        health_factor = factor / 1e18  # Assuming 18 decimals
        logger.info(f"Health factor for {self.account.address}: {health_factor}")
        return health_factor

if __name__ == "__main__":
    import asyncio

    async def test():
        guard = KineticGuardBlockchain()
        # Example: Deposit 100 FLR (in wei)
        amount = w3.to_wei(100, "ether")
        tx_hash = await guard.deposit_collateral(amount)
        print(f"Deposited collateral: {tx_hash}")
        # Check balance
        balance = await guard.get_collateral_balance()
        print(f"Collateral balance: {w3.from_wei(balance, 'ether')} FLR")

    asyncio.run(test())
