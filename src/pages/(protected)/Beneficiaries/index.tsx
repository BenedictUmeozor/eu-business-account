import { Button, message, Table, TableProps } from "antd";
import countries from "@/data/codes.json";
import { useCallback, useEffect } from "react";
import ENDPOINTS from "@/constants/endpoints";
import { TrashIcon } from "lucide-react";
import BeneficiariesFilter from "./BeneficiariesFilter";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";

const BeneficiariesPage = () => {
  // const tabs: TabsProps["items"] = [
  //   {
  //     key: "1",
  //     label: "Local",
  //     children: <Local />,
  //   },
  //   {
  //     key: "2",
  //     label: "International",
  //     children: <International />,
  //   },
  // ];

  const mutation = useSharedMutationAction<{
    beneficiary: { data: HM.UserBeneficiary[] };
  }>({
    url: ENDPOINTS.FETCH_BENEFICIARIES,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const getCountryByCode = useCallback((code: string) => {
    return (
      countries.find(country => country.countryCode === code)?.countryName ||
      code
    );
  }, []);

  const columns: TableProps<HM.UserBeneficiary>["columns"] = [
    {
      title: "Names",
      dataIndex: "beneficiary_name",
      key: "beneficiary_name",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Acc. No/IBAN",
      dataIndex: "account_number",
      key: "account_number",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country: string) => (
        <div className="flex items-center gap-2">
          <img
            src={ENDPOINTS.FLAG_URL(country?.toLowerCase() || "")}
            alt={country}
            className="h-5 w-5 rounded-full"
          />
          <span className="text-grey-500 text-sm">
            {getCountryByCode(country)}
          </span>
        </div>
      ),
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Type",
      dataIndex: "beneficiary_type",
      key: "beneficiary_type",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Category",
      dataIndex: "beneficiary_category",
      key: "beneficiary_category",
      render: (category: string) => (
        <span className="text-grey-500 text-sm">
          {category.toLowerCase() === "banking" ? "Local" : "International"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      className: "text-grey-500 text-sm",
      render: () => (
        <Button
          type="text"
          icon={<TrashIcon className="h-4 w-4 text-grey-500" />}
          className="text-grey-500">
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    mutation.mutate({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-medium text-grey-600">Beneficiaries</h2>
      {/* <Tabs items={tabs} /> */}
      <div>
        <BeneficiariesFilter />
        <Table
          columns={columns}
          dataSource={mutation.data?.beneficiary.data}
          rowKey="name"
          loading={mutation.isPending}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
          }}
        />
      </div>
    </section>
  );
};

export const Component = BeneficiariesPage;

export default BeneficiariesPage;
