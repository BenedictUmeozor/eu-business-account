import { Alert, Button, Form, FormProps, Input, message } from "antd";
import { memo, useEffect, useRef, useState } from "react";
import Upload from "@/components/ui/Upload";
import HeaderTitle from "@/components/ui/HeaderTitle";
import clsx from "clsx";
import useMutationAction from "@/hooks/use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import usePersonalDetails from "@/hooks/use-personal-details";
import Loader from "@/components/app/Loader";

interface FormValues {
  identification_number: string;
}

const ProofOfIdentity = ({
  next,
  back,
  isReview,
}: {
  next: () => void;
  back: () => void;
  isReview?: boolean;
}) => {
  const [form] = Form.useForm<FormValues>();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [showImageError, setShowImageError] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { personalDetails, isLoading } = usePersonalDetails();

  const mutation = useMutationAction<HM.QueryResponse>({
    url: ENDPOINTS.UPLOAD_PROOF_OF_IDENTIFICATION,
    onSuccess: data => {
      message.success(data.message);
      next();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
    invalidateQueries: ["personal_details"]
  });

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    if (isReview) {
      next();
      return;
    }

    if (!frontImage || !backImage) {
      setShowImageError(true);
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const formData = new FormData();
    formData.append("file[]", frontImage);
    formData.append("file[]", backImage);
    formData.append("identification_number", values.identification_number);
    formData.append("document_type", "PP");
    mutation.mutate(formData);
  };

  useEffect(() => {
    if (frontImage && backImage && showImageError) {
      setShowImageError(false);
    }
  }, [frontImage, backImage, showImageError]);

  useEffect(() => {
    if (personalDetails?.document?.data?.[0]?.id_number) {
      form.setFieldsValue({
        identification_number: personalDetails?.document?.data?.[0]?.id_number,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalDetails]);

  return (
    <div
      className={clsx("h-full w-full space-y-8", !isReview && "p-8")}
      ref={formRef}>
      <HeaderTitle
        headerTitle="Proof of Identity"
        headerDescription="Upload your Passport/Drivers license to verify your details"
      />
      {isLoading && <Loader />}
      {showImageError && (
        <Alert
          message="Please upload both front and back images of your identification document."
          type="error"
          showIcon
          className="mb-4"
          closable
          onClose={() => setShowImageError(false)}
        />
      )}
      {isReview && (
        <Alert message="Review only" type="info" showIcon className="mb-4" />
      )}
      <Form
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
        <div className="grid grid-cols-2 items-start gap-6 gap-y-4 max-lg:grid-cols-1">
          <Form.Item name="identification_number" label="ID Number">
            <Input className="w-full" placeholder="Enter ID Number" />
          </Form.Item>
        </div>

        <Upload
          file={frontImage}
          image="/images/preview.png"
          label="Upload your Passport/Drivers license (Front)"
          setFile={setFrontImage}
          key={1}
          existingDocumentUrl={personalDetails?.document?.data?.[0].filepath}
        />

        <Upload
          file={backImage}
          image="/images/back.png"
          label="Upload your Passport/Drivers license (Back)"
          setFile={setBackImage}
          existingDocumentUrl={personalDetails?.document?.data?.[1].filepath}
          key={2}
        />

        <div className="flex items-center gap-4">
          {!isReview && (
            <Button
              type="primary"
              htmlType="button"
              shape="round"
              disabled={mutation.isPending}
              onClick={back}
              className="w-48 bg-primary-50 text-base text-primary hover:bg-primary-100"
              size="large">
              Back
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
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
