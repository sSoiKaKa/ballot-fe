import { useContractFunction } from "@usedapp/core";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useContract } from "../useContract";

export default function useVote() {
  const Ballot = useContract();
  const fn = useContractFunction(Ballot, "vote", { transactionName: "Vote" });

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
          text: "Vote successfully",
        });
        break;
    }
  }, [fn.state]);

  return fn;
}
