import { useCall } from "@usedapp/core";
import { useContract } from "../useContract";

export function useSession(sessionId) {
  const contract = useContract("MemberCard");
  return useCall({
    contract,
    method: "sessions",
    args: [sessionId],
  });
}
