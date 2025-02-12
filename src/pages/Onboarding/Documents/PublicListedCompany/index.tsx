import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button, Card, Space } from "antd";
import {
  IdentificationIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import EvidenceOfListingUpload from "./EvidenceOfListingUpload";
import HeaderTitle from "@/components/ui/HeaderTitle";

const DOCUMENTS = [
  {
    title: "Evidence of Listing on a reputable stock exchange",
    description: "Upload a valid document with respect to the above",
    slug: "evidence-of-listing-stock-exchange",
  },
];

type DocumentSlug = "evidence-of-listing-stock-exchange" | undefined;

interface DocumentState {
  [key: string]: boolean;
}

const PublicListedCompanyUpload = ({ next }: { next: () => void }) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentSlug>();
  const [documentState, setDocumentState] = useState<DocumentState>(() =>
    DOCUMENTS.reduce(
      (acc, doc) => ({
        ...acc,
        [doc.slug]: false,
      }),
      {}
    )
  );

  const back = useCallback(() => setSelectedDocument(undefined), []);
  const ref = useRef<HTMLDivElement>(null);

  const updateState = useCallback((slug: string) => {
    setDocumentState(prev => ({ ...prev, [slug]: true }));
    setSelectedDocument(undefined);
  }, []);

  const uploadDone = useMemo(
    () => Object.values(documentState).every(Boolean),
    [documentState]
  );

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedDocument]);

  if (selectedDocument === "evidence-of-listing-stock-exchange") {
    return (
      <EvidenceOfListingUpload
        back={back}
        next={() => updateState("evidence-of-listing-stock-exchange")}
      />
    );
  }

  return (
    <div className="h-full w-full space-y-8 p-8" ref={ref}>
      <HeaderTitle
        headerTitle="Documents Upload"
        headerDescription="Upload the required business documents"
      />
      <div className="space-y-6">
        {DOCUMENTS.map(doc => (
          <Card
            key={doc.slug}
            size="small"
            role="button"
            onClick={() => setSelectedDocument(doc.slug as DocumentSlug)}
            className="cursor-pointer transition-all duration-100 ease-linear hover:bg-grey-50">
            <Space align="center" size="large">
              <Space>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50">
                  <IdentificationIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium text-grey-700">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-grey-500">{doc.description}</p>
                </div>
              </Space>
              {documentState[doc.slug] && (
                <div className="flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-positive" />
                </div>
              )}
            </Space>
          </Card>
        ))}
      </div>
      {uploadDone && (
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={next}
          className="w-48 text-base">
          Next
        </Button>
      )}
    </div>
  );
};

export default PublicListedCompanyUpload;
