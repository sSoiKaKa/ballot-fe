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
import useVote from "../hooks/transaction/useVote";

export default function BallotVoter() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { account } = useEthers();
  const candidatesFromSession = useGetCandidatesFromSession(state.id);
  const vote = useVote();

  const [candidateId, setCandidateId] = useState(1);
  const handleVote = async () => {
    await vote.send(state.id, ethers.BigNumber.from(candidateId));
  };

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div className="col-12">
        <div className="row align-items-center">
          <div className="col-6 border-end">
            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <h2 className="text-secondary text-center">Bỏ phiếu</h2>
                <div className="text-secondary text-center">...Bỏ phiếu cho ứng cử viên mong muốn...</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center mt-4">
              <div className="col-auto">
                <select className="form-select" onChange={(event) => setCandidateId(event.target.value)}>
                  {candidatesFromSession?.value[0].map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {`ID: ${candidate.id} | Số phiếu: ${candidate.voteCount}`}
                    </option>
                  ))}
                </select>
                <div className="form-text mb-3">Chọn ứng cử viên.</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <button className="btn btn-primary px-4" onClick={handleVote}>
                  <PlusCircle />
                  {" Bỏ phiếu "}
                </button>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <h2 className="text-secondary text-center">Uỷ quyền bầu cử</h2>
                <div className="text-secondary text-center">...Uỷ quyền bầu cử cho địa chỉ khác...</div>
              </div>
            </div>

            {/* <div className="row justify-content-center align-items-center mt-4">
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
        </div> */}
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Trạng thái bầu cử</h2>
            <div className="text-secondary text-center">...Cuộc bầu cử chưa diễn ra...</div>
          </div>
        </div>
        <div className="row justify-content-center align-items-center mt-3">
          {candidatesFromSession?.value[0].map((candidate) => (
            <div key={candidate.id} className="col-3">
              <h4>{`ID: ${candidate.id}`}</h4>
              <p>{`Số phiếu: ${candidate.voteCount}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
