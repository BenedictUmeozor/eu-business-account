import { Button, Form, FormProps, Input, List } from "antd";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  DotIcon,
  PlusIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import VirtualList from "rc-virtual-list";
import ENDPOINTS from "@/constants/endpoints";
import { useRef } from "react";
import { BENEFICIARIES } from "../../constants";
import AddBeneficiaryModal from "../../AddBeneficiaryModal";

interface FormValues {
  name: string;
}

const SelectInternationalBeneficiary = () => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();

  const modalRef = useRef<HM.ModalRefObject>(null);

  const onFinish: FormProps["onFinish"] = values => {
    console.log(values);
  };

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
              <List>
                <VirtualList
                  data={BENEFICIARIES}
                  height={320}
                  itemHeight={47}
                  itemKey="account_number">
                  {(item, index) => (
                    <List.Item
                      key={item.account_number}
                      onClick={() =>
                        navigate(
                          `/dashboard/send-money/international-payments/single/beneficiary/${item.account_number}`
                        )
                      }
                      className={`cursor-pointer hover:bg-gray-50 px-3 ${
                        index % 2 === 0 ? "bg-primary-50/30" : ""
                      }`}>
                      <List.Item.Meta
                        avatar={
                          <div className="relative flex items-center justify-center h-9 w-9 bg-primary-300 rounded-full uppercase text-white">
                            <span className="text-lg font-medium">
                              {item.first_name[0] + item.last_name[0]}
                            </span>
                            <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-solid border-white absolute bottom-0 right-0">
                              <img
                                src={ENDPOINTS.FLAG_URL(item.country)}
                                alt="flag"
                                className="w-full h-full rounded-full"
                              />
                            </div>
                          </div>
                        }
                        title={
                          <p className="text-sm text-grey-600 font-medium">
                            {item.first_name} {item.last_name}
                          </p>
                        }
                        description={
                          <p className="text-sm text-grey-500 flex items-center gap-0.5">
                            {item.bank_name}
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
            </div>
          </section>
        </div>
      </div>
      <AddBeneficiaryModal ref={modalRef} />
    </div>
  );
};

export const Component = SelectInternationalBeneficiary;

export default SelectInternationalBeneficiary;
