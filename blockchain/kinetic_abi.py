# kinetic_abi.py
KINETIC_ABI = [
    {
        "constant": False,
        "inputs": [{"name": "amount", "type": "uint256"}],
        "name": "depositCollateral",
        "outputs": [],
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [{"name": "amount", "type": "uint256"}],
        "name": "borrow",
        "outputs": [],
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [{"name": "amount", "type": "uint256"}],
        "name": "repay",
        "outputs": [],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "user", "type": "address"}],
        "name": "getCollateralBalance",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "user", "type": "address"}],
        "name": "getHealthFactor",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    }
]
