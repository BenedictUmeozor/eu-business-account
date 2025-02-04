import HeaderTitle from "@/components/ui/HeaderTitle";
import Upload from "@/components/ui/Upload";
import { Button, Form } from "antd";
import { memo, useState } from "react";

const SourceFundsUpload = ({
  back,
  next,
}: {
  back: () => void;
  next: (name: "inc" | "pos" | "pob" | "license") => void;
}) => {
  const [form] = Form.useForm<{ file: File | null }>();
  const [file, setFile] = useState<File | null>(null);

  const onFinish = () => {
    next("pos");
  };

  return (
    <div className="h-full w-full space-y-8 p-8">
      <HeaderTitle
        headerDescription="Upload your Proof of Source of Funds"
        headerTitle="Proof of Source of Funds"
      />
      <Form
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
        <Upload
          file={file}
          setFile={setFile}
          image="/images/doc.png"
          label="Upload proof of source of funds"
          className="w-48"
        />
        <div className="flex items-center gap-4">
          <Button
            type="primary"
            htmlType="button"
            shape="round"
            onClick={back}
            className="w-48 bg-primary-50 text-base text-primary hover:bg-primary-100"
            size="large">
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            className="w-48 text-base"
            size="large">
            Save & Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default memo(SourceFundsUpload);
