import HeaderTitle from "@/components/ui/HeaderTitle";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button, Form, Input } from "antd";
import clsx from "clsx";

const BusinessNameSearch = ({ next }: { next: () => void }) => {
  const [form] = Form.useForm<{ value: string }>();
  const value = Form.useWatch("value", form);

  const onFinish = () => {};

  return (
    <div className="h-full w-full space-y-8 p-8">
      <HeaderTitle
        headerTitle="Business Name Search"
        headerDescription="Verify your business name to get started"
      />
      <section>
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          className="space-y-0"
        >
          <section className="-space-y-4">
            <div className="grid grid-cols-[0.77fr_0.23fr] items-center gap-x-2">
              <Form.Item
                name="value"
                label={
                  <p className="text-sm font-semibold text-grey-600">
                    Enter business name or registration number
                  </p>
                }
              >
                <Input
                  placeholder="Enter required details here"
                  className="w-full rounded-full"
                  suffix={
                    value ? (
                      <CheckCircleIcon className="h-5 w-5 text-positive" />
                    ) : null
                  }
                />
              </Form.Item>
              <Button
                htmlType="submit"
                shape="round"
                type="primary"
                size="large"
                disabled={!value}
                className="h-11"
              >
                Search
              </Button>
            </div>
            <p
              className={clsx(
                "text-sm font-medium",
                value ? "text-positive" : "text-grey-400"
              )}
            >
              {value
                ? "Business found!"
                : "Details of the business will appear below if found"}
            </p>
          </section>
        </Form>
      </section>
      {value && (
        <section className="space-y-4">
          <div className="flex items-center justify-between rounded-md bg-grey-50 p-3 px-4">
            <span className="text-lg font-medium text-grey-700">
              Business Details
            </span>
            <span className="text-grey-500">Search result</span>
          </div>
          <div className="space-y-6 rounded-xl bg-grey-50 p-3 px-4">
            <div className="flex items-center justify-between">
              <p className="text-grey-500">Business name</p>
              <p className="text-right font-medium text-grey-700">
                Brunelle & Botch
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-500">City</p>
              <p className="text-right font-medium text-grey-700">Birmingham</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-500">State/Province</p>
              <p className="text-right font-medium text-grey-700">
                Wolverhampton
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-500">Postal</p>
              <p className="text-right font-medium text-grey-700">DY3 WU3</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-500">Incorporation</p>
              <p className="text-right font-medium text-grey-700">
                Aug 28th, 2021
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-500">Type of business</p>
              <p className="text-right font-medium text-grey-700">Fashion</p>
            </div>
          </div>
        </section>
      )}
      <Button
        type="primary"
        size="large"
        disabled={!value}
        className="w-48 text-base"
        shape="round"
        onClick={next}
      >
        Save & Continue
      </Button>
    </div>
  );
};
export default BusinessNameSearch;
