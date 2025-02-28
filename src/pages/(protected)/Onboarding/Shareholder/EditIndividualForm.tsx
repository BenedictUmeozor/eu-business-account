import Upload from "@/components/ui/Upload";
import useDocumentTypes from "@/hooks/use-document-types";
import useEditShareholder from "@/hooks/use-edit-shareholder";
import {
  Alert,
  Button,
  Divider,
  Form,
  FormProps,
  Input,
  Radio,
  Skeleton,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { omit } from "lodash";

interface FormValues {
  fname: string;
  lname: string;
  email: string;
  type: string;
  residential_address: string;
  business_address: string;
  region: string;
  postcode: string;
  business_stake: string;
  business_role: string;
  authorized_signatory: string;
  document_type: string;
  shareholder_token: string;
}

const EditIndividualForm = ({
  shareholder,
  onClose,
}: {
  shareholder: HM.Shareholder;
  onClose: () => void;
}) => {
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
  const { editShareholder, isLoading } = useEditShareholder({
    onSuccess: onClose,
    shareholder_token: shareholder.shareholder_token,
  });

  const onFinish: FormProps<FormValues>["onFinish"] = async values => {
    // Only require new images if no existing documents
    if (!shareholder.documents && (!frontImage || !backImage)) {
      setShowImageError(true);
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setShowImageError(false);

    const formData = omit(
      {
        ...values,
        type: "Individual",
        business_role: "Shareholder",
        shareholder_token: shareholder.shareholder_token,
      },
      "document_type"
    );

    await editShareholder(
      formData,
      frontImage,
      backImage,
      selectedDocumentType
    );
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
    if ((frontImage && backImage) || shareholder.documents) {
      setShowImageError(false);
    }
  }, [frontImage, backImage, shareholder.documents]);

  // Set initial form values and document information
  useEffect(() => {
    form.setFieldsValue({
      fname: shareholder.fname,
      lname: shareholder.lname,
      email: shareholder.email,
      residential_address: shareholder.residential_address,
      region: shareholder.region,
      postcode: shareholder.postcode,
      business_stake:
        shareholder.shareholding_percentage === "YES" ? "YES" : "NO",
      authorized_signatory: shareholder.authorized_signatory,
      business_role: "Shareholder",
    });

    // Initialize document type and name only if documents exist
    if (shareholder.documents?.data?.length > 0) {
      const firstDoc = shareholder.documents.data[0];
      setSelectedDocumentType(firstDoc.document_type);
      setDocumentName(firstDoc.document_name);
      form.setFieldValue("document_type", firstDoc.document_type);
    }
    //eslint-disable-next-line
  }, [shareholder]);

  // Get front and back document URLs with type safety
  const frontDocumentUrl = shareholder.documents?.data?.find(
    doc => doc.side === "Front"
  )?.filepath;
  const backDocumentUrl = shareholder.documents?.data?.find(
    doc => doc.side === "Back"
  )?.filepath;

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
        className="space-y-2"
        labelCol={{ className: "text-sm text-grey-500 font-medium" }}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item
            label="First Name"
            name="fname"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input className="w-full" placeholder="Enter First Name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lname"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input className="w-full" placeholder="Enter Last Name" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input
              type="email"
              className="w-full"
              placeholder="Enter Email Address"
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
            label="Residential Address"
            name="residential_address"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input
              type="text"
              className="w-full"
              placeholder="Enter Residential Address"
            />
          </Form.Item>
          <Form.Item
            label="Region/State"
            name="region"
            rules={[{ required: true, message: "This field is required" }]}>
            <Input className="w-full" placeholder="Enter State" />
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
                  value="YES"
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  Yes
                </Radio>
                <Radio
                  value="NO"
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
                  value="YES"
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  Yes
                </Radio>
                <Radio
                  value="NO"
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
          existingDocumentUrl={frontDocumentUrl}
          key={1}
        />
        <Upload
          file={backImage}
          image="/images/back.png"
          label={`Upload your ${documentName} (Back)`}
          setFile={setBackImage}
          existingDocumentUrl={backDocumentUrl}
          key={2}
        />

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          shape="round"
          loading={loading || isLoading}
          className="w-48">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default EditIndividualForm;
