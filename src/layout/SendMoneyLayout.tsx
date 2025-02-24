import { Button } from "antd";
import { ChevronLeftIcon } from "lucide-react";
import { Outlet, useNavigate } from "react-router";

const SendMoneyLayout = () => {
  const navigate = useNavigate();

  return (
    <section className="h-full grid grid-rows-[auto_1fr]">
      <div>
        <Button
          type="text"
          icon={<ChevronLeftIcon className="w-4 h-4 text-grey-500" />}
          className="!text-base text-grey-500 font-medium"
          onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
      <Outlet />
    </section>
  );
};
export default SendMoneyLayout;
