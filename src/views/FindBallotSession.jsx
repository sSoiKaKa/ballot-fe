import { useEthers } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import ArrowRightCircleFunction from "../components/icons/ArrowRightCircle";
import useLastSessionId from "../hooks/read/useLastSessionId";
import { useContract } from "../hooks/useContract";

export default function FindBallotSession() {
  const navigate = useNavigate();
  const { account } = useEthers();
  const lastSessionId = useLastSessionId();
  const Ballot = useContract();

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
  };

  const [sessionInfo, setSessionInfo] = useState({
    chairperson: ethers.constants.AddressZero,
    candidatesId: [],
    startTime: BigNumber.from(0),
    endTime:BigNumber.from(0),
  });

  const handleSessionInfoChanged = ()

  const handleCreatingButtonClicked = async () => {

  }


  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div className="col-6">
        <div className="row justify-content-center align-items-center">
          <div className="col-auto">
            <h2 className="text-secondary text-center">Tạo cuộc bầu cử mới</h2>
            <div className="text-secondary text-center">...Cung cấp thông tin cho cuộc bầu cử mới...</div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-auto">
            <input type="text" className="form-control" onChange={handleIdChanged} value={id} placeholder="0x01234..." />
            <div className="form-text">Địa chỉ ví chủ toạ cho cuộc bầu cử.</div>

            <input type="text" className="form-control" onChange={handleIdChanged} value={id} placeholder="1, 2, 3" />
            <div className="form-text">Danh sách mã số bầu chọn cho cuộc bầu cử.</div>
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
              <ArrowRightCircleFunction />
              {" Đi đến cuộc bầu cử "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
