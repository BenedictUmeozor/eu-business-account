import ENDPOINTS from "@/constants/endpoints";
import { Button, Input, message, Result } from "antd";
import { NumericFormat } from "react-number-format";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { CURRENCIES } from "@/constants/currencies";
import Beneficiary from "@/components/global/Beneficiary";
import { useAppSelector } from "@/hooks";

const SendToBeneficiary = () => {
  const params = useParams() as { beneficiary: string };
  const balances = useAppSelector(state => state.accounts.balances);
  const [beneficiary, setBeneficiary] = useState<HM.Beneficiary>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    sortCode: "",
  });

  const isFormValid = useMemo(
    () => formData.amount && formData.description && formData.sortCode,
    [formData]
  );

  const currency = useMemo(() => {
    return CURRENCIES.find(
      c => c.currencyCode === searchParams.get("currency")
    );
  }, [searchParams]);

  const currBalance = useMemo(() => {
    return balances?.find(b => b.ccy === searchParams.get("currency"));
  }, [balances, searchParams]);

  const benMutation = useSharedMutationAction<{ beneficiary: HM.Beneficiary }>({
    url: ENDPOINTS.FETCH_SINGLE_BENEFICIARY,
    onSuccess: data => {
      setBeneficiary(data?.beneficiary);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onSubmit = () => {
    navigate(
      `/dashboard/send-money/local-payments/single/summary?currency=${searchParams.get("currency")}`,
      {
        state: {
          amount: formData.amount,
          description: formData.description,
          sortCode: formData.sortCode,
          beneficiary_id: params.beneficiary,
        },
      }
    );
  };

  useEffect(() => {
    if (typeof beneficiary === "undefined") {
      benMutation.mutate({ beneficiary_id: params.beneficiary });
    }
    if (!formData.sortCode) {
      setFormData(prev => ({ ...prev, sortCode: beneficiary?.bic || "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beneficiary]);

  useEffect(() => {
    if (!currency) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  if (!beneficiary && !benMutation.isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <Result
          status="404"
          title="Beneficiary Not Found"
          subTitle="The beneficiary you're looking for doesn't exist or has been removed."
          extra={
            <Button
              type="primary"
              onClick={() => navigate(-1)}
              size="large"
              shape="round">
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">Send Money</h3>

        <div className="space-y-8">
          <div className="flex items-center justify-between bg-secondary-400 rounded-lg py-3 px-4">
            <span className="font-nunito text-white text-sm font-medium">
              {currency?.currencyCode} Bal: {currency?.currencySymbol}
              {currBalance?.amount}
            </span>
            <div className="flex items-center justify-center gap-1 p-1 rounded-md bg-primary-500/40">
              <img
                src={ENDPOINTS.FLAG_URL(
                  currency?.countryCode.toLowerCase() || ""
                )}
                alt="flag"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-white text-base font-medium">
                {currency?.currencyCode}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-grey-600 font-medium">Enter Amount</p>
            <NumericFormat
              customInput={Input}
              thousandSeparator={true}
              prefix={currency?.currencySymbol}
              placeholder="Enter amount"
              className="w-full bg-primary-100 h-14"
              decimalScale={2}
              allowNegative={false}
              value={formData.amount}
              onValueChange={values => {
                setFormData(prev => ({ ...prev, amount: values.value }));
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-grey-600 font-medium">Description</p>
            <Input
              placeholder="Enter description"
              className="w-full"
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-grey-600 font-medium">
              Beneficiary Details
            </p>
            <Beneficiary beneficiary={beneficiary} />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-grey-600 font-medium">Sort Code</p>
          <Input
            className="w-full"
            placeholder="Sort Code"
            value={formData.sortCode}
            onChange={e =>
              setFormData(prev => ({ ...prev, sortCode: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center justify-center">
          <Button
            type="primary"
            size="large"
            shape="round"
            className="w-48"
            onClick={onSubmit}
            disabled={!isFormValid}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Component = SendToBeneficiary;

export default SendToBeneficiary;
