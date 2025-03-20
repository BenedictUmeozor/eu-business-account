import { Button, Divider, Form, Input } from "antd";

const SecurityQuestions = ({
  next,
  show,
}: {
  show: boolean;
  next: () => void;
}) => {
  return (
    <>
      <div className="max-w-3xl">
        <Form
          layout="horizontal"
          wrapperCol={{ span: 14 }}
          labelCol={{ span: 10 }}
          labelAlign="left">
          <Form.Item
            label={
              <span className="text-grey-500 font-medium">First Question</span>
            }>
            <div className="space-y-1">
              <Input value="In what city were you born?" disabled />
              <Input placeholder="Enter Answer" />
            </div>
          </Form.Item>
          <Form.Item
            label={
              <span className="text-grey-500 font-medium">Second Question</span>
            }>
            <div className="space-y-1">
              <Input value="In what city were you born?" disabled />
              <Input placeholder="Enter Answer" />
            </div>
          </Form.Item>
          <Form.Item
            label={
              <span className="text-grey-500 font-medium">Third Question</span>
            }>
            <div className="space-y-1">
              <Input value="In what city were you born?" disabled />
              <Input placeholder="Enter Answer" />
            </div>
          </Form.Item>
        </Form>
      </div>
      {!show && (
        <>
          <Divider className="my-8" />
          <div className="flex items-center justify-end">
            <Button
              type="primary"
              size="large"
              className="w-48"
              shape="round"
              onClick={next}>
              Next
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default SecurityQuestions;
