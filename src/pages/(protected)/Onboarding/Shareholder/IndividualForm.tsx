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
  message,
  Radio,
  Select,
  Skeleton,
} from "antd";
import { useState, useEffect, useRef } from "react";
import countries from "@/data/codes.json";
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
  business_name: string;
  business_number: string;
  business_stake: string;
  business_role: string;
  authorized_signatory: string;
  document_type: string;
  political_exposed_person: string;
  position_held?: string;
  country_of_pep?: string;
  related_pep: string;
  name_of_pep?: string;
  relationship_with_pep?: string;
  political_position?: string;
  country_position_held?: string;
}

const IndividualForm = ({ removeForm }: { removeForm: () => void }) => {
  const [form] = Form.useForm<FormValues>();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>(
    "Identification document"
  );
  const [showImageError, setShowImageError] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [isPep, setIsPep] = useState(false);
  const [isRelatedPep, setIsRelatedPep] = useState(false);

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
      console.log("Uploading front image:", frontImage);
      const frontFormData = new FormData();
      frontFormData.append("file", frontImage as File);
      frontFormData.append("shareholder_token", data?.shareholder_token);
      frontFormData.append("document_type", selectedDocumentType);
      frontFormData.append("document_side", "Front");

      // Log FormData entries for debugging
      for (const pair of frontFormData.entries()) {
        console.log("Front FormData:", pair[0], pair[1]);
      }

      await imageMutation.mutateAsync(frontFormData);

      // Back image upload
      console.log("Uploading back image:", backImage);
      const backFormData = new FormData();
      backFormData.append("file", backImage as File);
      backFormData.append("shareholder_token", data?.shareholder_token);
      backFormData.append("document_type", selectedDocumentType);
      backFormData.append("document_side", "Back");

      // Log FormData entries for debugging
      for (const pair of backFormData.entries()) {
        console.log("Back FormData:", pair[0], pair[1]);
      }

      await imageMutation.mutateAsync(backFormData);

      // Successfully completed all uploads
      message.success("Shareholder and documents added successfully");
      removeForm();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    // Check if both images are uploaded
    if (!frontImage || !backImage) {
      setShowImageError(true);
      // Scroll to the top of the form
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Reset any previous error state
    setShowImageError(false);

    // Use lodash omit to remove document_type from values
    const formData = omit(
      { ...values, type: "Individual", business_role: "Shareholder" },
      "document_type"
    );

    // Pass the modified data to the mutation
    formMutation.mutate(formData);
  };

  // Update document name when selection changes
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
    // Also update form value
    form.setFieldValue("document_type", e.target.value);
  };

  // Handle PEP status change
  const handlePepChange = (e: any) => {
    setIsPep(e.target.value === "YES");
  };

  // Handle Related PEP status change
  const handleRelatedPepChange = (e: any) => {
    setIsRelatedPep(e.target.value === "YES");
  };

  // Reset error state when either image is uploaded
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
        className="space-y-2"
        labelCol={{ className: "text-sm text-grey-500 font-medium " }}>
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

          <Form.Item
            label="Is this a politically exposed person (PEP)?"
            name="political_exposed_person"
            rules={[{ required: true, message: "This field is required" }]}>
            <Radio.Group className="w-full" onChange={handlePepChange}>
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
            label="Political Exposure - Position Held"
            name="position_held"
            rules={[{ required: isPep, message: "This field is required when PEP is Yes" }]}>
            <Input className="w-full" placeholder="Enter Position" />
          </Form.Item>

          <Form.Item
            label="Country of political exposure"
            name="country_of_pep"
            rules={[{ required: isPep, message: "This field is required when PEP is Yes" }]}>
            <Select
              showSearch
              className="w-full"
              placeholder="Select country"
              dropdownStyle={{ minWidth: "200px" }}
              options={countries.map(c => ({
                label: (
                  <div className="flex items-center gap-2">
                    <img
                      src={c.flag}
                      alt={c.countryCode}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-grey-700">{c.countryName}</span>
                  </div>
                ),
                value: c.countryCode,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Is any family member or a close associate of this individual a politically exposed person (PEP)"
            name="related_pep"
            rules={[{ required: true, message: "This field is required" }]}>
            <Radio.Group className="w-full" onChange={handleRelatedPepChange}>
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
            label="Name of politically exposed person (PEP)"
            name="name_of_pep"
            rules={[{ required: isRelatedPep, message: "This field is required when related to a PEP" }]}>
            <Input className="w-full" placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="PEP Relationship with involved party"
            name="relationship_with_pep"
            rules={[{ required: isRelatedPep, message: "This field is required when related to a PEP" }]}>
            <Input className="w-full" placeholder="Enter Relationship" />
          </Form.Item>
          <Form.Item
            label="Political Exposure - Position Held"
            name="political_position">
            <Input className="w-full" placeholder="Enter Position" />
          </Form.Item>
          <Form.Item
            label="Country of political exposure"
            name="country_position_held">
            <Select
              showSearch
              className="w-full"
              placeholder="Select country"
              dropdownStyle={{ minWidth: "200px" }}
              options={countries.map(c => ({
                label: (
                  <div className="flex items-center gap-2">
                    <img
                      src={c.flag}
                      alt={c.countryCode}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-grey-700">{c.countryName}</span>
                  </div>
                ),
                value: c.countryCode,
              }))}
            />
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
export default IndividualForm;
