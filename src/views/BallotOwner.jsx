import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowRightCircle from "../components/icons/ArrowRightCircle";
import Check from "../components/icons/Check";
import PlusCircle from "../components/icons/PlusCircle";
import useGetCandidatesFromSession from "../hooks/read/useGetCandidatesFromSession";
import useAddCandidate from "../hooks/transaction/useAddCandidate";
import useGiveRightToVote from "../hooks/transaction/useGiveRightToVote";
import { deletePersonalRequest, getPersonalRequests, putCandidate } from "../services/store";

export default function BallotOwner() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    (async () => {
      const id = ethers.BigNumber.from(state.id);
      const requestList = (await getPersonalRequests(id.toString())).data;

      if (!requestList) return;

      const keys = Object.keys(requestList);
      const parsedRequestList = keys
        .map((key) => requestList[key])
        .map((request, index) => {
          request.isChose = false;
          request.id = keys[index];
          return request;
        });

      setRequestList(parsedRequestList);
    })();
  }, []);

  const { account } = useEthers();
  const candidatesFromSession = useGetCandidatesFromSession(state.id);
  const addCandidate = useAddCandidate();
  const giveRightToVote = useGiveRightToVote();

  const [candidateInfo, setCandidateInfo] = useState({
    id: 0,
    name: "",
    age: 0,
    avatar: "",
  });

  const handleAddCandidate = async () => {
    const id = ethers.BigNumber.from(state.id);
    const transactionReceipt = await addCandidate.send(id.toString(), ethers.BigNumber.from(candidateInfo.id));
    console.log(transactionReceipt);

    if (transactionReceipt) {
      await putCandidate(id.toString(), candidateInfo.id, {
        ...candidateInfo,
        id: undefined,
      });
      setCandidateInfo({
        id: 0,
        name: "",
        age: 0,
        avatar: "",
      });
    }
  };

  const handleMovedToBallot = async () => {
    navigate("/BallotVoter", {
      state,
    });
  };

  const [chosenRequests, setChosenRequests] = useState([]);

  const handleAcceptButtonChanged = (index) => {
    const personalRequest = requestList[index];
    const addressToVoteIndex = chosenRequests.findIndex((chosenRequest) => chosenRequest.id === personalRequest.id);

    if (addressToVoteIndex == -1) {
      setChosenRequests([...chosenRequests, personalRequest]);

      requestList[index].isChose = true;
    } else {
      setChosenRequests([
        ...chosenRequests.slice(0, addressToVoteIndex),
        ...chosenRequests.slice(addressToVoteIndex + 1),
      ]);

      requestList[index].isChose = false;
    }
  };

  const handleGiveRightToVote = async () => {
    const transactionReceipt = await giveRightToVote.send(
      state.id,
      chosenRequests.map((chooseRequest) => chooseRequest.account)
    );
    if (transactionReceipt) {
      const id = ethers.BigNumber.from(state.id);
      const jobs = chosenRequests.map((chooseRequest) => deletePersonalRequest(id.toString(), chooseRequest.id));
      await Promise.all(jobs);

      const filteredRequestList = requestList.filter(
        (personalRequest) => chosenRequests.findIndex((chosenRequest) => chosenRequest.id == personalRequest.id) == -1
      );
      setRequestList(filteredRequestList);
      setChosenRequests([]);
    }
  };

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div className="col-12">
        <div className="row justify-content-center align-items-center">
          <div className="col-6 border-end">
            <div className="row justify-content-center align-items-center">
              <div className="col-auto">
                <h2 className="text-secondary text-center">Thêm ứng cử viên</h2>
                <div className="text-secondary text-center">
                  ...Đã có {candidatesFromSession?.value[0].length} ứng cử viên trong cuộc bầu cử này...
                </div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center mt-4">
              <div className="col-auto">
                <input
                  type="number"
                  className="form-control"
                  onChange={(event) =>
                    setCandidateInfo({
                      ...candidateInfo,
                      id: event.target.value,
                    })
                  }
                  value={candidateInfo.id}
                  placeholder="0"
                />
                <div className="form-text mb-3">Số báo danh cho ứng cử viên.</div>

                <input
                  type="text"
                  className="form-control"
                  onChange={(event) =>
                    setCandidateInfo({
                      ...candidateInfo,
                      name: event.target.value,
                    })
                  }
                  value={candidateInfo.name}
                  placeholder="Nguyễn Văn A"
                />
                <div className="form-text mb-3">Họ và tên ứng cử viên.</div>

                <input
                  type="number"
                  className="form-control"
                  onChange={(event) =>
                    setCandidateInfo({
                      ...candidateInfo,
                      age: Number(event.target.value),
                    })
                  }
                  value={candidateInfo.age}
                  placeholder="20"
                />
                <div className="form-text mb-3">Tuổi của ứng cử viên.</div>

                <input
                  type="text"
                  className="form-control"
                  onChange={(event) =>
                    setCandidateInfo({
                      ...candidateInfo,
                      avatar: event.target.value,
                    })
                  }
                  value={candidateInfo.avatar}
                  placeholder="http://..."
                />
                <div className="form-text mb-3">Đường dẫn đến ảnh đại diện của ứng cử viên.</div>
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
                <div className="text-secondary text-center">...Danh sách các địa chỉ tham gia bầu cử...</div>
              </div>
            </div>

            <div className="row justify-content-center align-items-center mt-4">
              <div className="col-auto">
                <div className="row flex-column align-items-stretch">
                  <div className="col-auto">
                    {requestList.map((request, index) => (
                      <div key={request.account} className="row align-items-center justify-content-between">
                        <div className="col-auto">
                          <div className="h5">{request.name}</div>
                        </div>
                        <div className="col-auto">
                          <button
                            className={["btn btn-sm", request.isChose ? "btn-primary" : "btn-secondary"].join(" ")}
                            onClick={() => handleAcceptButtonChanged(index)}
                          >
                            <Check />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <button className="btn btn-secondary px-4" onClick={handleMovedToBallot}>
              <ArrowRightCircle />
              {" Xem thông tin cuộc bầu cử "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
