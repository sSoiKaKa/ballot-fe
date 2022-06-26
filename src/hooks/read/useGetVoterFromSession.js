import { useCall } from "@usedapp/core";
import { useContract } from "../useContract";

export default function useGetVoterFromSession(sessionId, voterAddress) {
  const contract = useContract();
  return useCall({
    contract,
    method: "getVoterFromSession",
    args: [sessionId, voterAddress],
  });
}
