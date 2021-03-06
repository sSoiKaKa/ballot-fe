import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowRightCircle from "../components/icons/ArrowRightCircle";
import PlusCircle from "../components/icons/PlusCircle";
import useGetCandidatesFromSession from "../hooks/read/useGetCandidatesFromSession";
import useGetVoterFromSession from "../hooks/read/useGetVoterFromSession";
import useDelegate from "../hooks/transaction/useDelegate";
import useVote from "../hooks/transaction/useVote";
import { getCandidate, getSession, postPersonalRequest } from "../services/store";

export default function BallotVoter() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { account } = useEthers();
  const candidatesFromSession = useGetCandidatesFromSession(state.id);
  const voterFromSession = useGetVoterFromSession(state.id, account);

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

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
  });

  const handlePersonalRequest = async () => {
    const id = ethers.BigNumber.from(state.id);
    const response = await postPersonalRequest(id.toString(), personalInfo.name, account);
    if (response.status == 200) {
      Swal.fire({
        icon: "success",
        text: "G???i y??u c???u th??nh c??ng",
      });
    }
  };

  const isOnTime = sessionInfo.startTime <= new Date() && sessionInfo.startTime >= new Date();

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div className="col-12">
        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <h2 className="text-center">{sessionInfo.name}</h2>
            <div className="text-center text-secondary">{`Th???i gian b???t ?????u: ${sessionInfo.startTime.toLocaleDateString()}, ${sessionInfo.startTime.toLocaleTimeString()}`}</div>
            <div className="text-center text-secondary">{`Th???i gian k???t th??c: ${sessionInfo.endTime.toLocaleDateString()}, ${sessionInfo.endTime.toLocaleTimeString()}`}</div>
          </div>
        </div>

        {voterFromSession?.value[0].weight == 0 ? (
          <Fragment>
            <div className="row justify-content-center mt-3">
              <div className="col-auto">
                <h5 className="text-center text-danger">B???n ch??a c?? quy???n b???u c???. H??y g???i y??u c???u ????? ???????c c???p quy???n</h5>
              </div>
            </div>
            <div className="row justify-content-center align-items-center mb-3">
              <div className="col-auto">
                <input
                  type="text"
                  className="form-control"
                  onChange={(event) =>
                    setPersonalInfo({
                      ...personalInfo,
                      name: event.target.value,
                    })
                  }
                  value={personalInfo.name}
                  placeholder="T??n c??? tri"
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary px-4" onClick={handlePersonalRequest}>
                  <ArrowRightCircle />
                  {" G???i y??u c???u "}
                </button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className="row justify-content-center">
            <div className="col-auto">
              <h5 className="text-center text-success">B???n ???? c?? quy???n b???u c???. H??y b???t ?????u b??? phi???u</h5>
            </div>
          </div>
        )}

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-6 border-end">
            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <h2 className="text-secondary text-center">B??? phi???u</h2>
                <div className="text-secondary text-center">...B??? phi???u cho ???ng c??? vi??n mong mu???n...</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center mt-4">
              <div className="col-auto">
                <select className="form-select" onChange={(event) => setCandidateId(event.target.value)}>
                  <option value={null}>---</option>
                  {candidatesInfo.map((candidateInfo) => (
                    <option key={candidateInfo.id} value={candidateInfo.id}>
                      {`ID: ${candidateInfo.id} | S??? phi???u: ${candidateInfo.voteCount}`}
                    </option>
                  ))}
                </select>
                <div className="form-text mb-3">Ch???n ???ng c??? vi??n.</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <button disabled={isOnTime} className="btn btn-primary px-4" onClick={handleVote}>
                  <PlusCircle />
                  {" B??? phi???u "}
                </button>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <h2 className="text-secondary text-center">U??? quy???n b???u c???</h2>
                <div className="text-secondary text-center">...U??? quy???n b???u c??? cho ?????a ch??? kh??c...</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center mt-4">
              <div className="col-auto">
                <input
                  type="text"
                  className="form-control"
                  onChange={(event) => setDelegateAddress(event.target.value)}
                  value={delegateAddress}
                  placeholder="0x01234..."
                />
                <div className="form-text mb-3">?????a ch??? u??? quy???n.</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <button disabled={isOnTime} className="btn btn-primary px-4" onClick={handleDelegated}>
                  <ArrowRightCircle />
                  {" Trao quy???n b???u c??? "}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Tr???ng th??i b???u c???</h2>
            <div className="text-secondary text-center">...Danh s??ch c??c ???ng c??? vi??n...</div>
          </div>
        </div>
        <div className="row justify-content-center align-items-center mt-3">
          {candidatesInfo.map((candidateInfo) => (
            <div key={candidateInfo.id} className="col-3 my-2">
              <div className="border rounded p-2">
                <h4>{`ID: ${candidateInfo.id}`}</h4>
                <h4>{`H??? v?? t??n: ${candidateInfo.name || "???n danh"}`}</h4>
                <h4>{`Tu???i: ${candidateInfo.age || "???n danh"}`}</h4>
                <p>{`S??? phi???u: ${candidateInfo.voteCount}`}</p>
                {candidateInfo.avatar && <img src={candidateInfo.avatar} width={200} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
