import { Button, DatePicker, Form, message, Modal, Radio, Space } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";

type DateRange = "custom" | "1month" | "3months" | "6months";

interface FormValues {
  dateRange: DateRange;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
}

const ExportModalRef = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const [selectedRange, setSelectedRange] = useState<DateRange>("1month");

  useImperativeHandle(ref, () => ({
    openModal: () => setOpen(true),
  }));

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleRangeChange = (range: DateRange) => {
    setSelectedRange(range);
    
    const today = dayjs();
    let startDate = null;
    
    switch (range) {
      case "1month":
        startDate = today.subtract(1, "month");
        break;
      case "3months":
        startDate = today.subtract(3, "month");
        break;
      case "6months":
        startDate = today.subtract(6, "month");
        break;
      default:
        form.resetFields(['startDate', 'endDate']);
        return;
    }
    
    form.setFieldsValue({
      startDate,
      endDate: today
    });
  };

  const handleExport = () => {
    form.validateFields().then(values => {
      console.log("Export values:", values);
      message.info("Export feature coming soon!");
      handleClose();
    });
  };

  return (
    <Modal 
      open={open} 
      onCancel={handleClose} 
      title="Export Transactions"
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          dateRange: "1month",
        }}
      >
        <Form.Item 
          name="dateRange" 
          label="Select Date Range"
          rules={[{ required: true, message: 'Please select a date range' }]}
        >
          <Radio.Group onChange={e => handleRangeChange(e.target.value)}>
            <Space direction="vertical">
              <Radio value="custom">Custom Range</Radio>
              <Radio value="1month">Last 1 month</Radio>
              <Radio value="3months">Last 3 months</Radio>
              <Radio value="6months">Last 6 months</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        {selectedRange === "custom" && (
          <div className="flex gap-4">
            <Form.Item
              name="startDate"
              label="Start Date"
              className="flex-1"
              rules={[{ required: selectedRange === "custom", message: 'Please select a start date' }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
            
            <Form.Item
              name="endDate"
              label="End Date"
              className="flex-1"
              rules={[{ required: selectedRange === "custom", message: 'Please select an end date' }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" onClick={handleExport}>
            Export
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

export default ExportModalRef;
