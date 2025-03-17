import { Alert, Button, Divider, message, Space, Switch } from "antd";
import ENDPOINTS from "@/constants/endpoints";
import PinModal, { PinRefObject } from "@/components/global/PinModal";
import { useEffect, useMemo, useRef, useState } from "react";
import TransferSuccessModal, {
  TransferSuccessRefObject,
} from "./TransferSuccessModal";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { CURRENCIES } from "@/constants/currencies";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import Beneficiary from "@/components/global/Beneficiary";
import Loader from "@/components/app/Loader";
import { useAppSelector } from "@/hooks";
import useAccountBalances from "@/hooks/use-account-balances";

interface LocationState {
  amount: string;
  description: string;
  sortCode: string;
  beneficiary_id: string;
}

const TransferSummary = () => {
  const [beneficiary, setBeneficiary] = useState<HM.Beneficiary>();
  const [confirmed, setConfirmed] = useState(false);
  const location = useLocation() as unknown as { state: LocationState };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scaApproved = useRef(false);
  const session = useAppSelector(state => state.session);

  const { fetchBalance } = useAccountBalances();

  const modalRef = useRef<PinRefObject>(null);
  const successRef = useRef<TransferSuccessRefObject>(null);

  const currency = useMemo(
    () => CURRENCIES.find(c => c.currencyCode === searchParams.get("currency")),
    [searchParams]
  );

  const paymentMutation = useSharedMutationAction<{
    request_id: string;
    message: string;
  }>({
    url: ENDPOINTS.INITIATE_LOCAL_PAYMENT,
    onSuccess: async data => {
      message.success(data?.message);
      successRef.current?.setReqId(data?.request_id);
      successRef.current?.openModal();
      await fetchBalance(searchParams.get("currency") as string);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
    invalidateQueries: ["local-transactions"],
  });

  const handleTransfer = (pin: string) => {
    modalRef.current?.closeModal();

    const payload = {
      beneficiary_id: location.state.beneficiary_id,
      amount: location.state.amount,
      narrative: location.state.description,
      currency: currency?.currencyCode,
      passcode: pin,
    };

    paymentMutation.mutate(payload);
  };

  const benMutation = useSharedMutationAction<{ beneficiary: HM.Beneficiary }>({
    url: ENDPOINTS.FETCH_SINGLE_BENEFICIARY,
    onSuccess: data => {
      setBeneficiary(data?.beneficiary);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const registerMutation = useSharedMutationAction<any>({
    url: ENDPOINTS.REGISTER_DEVICE,
    onSuccess: data => {
      console.log(data);
      // scaApproved.current = true;
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const statusMutation = useSharedMutationAction<any>({
    url: ENDPOINTS.DEVICE_SCA_STATUS,
    onSuccess: data => {
      console.log(data);
      if (
        data?.message === "This device has not been enrolled for SCA" &&
        !session?.user?.email.includes("testmail123")
      ) {
        registerMutation.mutate({});
      } else {
        scaApproved.current = true;
      }
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    statusMutation.mutate({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !Object.values(location.state).every(value => Boolean(value)) ||
      !currency
    ) {
      navigate("/dashboard");
    }
    if (typeof beneficiary === "undefined") {
      benMutation.mutate({ beneficiary_id: location.state.beneficiary_id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, currency]);

  return (
    <div className="flex items-center justify-center py-16">
      {(statusMutation.isPending || registerMutation.isPending) && <Loader />}
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">
          Transfer Summary
        </h3>
        <div className="space-y-4">
          <div className="cutout p-4 shadow rounded-2xl bg-white">
            <table className="w-full">
              <tbody>
                <tr className="[&:not(:last-child)]:mb-2">
                  <th className="font-normal text-grey-500 text-base text-left w-1/2">
                    You send
                  </th>
                  <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                    {currency?.currencySymbol}
                    {location.state.amount}
                  </td>
                </tr>
                <tr className="[&:not(:last-child)]:mb-2">
                  <th className="font-normal text-grey-500 text-base text-left w-1/2">
                    Commission
                  </th>
                  <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                    {currency?.currencySymbol}0.00
                  </td>
                </tr>
                <tr className="[&:not(:last-child)]:mb-2">
                  <th className="font-normal text-grey-500 text-base text-left w-1/2">
                    Recepient gets
                  </th>
                  <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                    {currency?.currencySymbol}
                    {location.state.amount}
                  </td>
                </tr>
                <tr className="[&:not(:last-child)]:mb-2">
                  <th className="font-normal text-grey-500 text-base text-left w-1/2">
                    Payable amount
                  </th>
                  <td className="font-nunito text-primary font-medium text-right w-1/2">
                    {currency?.currencySymbol}
                    {location.state.amount}
                  </td>
                </tr>
              </tbody>
            </table>
            <Divider
              dashed
              variant="dashed"
              style={{ borderColor: "#D0D5DD" }}
            />
            <div className="space-y-1">
              <p className="text-sm text-grey-600 font-medium">
                Beneficiary Details
              </p>
              <Beneficiary beneficiary={beneficiary} />
            </div>
          </div>

          {/* <div className="flex items-center justify-between border border-solid border-grey-200 p-3 rounded-lg">
            <span className="text-sm text-grey-500">Payment reference</span>
            <span className="text-grey-700">HMR0910202400145</span>
          </div> */}

          <Alert
            message="NB: Payments must be made from an account in your name. Any payment received under a different name will be refunded, and a £5 administration fee will be deducted."
            showIcon
            type="info"
            className="text-primary"
          />
        </div>

        <Space>
          <Switch checked={confirmed} onChange={setConfirmed} />{" "}
          <span className="text-grey-600">
            I understand, confirm to proceed
          </span>
        </Space>

        <div className="flex items-center justify-center">
          <Button
            className="w-48"
            size="large"
            type="primary"
            shape="round"
            disabled={!confirmed || !scaApproved.current}
            loading={paymentMutation.isPending}
            onClick={() => modalRef.current?.openModal()}>
            Transfer
          </Button>
        </div>
      </div>
      <PinModal
        ref={modalRef}
        onSubmit={handleTransfer}
        loading={false} // Add loading state if needed
      />
      <TransferSuccessModal ref={successRef} />
    </div>
  );
};

export const Component = TransferSummary;

export default TransferSummary;
