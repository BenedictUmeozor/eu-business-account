import ENDPOINTS from "@/constants/endpoints";
import { Skeleton } from "antd";
import { DotIcon } from "lucide-react";

const Beneficiary = ({ beneficiary }: { beneficiary?: HM.Beneficiary }) => {
  if (!beneficiary) {
    return <Skeleton />;
  }

  return (
    <div className="bg-primary-50/30 hover:bg-gray-50 px-3 py-3 rounded-xl cursor-pointer flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center h-9 w-9 bg-primary-300 rounded-full uppercase text-white">
          <span className="text-lg font-medium">
            {beneficiary?.type === "Personal"
              ? (beneficiary?.fname?.[0] ?? "") +
                (beneficiary?.lname?.[0] ?? "")
              : (beneficiary?.company_name?.[0] ?? "")}
          </span>
          <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-solid border-white absolute bottom-0 right-0">
            <img
              src={ENDPOINTS.FLAG_URL(
                beneficiary?.ben_country.toLowerCase() ?? "gb"
              )}
              alt="flag"
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-grey-600 font-medium">
            {beneficiary?.type === "Personal"
              ? `${beneficiary?.fname} ${beneficiary?.lname}`
              : beneficiary?.company_name}
          </p>
          <p className="text-sm text-grey-500 flex items-center gap-0.5">
            {beneficiary?.bank_name}
            <DotIcon className="w-5 h-5 text-grey-500" />
            {beneficiary?.account_number}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Beneficiary;
