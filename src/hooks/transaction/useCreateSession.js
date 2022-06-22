import { useContractFunction } from "@usedapp/core";
import { useContract } from "../useContract";

export default function useCreateSession() {
  const Ballot = useContract();
  const fn = useContractFunction(Ballot, "createSession", { transactionName: "Create Session" });

  // DEV ONLY
  window.createSession = fn;

  return fn;
}
