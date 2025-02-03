import { Button, Form, FormProps, Input } from "antd";
import { memo, useCallback, useState } from "react";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import Upload from "@/components/ui/Upload";
import HeaderTitle from "@/components/ui/HeaderTitle";
import clsx from "clsx";

interface FormValues {
  nin: string;
  dial_code: string;
  phone_number: string;
  front_image: File | null;
  back_image: File | null;
}

type VerificationType = "id" | "poi" | undefined;

const ProofOfIdentity = ({
  next,
  back,
  isReview,
}: {
  next: (type: VerificationType) => void;
  back: () => void;
  isReview?: boolean;
}) => {
  const [form] = Form.useForm<FormValues>();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    console.log(values);
    next("poi");
  };

  const setFieldsValue = useCallback(
    ({ dialCode, phoneNumber }: { dialCode: string; phoneNumber: string }) => {
      form.setFieldsValue({ dial_code: dialCode, phone_number: phoneNumber });
    },
    [form]
  );

  const setPhoneValue = useCallback(
    (phoneNumber: string) => {
      form.setFieldsValue({ phone_number: phoneNumber });
    },
    [form]
  );

  return (
    <div className={clsx("h-full w-full space-y-8", !isReview && "p-8")}>
      <HeaderTitle
        headerTitle="Proof of Identity"
        headerDescription="Upload your Passport/Drivers license to verify your details"
      />
      <Form
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        initialValues={{ dial_code: "+44", phone_number: "+44" }}
        labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
        <div className="grid grid-cols-2 items-start gap-6 gap-y-4 max-lg:grid-cols-1">
          <Form.Item name="nin" label="ID Number">
            <Input className="w-full" placeholder="Enter ID Number" />
          </Form.Item>
          <PhoneNumberInput
            dialCodeName="dial_code"
            name="phone_number"
            setFieldsValue={setFieldsValue}
            setPhoneValue={setPhoneValue}
            label="Attached Phone Number"
          />
        </div>

        <Upload
          file={frontImage}
          image="/images/preview.png"
          label="Upload your Passport/Drivers license (Front)"
          setFile={setFrontImage}
          key={1}
        />

        <Upload
          file={backImage}
          image="/images/back.png"
          label="Upload your Passport/Drivers license (Back)"
          setFile={setBackImage}
          key={2}
        />

        <div className="flex items-center gap-4">
          {!isReview && (
            <Button
              type="primary"
              htmlType="button"
              shape="round"
              onClick={back}
              className="w-48 bg-primary-50 text-base text-primary hover:bg-primary-100"
              size="large">
              Back
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            className="w-48 text-base"
            size="large">
            {isReview ? "Confirm" : "Save & Continue"}
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default memo(ProofOfIdentity);
