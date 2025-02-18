import { useOnboardingContext } from "@/contexts/onboarding";
import PublicListedCompanyUpload from "./PublicListedCompany";
import LimitedCompanyUpload from "./LimitedCompany";
import LimitedLiabilityPartnershipUpload from "./LimitedLiabilityPartnership";

const AddDocuments = ({ next }: { next: () => void }) => {
  const { businessType } = useOnboardingContext();

  if (businessType === "limited_company") {
    return <LimitedCompanyUpload next={next} />;
  }

  if (businessType === "public_limited_company") {
    return <PublicListedCompanyUpload next={next} />;
  }

  if (businessType === "limited_liability_partnership") {
    return <LimitedLiabilityPartnershipUpload next={next} />;
  }

  return null;
};

export default AddDocuments;
