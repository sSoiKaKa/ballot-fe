import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./layout/Root";
import BallotOwner from "./views/BallotOwner";
import BallotVoter from "./views/BallotVoter";
import ConnectWallet from "./views/ConnectWallet";
import FindBallotSession from "./views/FindBallotSession";

function Navigator() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<ConnectWallet />} />
          <Route path="FindBallotSession" element={<FindBallotSession />} />
          <Route path="BallotOwner" element={<BallotOwner />} />
          <Route path="BallotVoter" element={<BallotVoter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Navigator;
