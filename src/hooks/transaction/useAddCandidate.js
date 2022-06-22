import { useContractFunction } from "@usedapp/core";
import { useContract } from "../useContract";

export default function useAddCandidate() {
  const Ballot = useContract();
  const fn = useContractFunction(Ballot, "addCandidate", { transactionName: "Add Candidate" });

  // DEV ONLY
  window.createSession = fn;

  return fn;
}
