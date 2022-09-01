import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import axios from "axios";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 1337, 137],
});

const Header = () => {
    const context = useWeb3React();
    const { library, account, active, activate, deactivate } = context;
    const [isLogin, setIsLogin] = useState(false);
    const handleConnectWallet = () => {
        if (!active) {
            activate(injected);
        }
        if (active) {
            deactivate();
        }
    };

    const handleLogIn = async () => {
        if (active) {
            const signature = await library
                .getSigner(account)
                .signMessage(
                    "That is message witch you have to sign for login 123123123123123"
                );
            console.log(signature);

            var data = JSON.stringify({
                signature: signature,
                publicAddress: account,
            });

            var config = {
                method: "post",
                url: "http://localhost:8000/auth",
                headers: {
                    "Content-Type": "application/json",
                },
                data: data,
            };

            const response = await axios(config);
            console.log(response);
            if (response.data.address !== undefined) {
                setIsLogin(true);
                console.log(JSON.stringify(response.data));
            }
        }
    };

    return (
        <div className="header">
            <button onClick={handleConnectWallet}>
                {active
                    ? account.substring(0, 4) + "..." + account.substring(38, 42)
                    : "ConnectWallet"}
            </button>
            {active && (
                <button onClick={handleLogIn}>{isLogin ? "Wellcome" : "Login"}</button>
            )}
        </div>
    );
};

export default Header;
