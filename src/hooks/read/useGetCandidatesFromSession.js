import { useCall } from "@usedapp/core";
import { useContract } from "../useContract";

export default function useGetCandidateFromSession(sessionId) {
  const contract = useContract();
  return useCall({
    contract,
    method: "getCandidatesFromSession",
    args: [sessionId],
  });
}
