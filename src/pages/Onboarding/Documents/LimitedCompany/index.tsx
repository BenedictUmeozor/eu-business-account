import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button, Card, Space } from "antd";
import {
  IdentificationIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import MemorandumUpload from "./MemorandumUpload";
import CertificateUpload from "./CertificateUpload";
import GoodStandingCertificateUpload from "./GoodStandingUpload";
import RegisterOfDirectorsUpload from "./RegisterOfDirectorsUpload";
import CorporateStructureChart from "./CorporateStructureChart";
import RegulatoryLicenseUpload from "./RegulatoryLicense";
import SourceOfWealth from "./SourceOfWealth";
import AuditedFinancialStatements from "./AuditedFinancialStatements";
import HeaderTitle from "@/components/ui/HeaderTitle";

const DOCUMENTS = [
  {
    title: "Certificate of Registration/ Incorporation",
    description: "Upload incorporation document",
    slug: "certificate-of-registration",
  },
  {
    title: "Memorandum & Article of Association",
    description: "Upload your Memorandum & Article of Association",
    slug: "memorandum-article-association",
  },
  {
    title: "Good Standing Certificate",
    description: "Upload certificate of Good standing",
    slug: "good-standing-certificate",
  },
  {
    title:
      "Current Register of Directors and Shareholders/Extract from the Registry of Companies",
    description: "Upload a valid document with respect to the above",
    slug: "register-of-directors-shareholders",
  },
  {
    title:
      "Dated and Signed Corporate Structure chart of Company Ownership and Control Structure",
    description: "Upload a valid document with respect to the above",
    slug: "corporate-structure-chart",
  },
  {
    title: "Relevant Regulatory License Held",
    description: "Upload a valid document with respect to the above",
    slug: "regulatory-license",
  },
  {
    title: "A Copy of the latest Audited Financial Statements",
    description: "Upload a valid document with respect to the above",
    slug: "audited-financial-statements",
  },
  {
    title: "Supporting Documentation for Source of Wealth and Source of Funds",
    description: "Upload a valid document with respect to the above",
    slug: "source-of-wealth-funds",
  },
];

type DocumentSlug =
  | "certificate-of-registration"
  | "memorandum-article-association"
  | "good-standing-certificate"
  | "register-of-directors-shareholders"
  | "corporate-structure-chart"
  | "regulatory-license"
  | "audited-financial-statements"
  | "source-of-wealth-funds"
  | undefined;

interface DocumentState {
  [key: string]: boolean;
}

const LimitedCompanyUpload = ({ next }: { next: () => void }) => {
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

  const uploadDone = useMemo(
    () => Object.values(documentState).every(Boolean),
    [documentState]
  );

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [updateState]);

  if (selectedDocument === "audited-financial-statements") {
    return (
      <AuditedFinancialStatements
        back={back}
        next={() => updateState("audited-financial-statements")}
      />
    );
  }

  if (selectedDocument === "source-of-wealth-funds") {
    return (
      <SourceOfWealth
        back={back}
        next={() => updateState("source-of-wealth-funds")}
      />
    );
  }

  if (selectedDocument === "regulatory-license") {
    return (
      <RegulatoryLicenseUpload
        back={back}
        next={() => updateState("regulatory-license")}
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

  if (selectedDocument === "register-of-directors-shareholders") {
    return (
      <RegisterOfDirectorsUpload
        back={back}
        next={() => updateState("register-of-directors-shareholders")}
      />
    );
  }

  if (selectedDocument === "good-standing-certificate") {
    return (
      <GoodStandingCertificateUpload
        back={back}
        next={() => updateState("good-standing-certificate")}
      />
    );
  }

  if (selectedDocument === "certificate-of-registration") {
    return (
      <CertificateUpload
        back={back}
        next={() => updateState("certificate-of-registration")}
      />
    );
  }

  if (selectedDocument === "memorandum-article-association") {
    return (
      <MemorandumUpload
        back={back}
        next={() => updateState("memorandum-article-association")}
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

export default LimitedCompanyUpload;
