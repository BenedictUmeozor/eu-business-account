import HeaderTitle from "@/components/ui/HeaderTitle";
import Upload from "@/components/ui/Upload";
import ENDPOINTS from "@/constants/endpoints";
import useMutationAction from "@/hooks/use-mutation-action";
import { getErrorMessage } from "@/utils";
import { Button, Form, message, Alert } from "antd";
import { memo, useEffect, useRef, useState } from "react";

const UploadForm = ({
  document,
  back,
  onSuccessfulUpload,
}: {
  document: HM.DocumentType;
  back: () => void;
  onSuccessfulUpload: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const mutation = useMutationAction<HM.QueryResponse>({
    url: ENDPOINTS.UPLOAD_BUSINESS_DOCUMENT,
    mutationKey: ["upload_business_document", document.code],
    onSuccess: data => {
      message.success(data.message);
      setFile(null);
      setFileError(null);
      onSuccessfulUpload();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish = () => {
    if (!file) return setFileError("Please upload a file");

    setFileError(null);
    const formData = new FormData();
    formData.append("document_type", document.code);
    formData.append("document_name", document.name);
    formData.append("file", file);
    mutation.mutate(formData);
  };

  useEffect(() => {
    if (fileError) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [fileError]);

  useEffect(() => {
    ref?.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    if (file) {
      setFileError(null);
    }
  }, [fileError, file]);

  return (
    <div className="h-full w-full space-y-8 p-8" ref={ref}>
      <HeaderTitle
        headerDescription="Upload a valid document with respect to the above"
        headerTitle={document.name}
      />
      {fileError && (
        <Alert
          message={fileError}
          type="error"
          showIcon
          className="mb-4"
          closable
          onClose={() => setFileError(null)}
        />
      )}
      <Form
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
        labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
        <Upload
          file={file}
          setFile={setFile}
          image="/images/doc.png"
          label={`Upload ${document.name}`}
          className="w-48"
        />
        <div className="flex items-center gap-4">
          <Button
            type="primary"
            htmlType="button"
            shape="round"
            onClick={back}
            disabled={mutation.isPending}
            className="w-48 bg-primary-50 text-base text-primary hover:bg-primary-100"
            size="large">
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            className="w-48 text-base"
            loading={mutation.isPending}
            size="large">
            Save & Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default memo(UploadForm);
