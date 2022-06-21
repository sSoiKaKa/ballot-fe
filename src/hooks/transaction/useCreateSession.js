import { useContractFunction } from "@usedapp/core";
import { useContract } from "../useContract";

export default function useCreateSession() {
  const Ballot = useContract();
  return useContractFunction(Ballot, "createSession", { transactionName: "Create Session" });
}
