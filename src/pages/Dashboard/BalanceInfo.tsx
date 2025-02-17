import { Button } from "antd";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const BalanceInfo = () => {
  const [show, setShow] = useState(true);

  const toggleBalanceInfo = () => {
    setShow(prevShow => !prevShow);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-grey-500">
        <span className="font-medium">Total Amount</span>
        <Button
          type="text"
          icon={
            show ? (
              <EyeOffIcon className="w-4 h-4 text-grey-500" />
            ) : (
              <EyeIcon className="w-4 h-4 text-grey-500" />
            )
          }
          onClick={toggleBalanceInfo}
        />
      </div>
      <p className="text-4xl text-grey-600 font-semibold font-nunito">
        {show ? "5,000,000" : "********"}
      </p>
    </div>
  );
};
export default BalanceInfo;
