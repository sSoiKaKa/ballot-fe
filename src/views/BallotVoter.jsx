import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowRightCircle from "../components/icons/ArrowRightCircle";
import PlusCircle from "../components/icons/PlusCircle";
import useGetCandidatesFromSession from "../hooks/read/useGetCandidatesFromSession";
import useDelegate from "../hooks/transaction/useDelegate";
import useVote from "../hooks/transaction/useVote";
import { getCandidate, getSession } from "../services/store";

export default function BallotVoter() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { account } = useEthers();
  const candidatesFromSession = useGetCandidatesFromSession(state.id);

  const [sessionInfo, setSessionInfo] = useState({
    name: "",
    startTime: new Date(),
    endTime: new Date(),
  });

  useEffect(() => {
    const id = ethers.BigNumber.from(state.id);
    (async () => {
      const sessionInfo = (await getSession(id.toString())).data;
      sessionInfo.startTime = new Date(sessionInfo.startTime);
      sessionInfo.endTime = new Date(sessionInfo.endTime);
      setSessionInfo(sessionInfo);
    })();
  }, []);

  const [candidatesInfo, setCandidatesInfo] = useState([]);

  useEffect(() => {
    const id = ethers.BigNumber.from(state.id);

    if (candidatesFromSession?.value)
      (async () => {
        const candidatesInfoUpdated = [];
        for (let i = 0; i < candidatesFromSession?.value[0].length; ++i) {
          const candidateInfo = (await getCandidate(id.toString(), candidatesFromSession?.value[0][i].id)).data;
          candidatesInfoUpdated.push({
            ...candidateInfo,
            ...candidatesFromSession?.value[0][i],
          });
        }

        candidatesInfoUpdated.sort((candidateA, candidateB) => {
          return candidateA.voteCount < candidateB.voteCount ? 1 : -1;
        });
        setCandidatesInfo(candidatesInfoUpdated);
        console.log(candidatesInfoUpdated);
      })();
  }, [candidatesFromSession?.value]);

  const vote = useVote();

  const [candidateId, setCandidateId] = useState(1);
  const handleVote = async () => {
    await vote.send(ethers.BigNumber.from(state.id), ethers.BigNumber.from(candidateId));
  };

  const delegate = useDelegate();

  const [delegateAddress, setDelegateAddress] = useState("");
  const handleDelegated = async () => {
    await delegate.send(ethers.BigNumber.from(state.id), delegateAddress);
  };

  const isOnTime = sessionInfo.startTime <= new Date() && sessionInfo.startTime >= new Date();

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div className="col-12">
        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <h2>{sessionInfo.name}</h2>
            <div className="text-center text-secondary">{`Thời gian bắt đầu: ${sessionInfo.startTime.toLocaleDateString()}, ${sessionInfo.startTime.toLocaleTimeString()}`}</div>
            <div className="text-center text-secondary">{`Thời gian kết thúc: ${sessionInfo.endTime.toLocaleDateString()}, ${sessionInfo.endTime.toLocaleTimeString()}`}</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
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
                  <option value={null}>---</option>
                  {candidatesInfo.map((candidateInfo) => (
                    <option key={candidateInfo.id} value={candidateInfo.id}>
                      {`ID: ${candidateInfo.id} | Số phiếu: ${candidateInfo.voteCount}`}
                    </option>
                  ))}
                </select>
                <div className="form-text mb-3">Chọn ứng cử viên.</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <button disabled={isOnTime} className="btn btn-primary px-4" onClick={handleVote}>
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

            <div className="row justify-content-center align-items-center mt-4">
              <div className="col-auto">
                <input type="text" className="form-control" onChange={(event) => setDelegateAddress(event.target.value)} value={delegateAddress} placeholder="0x01234..." />
                <div className="form-text mb-3">Địa chỉ uỷ quyền.</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <button disabled={isOnTime} className="btn btn-primary px-4" onClick={handleDelegated}>
                  <ArrowRightCircle />
                  {" Trao quyền bầu cử "}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Trạng thái bầu cử</h2>
            <div className="text-secondary text-center">...Danh sách các ứng cử viên...</div>
          </div>
        </div>
        <div className="row justify-content-center align-items-center mt-3">
          {candidatesInfo.map((candidateInfo) => (
            <div key={candidateInfo.id} className="col-3 my-2">
              <div className="border rounded p-2">
                <h4>{`ID: ${candidateInfo.id}`}</h4>
                <h4>{`Họ và tên: ${candidateInfo.name || "Ẩn danh"}`}</h4>
                <h4>{`Tuổi: ${candidateInfo.age || "Ẩn danh"}`}</h4>
                <p>{`Số phiếu: ${candidateInfo.voteCount}`}</p>
                {candidateInfo.avatar && <img src={candidateInfo.avatar} width={200} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
