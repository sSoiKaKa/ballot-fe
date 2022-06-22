import detectEthereumProvider from "@metamask/detect-provider";
import { useEthers } from "@usedapp/core";
import { useNavigate } from "react-router-dom";
import WalletSvg from "../components/icons/WalletSvg";

export default function ConnectWallet() {
  const { account, activateBrowserWallet } = useEthers();
  const navigate = useNavigate();

  console.log(account);

  async function handleConnectedWallet() {
    const provider = await detectEthereumProvider();

    if (!provider) {
      throw {
        type: "require",
        message: "Please install Metamask before play this game!",
      };
    }

    activateBrowserWallet();
  }

  function handleContinued() {
    navigate("FindBallotSession");
  }

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div className="col-auto">
        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Hệ thống bầu cử sử dụng công nghệ blockchain</h2>
            <div className="text-secondary text-center">...TODO: add description...</div>
          </div>
        </div>
        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <button className="btn btn-primary px-4" onClick={account ? handleContinued : handleConnectedWallet}>
              <WalletSvg />
              {account ? " Tiếp tục sử dụng ví này " : " Kết nối đến ví của bạn "}
            </button>
          </div>
        </div>
        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <h5>{account}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
