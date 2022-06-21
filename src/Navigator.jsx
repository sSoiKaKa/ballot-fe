import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./layout/Root";
import ConnectWallet from "./views/ConnectWallet";
import FindBallotSession from "./views/FindBallotSession";

function Navigator() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<ConnectWallet />} />
          <Route path="FindBallotSession" element={<FindBallotSession />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Navigator;
