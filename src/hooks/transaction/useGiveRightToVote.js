import { useContractFunction } from "@usedapp/core";
import { useContract } from "../useContract";

export default function useGiveRightToVote() {
  const Ballot = useContract();
  const fn = useContractFunction(Ballot, "giveRightToVote", { transactionName: "Give Right To Vote" });

  // DEV ONLY
  window.createSession = fn;

  return fn;
}
