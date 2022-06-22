import { useCall } from "@usedapp/core";
import { useContract } from "../useContract";

export default function useSession(sessionId) {
  const contract = useContract();
  return useCall({
    contract,
    method: "sessions",
    args: [sessionId],
  });
}
