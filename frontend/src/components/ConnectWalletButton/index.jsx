import React from "react";
import "./index.css";
import Web3 from "web3";

class ConnectWalletButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            loading: false,
        };

        this.onPressConnect = this.onPressConnect.bind(this);
        this.onPressLogout = this.onPressLogout.bind(this);
    }

    async onPressConnect() {
        setLoading(true);

        try {
            if (window?.ethereum?.isMetaMask) {
                // Desktop browser
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                const account = Web3.utils.toChecksumAddress(accounts[0]);
                this.setState({ address: account });
            }
        } catch (error) {
            console.log(error);
        }

        this.setState({ loading: false });
    }

    onPressLogout() {
        this.setState({ address: "" });
    }

    render() {
        const { address, loading } = this.state;
        return (
            <div>
                {address && !loading ? (
                    <button onClick={this.onPressLogout} className="connect-wallet">
                        Disconnect
                    </button>
                ) : loading ? (
                    <button
                        className="connect-wallet connect-button-loading"
                        disabled
                    >
                        <div>Loading...</div>
                    </button>
                ) : (
                    <button onClick={this.onPressConnect} className="connect-wallet">
                        Connect Wallet
                    </button>
                )}
            </div>
        );
    }
}

export default ConnectWalletButton;