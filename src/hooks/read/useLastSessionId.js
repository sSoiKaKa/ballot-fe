import { useCall } from "@usedapp/core";
import { useContract } from "../useContract";

export default function useLastSessionId() {
  const contract = useContract();
  return useCall({
    contract,
    method: "lastSessionId",
    args: [],
  });
}
