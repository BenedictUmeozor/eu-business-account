import useBusinessDetails from "@/hooks/use-business-details";
import useBusinessDocumentTypes from "@/hooks/use-business-document-types";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/app/Loader";
import { useAppSelector } from "@/hooks";
import HeaderTitle from "@/components/ui/HeaderTitle";
import { Button, Card, Space } from "antd";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "lucide-react";
import UploadForm from "./UploadForm";
import useUploadedBusinessDocuments from "@/hooks/use-uploaded-business-documents";
import clsx from "clsx";

const AddDocuments = ({ next }: { next: () => void }) => {
  const session = useAppSelector(state => state.session);
  const [selectedDocument, setSelectedDocument] = useState<HM.DocumentType>();
  const { businessDetails, isLoading } = useBusinessDetails(
    session?.user?.email
  );
  const { businessDocumentTypes, fetch, loading } = useBusinessDocumentTypes();
  const { fetchUploadedDocs, uploadedDocuments } =
    useUploadedBusinessDocuments();

  const isLoadingCombined = useMemo(
    () => isLoading || loading,
    [isLoading, loading]
  );

  const onSuccessfulUpload = () => {
    setSelectedDocument(undefined);
    fetchUploadedDocs();
  };

  const isUploaded = (code: string) => {
    return uploadedDocuments.some(doc => doc.document_type === code);
  };

  const openForm = (doc: HM.DocumentType) => {
    if (isUploaded(doc.code)) return;
    setSelectedDocument(doc);
  };

  const allUploaded = useMemo(() => {
    if (!businessDocumentTypes?.length || !uploadedDocuments?.length) {
      return false;
    }

    return businessDocumentTypes.every(docType =>
      uploadedDocuments.some(doc => doc.document_type === docType.code)
    );
  }, [businessDocumentTypes, uploadedDocuments]);

  useEffect(() => {
    if (businessDetails?.business_type) {
      fetch(businessDetails?.business_type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessDetails]);

  if (selectedDocument) {
    return (
      <UploadForm
        back={() => setSelectedDocument(undefined)}
        document={selectedDocument}
        onSuccessfulUpload={onSuccessfulUpload}
      />
    );
  }

  return (
    <div className="h-full w-full space-y-8 p-8">
      <HeaderTitle
        headerTitle="Documents Upload"
        headerDescription="Upload the required business documents"
      />
      {isLoadingCombined && <Loader />}
      <div className="space-y-6">
        {businessDocumentTypes?.map(doc => (
          <Card
            key={doc.code}
            size="small"
            role="button"
            onClick={() => openForm(doc)}
            className={clsx(
              "cursor-pointer transition-all duration-100 ease-linear hover:bg-grey-50",
              isUploaded(doc.code) && "bg-grey-50"
            )}>
            <div className="flex items-center justify-between">
              <Space>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50">
                  <IdentificationIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium text-grey-700">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-grey-500">
                    Upload a valid document with respect to the above
                  </p>
                </div>
              </Space>
              {isUploaded(doc.code) && (
                <div className="flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-positive" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      {allUploaded && (
        <Button
          type="primary"
          className="w-48"
          shape="round"
          size="large"
          onClick={next}
          disabled={!allUploaded}>
          Next
        </Button>
      )}
    </div>
  );
};

export default AddDocuments;
