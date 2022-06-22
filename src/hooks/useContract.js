import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";
import BallotArtifact from "../contracts/Ballot.json";
import verifyArguments from "../contracts/verifyArguments.json";

export function useContract() {
  const { library: provider } = useEthers();

  const ballotInterface = new ethers.utils.Interface(BallotArtifact.abi);
  const BallotContract = new ethers.Contract(verifyArguments.Ballot.address, ballotInterface, provider);

  // DEV ONLY
  window.Ballot = BallotContract;
  window.ethers = ethers;

  return BallotContract;
}
