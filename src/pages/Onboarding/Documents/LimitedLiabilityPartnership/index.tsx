import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button, Card, Space } from "antd";
import {
  IdentificationIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import CertificateUpload from "./CertificateUpload";
import PartnershipAgreementUpload from "./PartnershipAgreementUpload";
import CorporateStructureChart from "./CorporateStructureChart";
import AuditedFinancialStatements from "./AuditedFinancialStatements";
import SourceOfWealth from "./SourceOfWealth";
import HeaderTitle from "@/components/ui/HeaderTitle";

const DOCUMENTS = [
  {
    title: "Certificate of Registration/ Incorporation",
    description: "Upload incorporation document",
    slug: "certificate-of-registration-incorporation",
  },
  {
    title:
      "Partnership Agreement for voting rights held by the Partners / Ultimate Individual Owners",
    description: "Upload a valid document with respect to the above",
    slug: "partnership-agreement-voting-rights",
  },
  {
    title:
      "Dated and Signed Corporate Structure chart of Company Ownership and Control Structure",
    description: "Upload a valid document with respect to the above",
    slug: "corporate-structure-chart",
  },
  {
    title: "Audited Financial Statements for the Last Three(3) Years",
    description: "Upload a valid document with respect to the above",
    slug: "audited-financial-statements",
  },
  {
    title: "Supporting documentation for Source of Wealth",
    description: "Upload a valid document with respect to the above",
    slug: "supporting-documentation-source-of-wealth",
  },
];

type DocumentSlug =
  | "certificate-of-registration-incorporation"
  | "partnership-agreement-voting-rights"
  | "corporate-structure-chart"
  | "audited-financial-statements"
  | "supporting-documentation-source-of-wealth"
  | undefined;

interface DocumentState {
  [key: string]: boolean;
}

const LimitedLiabilityPartnershipUpload = ({ next }: { next: () => void }) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentSlug>();
  const ref = useRef<HTMLDivElement>(null);
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

  const updateState = useCallback((slug: string) => {
    setDocumentState(prev => ({ ...prev, [slug]: true }));
    setSelectedDocument(undefined);
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [updateState]);

  const uploadDone = useMemo(
    () => Object.values(documentState).every(Boolean),
    [documentState]
  );

  if (selectedDocument === "certificate-of-registration-incorporation") {
    return (
      <CertificateUpload
        back={back}
        next={() => updateState("certificate-of-registration-incorporation")}
      />
    );
  }

  if (selectedDocument === "partnership-agreement-voting-rights") {
    return (
      <PartnershipAgreementUpload
        back={back}
        next={() => updateState("partnership-agreement-voting-rights")}
      />
    );
  }

  if (selectedDocument === "corporate-structure-chart") {
    return (
      <CorporateStructureChart
        back={back}
        next={() => updateState("corporate-structure-chart")}
      />
    );
  }

  if (selectedDocument === "audited-financial-statements") {
    return (
      <AuditedFinancialStatements
        back={back}
        next={() => updateState("audited-financial-statements")}
      />
    );
  }

  if (selectedDocument === "supporting-documentation-source-of-wealth") {
    return (
      <SourceOfWealth
        back={back}
        next={() => updateState("supporting-documentation-source-of-wealth")}
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

export default LimitedLiabilityPartnershipUpload;
