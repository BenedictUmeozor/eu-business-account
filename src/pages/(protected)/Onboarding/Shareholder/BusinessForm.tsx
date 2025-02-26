import Upload from "@/components/ui/Upload";
import ENDPOINTS from "@/constants/endpoints";
import useDocumentTypes from "@/hooks/use-document-types";
import useMutationAction from "@/hooks/use-mutation-action";
import { getErrorMessage } from "@/utils";
import {
  Alert,
  Button,
  Divider,
  Form,
  FormProps,
  Input,
  Radio,
  message,
  Skeleton,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { omit } from "lodash";

interface FormValues {
  email: string;
  type: string;
  residential_address: string;
  business_address: string;
  region: string;
  postcode: string;
  business_name: string;
  business_number: string;
  business_stake: string;
  business_role: string;
  authorized_signatory: string;
  document_type: string;
}

const BusinessForm = ({ removeForm }: { removeForm: () => void }) => {
  const [form] = Form.useForm<FormValues>();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>(
    "Identification document"
  );
  const [showImageError, setShowImageError] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const { documentTypes, loading } = useDocumentTypes();

  const imageMutation = useMutationAction<unknown>({
    url: ENDPOINTS.UPLOAD_SHAREHOLDER_ID,
    method: "POST",
    mutationKey: ["upload-shareholder-id"],
    onSuccess: data => {
      console.log("image: ", data);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const formMutation = useMutationAction<{ shareholder_token: string }>({
    url: ENDPOINTS.ADD_SHAREHOLDER,
    method: "POST",
    mutationKey: ["add-shareholder"],
    invalidateQueries: ["get-shareholders"],
    onSuccess: async data => {
      console.log("shareholder: ", data);

      // Front image upload
      const frontFormData = new FormData();
      frontFormData.append("file", frontImage as File);
      frontFormData.append("shareholder_token", data?.shareholder_token);
      frontFormData.append("document_type", selectedDocumentType);
      frontFormData.append("document_side", "Front");

      await imageMutation.mutateAsync(frontFormData);

      // Back image upload
      const backFormData = new FormData();
      backFormData.append("file", backImage as File);
      backFormData.append("shareholder_token", data?.shareholder_token);
      backFormData.append("document_type", selectedDocumentType);
      backFormData.append("document_side", "Back");

      await imageMutation.mutateAsync(backFormData);

      message.success("Business shareholder and documents added successfully");
      removeForm();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    if (!frontImage || !backImage) {
      setShowImageError(true);
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setShowImageError(false);

    const formData = omit(
      { ...values, type: "Business", business_role: "Shareholder" },
      "document_type"
    );

    formMutation.mutate(formData);
  };

  useEffect(() => {
    if (selectedDocumentType && documentTypes.length) {
      const selected = documentTypes.find(
        doc => doc.code === selectedDocumentType
      );
      if (selected) {
        setDocumentName(selected.name);
      }
    }
  }, [selectedDocumentType, documentTypes]);

  const handleDocTypeChange = (e: any) => {
    setSelectedDocumentType(e.target.value);
    form.setFieldValue("document_type", e.target.value);
  };

  useEffect(() => {
    if (frontImage && backImage && showImageError) {
      setShowImageError(false);
    }
  }, [frontImage, backImage, showImageError]);

  return (
    <div ref={formRef}>
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
      <Form
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        className="space-y-4"
        labelCol={{ className: "text-sm text-grey-500 font-medium " }}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item
            label="Business Name"
            name="business_name"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input className="w-full" placeholder="Enter Business Name" />
          </Form.Item>
          <Form.Item
            label="Business Number"
            name="business_number"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input className="w-full" placeholder="Enter Business Number" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input
              className="w-full"
              type="email"
              placeholder="Enter Business Email"
            />
          </Form.Item>
          <Form.Item
            label="Post Code"
            name="postcode"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input className="w-full" placeholder="Enter Post Code" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item
            label="Business Address"
            name="business_address"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input className="w-full" placeholder="Enter Business Address" />
          </Form.Item>
          <Form.Item
            label="Region/State"
            name="region"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input className="w-full" placeholder="Enter Region/State" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item
            label="Add as a shareholder (owns over 25% of the business)?"
            name="business_stake"
            rules={[{ required: true, message: "This field is required" }]}>
            <Radio.Group className="w-full">
              <div className="grid grid-cols-2 gap-2">
                <Radio
                  value={"YES"}
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  Yes
                </Radio>
                <Radio
                  value={"NO"}
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  No
                </Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Appoint as authorized signatory?"
            name="authorized_signatory"
            rules={[{ required: true, message: "This field is required" }]}>
            <Radio.Group className="w-full">
              <div className="grid grid-cols-2 gap-2">
                <Radio
                  value={"YES"}
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  Yes
                </Radio>
                <Radio
                  value={"NO"}
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  No
                </Radio>
              </div>
            </Radio.Group>
          </Form.Item>
        </div>
        <Divider>
          <span className="font-medium text-gray-500">ID Card Upload</span>
        </Divider>
        <Form.Item
          name="document_type"
          label="Preferred Means of Identification"
          rules={[{ required: true, message: "This field is required" }]}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <Radio.Group
              className="w-full"
              onChange={handleDocTypeChange}
              value={selectedDocumentType}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {documentTypes.map(docType => (
                  <Radio
                    key={docType.code}
                    value={docType.code}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    {docType.name}
                  </Radio>
                ))}
              </div>
            </Radio.Group>
          )}
        </Form.Item>
        <Upload
          file={frontImage}
          image="/images/preview.png"
          label={`Upload your ${documentName} (Front)`}
          setFile={setFrontImage}
          key={1}
        />
        <Upload
          file={backImage}
          image="/images/back.png"
          label={`Upload your ${documentName} (Back)`}
          setFile={setBackImage}
          key={2}
        />

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          shape="round"
          loading={loading || formMutation.isPending || imageMutation.isPending}
          className="w-48">
          Save & Continue
        </Button>
      </Form>
    </div>
  );
};

export default BusinessForm;
