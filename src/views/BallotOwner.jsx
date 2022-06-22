import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowRightCircle from "../components/icons/ArrowRightCircle";
import PlusCircle from "../components/icons/PlusCircle";
import useGetCandidatesFromSession from "../hooks/read/useGetCandidatesFromSession";
import useAddCandidate from "../hooks/transaction/useAddCandidate";
import useGiveRightToVote from "../hooks/transaction/useGiveRightToVote";

export default function BallotOwner() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { account } = useEthers();
  const candidatesFromSession = useGetCandidatesFromSession(state.id);
  const addCandidate = useAddCandidate();
  const giveRightToVote = useGiveRightToVote();

  useEffect(() => {
    console.log(giveRightToVote.state);
    switch (giveRightToVote.state.status) {
      case "None":
        return;
      case "Exception":
        throw giveRightToVote.state.errorMessage;
      case "Success":
        Swal.fire({
          icon: "success",
        });
        break;
    }
  }, [giveRightToVote.state]);

  const [candidateId, setCandidateId] = useState(1);
  const handleAddCandidate = async () => {
    await addCandidate.send(state.id, ethers.BigNumber.from(candidateId));
  };

  const [addressToVote, setAddressToVote] = useState("");
  const handleGiveRightToVote = async () => {
    await giveRightToVote.send(state.id, [addressToVote]);
  };

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div className="col-6 border-end">
        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Thêm ứng cử viên</h2>
            <div className="text-secondary text-center">...Đã có {candidatesFromSession?.value[0].length - 1} ứng cử viên trong cuộc bầu cử này...</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <input type="number" className="form-control" onChange={(event) => setCandidateId(event.target.value)} value={candidateId} placeholder="1" />
            <div className="form-text mb-3">Số báo danh cho ứng cử viên.</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <button className="btn btn-primary px-4" onClick={handleAddCandidate}>
              <PlusCircle />
              {" Thêm ứng cử viên "}
            </button>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Trao quyền bầu cử</h2>
            <div className="text-secondary text-center">...Trao quyền bầu cử cho địa chỉ muốn bầu cử...</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <input type="text" className="form-control" onChange={(event) => setAddressToVote(event.target.value)} value={addressToVote} placeholder="0x01234..." />
            <div className="form-text mb-3">Địa chỉ người muốn bầu cử.</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <button className="btn btn-primary px-4" onClick={handleGiveRightToVote}>
              <ArrowRightCircle />
              {" Trao quyền bầu cử "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
