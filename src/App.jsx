import { DAppProvider, Hardhat } from "@usedapp/core";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContextProvider } from "./context/appContext";
import Navigator from "./Navigator";

const dappConfig = {
  readOnlyChainId: Hardhat.chainId,
  readOnlyUrls: {
    [Hardhat.chainId]: "http://127.0.0.1:8545/",
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
