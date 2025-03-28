import {
  Button,
  Empty,
  Form,
  FormProps,
  Input,
  List,
  message,
  Spin,
} from "antd";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  DotIcon,
  PlusIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import VirtualList from "rc-virtual-list";
import ENDPOINTS from "@/constants/endpoints";
import { useCallback, useEffect, useRef, useState } from "react";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import AddBeneficiaryModal from "../../AddBeneficiaryModal";
// import AddBeneficiaryModal from "../../AddBeneficiaryModal";

interface LocationState extends HM.GeneratedQuote {
  promo_code: string;
}

interface FormValues {
  name: string;
}

const SelectInternationalBeneficiary = () => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const location = useLocation();
  const [beneficiaries, setBeneficiaries] = useState<HM.Beneficiary[]>([]);
  const { state } = location as { state: LocationState };

  const modalRef = useRef<HM.ModalRefObject>(null);

  const beneMutation = useSharedMutationAction<{
    beneficiary: { data: HM.Beneficiary[] };
  }>({
    url: ENDPOINTS.FETCH_BENEFICIARY_BY_CURRENCY,
    onSuccess: data => {
      if (data?.beneficiary?.data) {
        setBeneficiaries(prev => {
          if (prev) {
            const existingAccountNumbers = new Set(
              prev.map(b => b.account_number)
            );
            const newBeneficiaries = data.beneficiary.data.filter(
              b => !existingAccountNumbers.has(b.account_number)
            );
            return [...prev, ...newBeneficiaries];
          } else {
            return data.beneficiary.data;
          }
        });
      }
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const getBeneficiaries = useCallback(async () => {
    await beneMutation.mutateAsync({
      type: "Business",
      category: "Remitter",
      currency: state.target.currency,
    });
    await beneMutation.mutateAsync({
      type: "Personal",
      category: "Remitter",
      currency: state.target.currency,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish: FormProps["onFinish"] = values => {
    console.log(values);
  };

  useEffect(() => {
    getBeneficiaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div
      className="flex items-center justify-center py-16
      ">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">
          Select Beneficiary
        </h3>
        <div className="space-y-6">
          <Button
            type="primary"
            size="large"
            className="w-full bg-primary-50 text-primary font-medium"
            icon={<PlusIcon className="w-4 h-4 text-primary" />}
            onClick={() => modalRef.current?.openModal()}
            block>
            Add new beneficiary
          </Button>
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            onFinish={onFinish}>
            <Form.Item
              name="name"
              label={
                <p className="text-sm text-grey-600 font-medium">
                  Beneficiary Name
                </p>
              }>
              <Input placeholder="Name or Account Number" className="w-full" />
            </Form.Item>
          </Form>
          <section className="border border-solid border-grey-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between text-sm font-medium p-2">
              <span className="text-grey-500">Your Beneficiaries</span>
              <Button
                type="text"
                className="text-primary !text-sm flex items-center justify-center"
                icon={<ArrowRightIcon className="w-4 h-4 text-primary" />}
                iconPosition="end">
                Saved Beneficiaries
              </Button>
            </div>
            <div>
              {!!beneficiaries?.length && (
                <List>
                  <VirtualList
                    data={beneficiaries || []}
                    height={320}
                    itemHeight={47}
                    itemKey="account_number">
                    {(item, index) => (
                      <List.Item
                        key={item.account_number}
                        onClick={() =>
                          navigate(
                            `/dashboard/send-money/international-payments/single/beneficiary/${item.beneficiary_id}`,
                            { state }
                          )
                        }
                        className={`cursor-pointer hover:bg-gray-50 px-3 ${
                          index % 2 === 0 ? "bg-primary-50/30" : ""
                        }`}>
                        <List.Item.Meta
                          avatar={
                            <div className="relative flex items-center justify-center h-9 w-9 bg-primary-300 rounded-full uppercase text-white">
                              <span className="text-lg font-medium">
                                {item.type === "Personal"
                                  ? (item?.fname?.[0] ?? "") +
                                    (item?.lname?.[0] ?? "")
                                  : (item?.company_name?.[0] ?? "")}
                              </span>
                              <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-solid border-white absolute bottom-0 right-0">
                                <img
                                  src={ENDPOINTS.FLAG_URL(
                                    item.ben_country.toLowerCase()
                                  )}
                                  alt="flag"
                                  className="w-full h-full rounded-full"
                                />
                              </div>
                            </div>
                          }
                          title={
                            <p className="text-sm text-grey-600 font-medium">
                              {item.type === "Personal"
                                ? `${item?.fname} ${item?.lname}`
                                : item?.company_name}
                            </p>
                          }
                          description={
                            <p className="text-sm text-grey-500 flex items-center gap-0.5">
                              {item?.bank_name}
                              <DotIcon className="w-5 h-5 text-grey-500" />
                              {item.account_number}
                            </p>
                          }
                        />
                        <ChevronRightIcon className="w-5 h-5 text-grey-500" />
                      </List.Item>
                    )}
                  </VirtualList>
                </List>
              )}
              {(!beneficiaries || !beneficiaries?.length) &&
                !beneMutation.isPending && (
                  <div className="py-6">
                    <Empty />
                  </div>
                )}
              {beneMutation.isPending && !beneficiaries?.length && (
                <div className="grid place-items-center py-6">
                  <Spin />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <AddBeneficiaryModal
        currency={state.target.currency}
        action={getBeneficiaries}
        targetCountry={state.country.target}
        isRemitter
        ref={modalRef}
      />
    </div>
  );
};

export const Component = SelectInternationalBeneficiary;

export default SelectInternationalBeneficiary;
