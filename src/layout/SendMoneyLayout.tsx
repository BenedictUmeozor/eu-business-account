import { useAccountContext } from "@/contexts/account";
import { useAppSelector } from "@/hooks";
import { Button, message } from "antd";
import { ChevronLeftIcon } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const SendMoneyLayout = () => {
  const navigate = useNavigate();
  const accounts = useAppSelector(state => state.accounts.currencies);

  const { currencyLoading } = useAccountContext();

  useEffect(() => {
    if (!currencyLoading && !accounts?.length) {
      message.error("No accounts found. Please create an account first.");
      navigate("/dashboard");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyLoading, accounts]);

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
