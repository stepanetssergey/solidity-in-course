import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import jwt from "jsonwebtoken";

export const handleRequest = async (req, res) => {
    const { signature, publicAddress } = req.body;

    if (!signature || !publicAddress) {
        return res
            .status(400)
            .send({ error: "Request should have signature and publicAddress" });
    } else {
        const msg =
            "That is message witch you have to sign for login 123123123123123";
        // const msg = "That is message witch you have to sign for login";
        const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
        const address = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });
        console.log(address);
        console.log(publicAddress);
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
            console.log("YES YOU ARE CORRECT OWNER OF THIS ADDRESS");
            const jwtToken = jwt.sign({ address }, msg);
            return res.status(200).send(JSON.stringify({ jwt: jwtToken, address }));
        } else {
            return res.status(400).send({ error: "It is not correct signature" });
        }
    }
};
