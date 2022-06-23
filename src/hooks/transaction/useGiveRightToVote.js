import { useContractFunction } from "@usedapp/core";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useContract } from "../useContract";

export default function useGiveRightToVote() {
  const Ballot = useContract();
  const fn = useContractFunction(Ballot, "giveRightToVote", { transactionName: "Give Right To Vote" });

  useEffect(() => {
    console.log(fn.state);
    switch (fn.state.status) {
      case "None":
        return;
      case "Exception":
        throw fn.state.errorMessage;
      case "Success":
        Swal.fire({
          icon: "success",
          text: "Give right to vote successfully",
        });
        break;
    }
  }, [fn.state]);

  return fn;
}
