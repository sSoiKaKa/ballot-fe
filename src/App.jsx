import { DAppProvider, Hardhat, Rinkeby } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContextProvider } from "./context/appContext";
import Navigator from "./Navigator";

// const dappConfig = {
//   readOnlyChainId: Hardhat.chainId,
//   readOnlyUrls: {
//     [Hardhat.chainId]: "http://127.0.0.1:8545/",
//   },
// };

const dappConfig = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: getDefaultProvider("rinkeby"),
  },
};

function App() {
  return (
    <ErrorBoundary>
      <DAppProvider config={dappConfig}>
        <AppContextProvider>
          <Navigator />
        </AppContextProvider>
      </DAppProvider>
    </ErrorBoundary>
  );
}

export default App;
