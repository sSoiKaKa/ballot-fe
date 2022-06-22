import { useEthers } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowRightCircle from "../components/icons/ArrowRightCircle";
import PlusCircle from "../components/icons/PlusCircle";
import useLastSessionId from "../hooks/read/useLastSessionId";
import useCreateSession from "../hooks/transaction/useCreateSession";
import { useContract } from "../hooks/useContract";

export default function FindBallotSession() {
  const navigate = useNavigate();

  const { account } = useEthers();
  const Ballot = useContract();
  const lastSessionId = useLastSessionId();
  const createSession = useCreateSession();

  useEffect(() => {
    if (!account) navigate("/");
  }, [account]);

  const [id, setId] = useState();

  const handleIdChanged = (event) => {
    setId(event.target.value);
  };

  const handleFindingButtonClicked = async () => {
    const session = await Ballot.functions.sessions(BigNumber.from(id));
    if (session.chairperson == ethers.constants.AddressZero) throw "Không tìm thấy cuộc bầu cử với ID này";

    if (session.chairperson == account)
      navigate("/BallotOwner", {
        state: {
          id: ethers.BigNumber.from(id),
        },
      });
    else
      navigate("/BallotVoter", {
        state: {
          id: ethers.BigNumber.from(id),
        },
      });
  };

  const [sessionInfo, setSessionInfo] = useState({
    chairperson: "",
    startTime: new Date(),
    endTime: new Date(),
  });

  const handleCreatingButtonClicked = async () => {
    const transactionReceipt = await createSession.send(
      sessionInfo.chairperson,
      ethers.BigNumber.from(sessionInfo.startTime.getTime()),
      ethers.BigNumber.from(sessionInfo.endTime.getTime())
    );

    console.log(transactionReceipt);
  };

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div className="col-6 border-end">
        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Tạo cuộc bầu cử mới</h2>
            <div className="text-secondary text-center">...Cung cấp thông tin cho cuộc bầu cử mới...</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              onChange={(event) =>
                setSessionInfo({
                  ...sessionInfo,
                  chairperson: event.target.value,
                })
              }
              value={sessionInfo.chairperson}
              placeholder="0x01234..."
            />
            <div className="form-text mb-3">Địa chỉ ví chủ toạ cho cuộc bầu cử.</div>

            <input
              type="datetime-local"
              className="form-control"
              onChange={(event) =>
                setSessionInfo({
                  ...sessionInfo,
                  startTime: new Date(event.target.value),
                })
              }
              placeholder="Thời gian bắt đầu"
            />
            <div className="form-text mb-3">Thời gian bắt đầu bầu cử</div>

            <input
              type="datetime-local"
              className="form-control"
              onChange={(event) =>
                setSessionInfo({
                  ...sessionInfo,
                  endTime: new Date(event.target.value),
                })
              }
              placeholder="Thời gian kết thúc"
            />
            <div className="form-text mb-3">Thời gian kết thúc bầu cử</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <button className="btn btn-primary px-4" onClick={handleCreatingButtonClicked}>
              <PlusCircle />
              {" Tạo cuộc bầu cử mới "}
            </button>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Tìm kiếm cuộc bầu cử bằng ID</h2>
            <div className="text-secondary text-center">...Đã có {lastSessionId?.value[0].toString()} cuộc bầu cử được tổ chức...</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <input type="number" className="form-control" onChange={handleIdChanged} value={id} placeholder="ID cuộc bầu cử" />
            <div className="form-text">Bạn cần cung cấp ID cuộc bầu cử để xem nội dung cuộc bầu cử.</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <button className="btn btn-primary px-4" onClick={handleFindingButtonClicked}>
              <ArrowRightCircle />
              {" Đi đến cuộc bầu cử "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
