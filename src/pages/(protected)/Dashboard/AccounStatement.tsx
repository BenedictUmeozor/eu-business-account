import { Alert, Button, DatePicker, Form, FormProps, Modal } from "antd";
import clsx from "clsx";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useAccountStatementDates } from "../../../hooks/use-account-statement-dates";
import dayjs from "dayjs";

interface FormValues {
  start_date: dayjs.Dayjs;
  end_date: dayjs.Dayjs;
}

const AccountStatement = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const { 
    selectedRange, 
    setSelectedRange, 
    startDate, 
    endDate, 
    isCustom 
  } = useAccountStatementDates();

  useImperativeHandle(ref, () => ({
    openModal: () => setOpen(true),
  }));

  // Update form values when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      form.setFieldsValue({
        start_date: startDate,
        end_date: endDate
      });
    }
  }, [startDate, endDate, form]);

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    console.log("Start date:", values.start_date?.format("YYYY-MM-DD"));
    console.log("End date:", values.end_date?.format("YYYY-MM-DD"));
    setOpen(false);
  };

  return (
    <Modal
      onCancel={() => setOpen(false)}
      open={open}
      width={510}
      footer={null}
      title={
        <span className="text-xl font-semibold text-grey-600">
          Account Statement
        </span>
      }>
      <section className="space-y-6 pt-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="primary"
            shape="round"
            onClick={() => setSelectedRange("custom")}
            className={clsx(
              selectedRange === "custom" 
                ? "bg-primary-50 border-primary text-primary" 
                : "bg-grey-50 border-grey-50 text-grey"
            )}>
            Custom
          </Button>
          <Button
            type="primary"
            shape="round"
            onClick={() => setSelectedRange("1month")}
            className={clsx(
              selectedRange === "1month" 
                ? "bg-primary-50 border-primary text-primary" 
                : "bg-grey-50 border-grey-50 text-grey"
            )}>
            Last 1 month
          </Button>
          <Button
            type="primary"
            shape="round"
            onClick={() => setSelectedRange("3months")}
            className={clsx(
              selectedRange === "3months" 
                ? "bg-primary-50 border-primary text-primary" 
                : "bg-grey-50 border-grey-50 text-grey"
            )}>
            Last 3 months
          </Button>
          <Button
            type="primary"
            shape="round"
            onClick={() => setSelectedRange("6months")}
            className={clsx(
              selectedRange === "6months" 
                ? "bg-primary-50 border-primary text-primary" 
                : "bg-grey-50 border-grey-50 text-grey"
            )}>
            Last 6 months
          </Button>
        </div>
        <Alert
          message="You can only generate statements for a time period of six months"
          showIcon
          type="info"
          className="text-primary"
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-4">
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-2">
            <Form.Item
              name="start_date"
              label={
                <span className="font-medium text-sm text-grey-600">
                  Start Date
                </span>
              }>
              <DatePicker 
                className="w-full" 
                disabled={!isCustom}
                format="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item
              name="end_date"
              label={
                <span className="font-medium text-sm text-grey-600">
                  End Date
                </span>
              }>
              <DatePicker 
                className="w-full" 
                disabled={!isCustom}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="primary"
              shape="round"
              htmlType="submit"
              size="large"
              className="w-48 text-base">
              Send to Email
            </Button>
          </div>
        </Form>
      </section>
    </Modal>
  );
});

export default AccountStatement;
