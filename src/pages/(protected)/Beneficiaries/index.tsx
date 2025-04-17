import { Button, message, Table, TableProps } from "antd";
import countries from "@/data/codes.json";
import { useCallback, useEffect, useRef, useState } from "react";
import ENDPOINTS from "@/constants/endpoints";
import { TrashIcon } from "lucide-react";
import BeneficiariesFilter from "./BeneficiariesFilter";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import BeneficiaryDeleteModal, {
  BeneficiariesDeleteRefObject,
} from "./BeneficiaryDeleteModal";

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
  const [tableState, setTableState] =
    useState<HM.TableState<HM.UserBeneficiary>>();

  const mutation = useSharedMutationAction<{
    beneficiary: { data: HM.UserBeneficiary[] };
    pagination: HM.Pagination;
  }>({
    url: ENDPOINTS.FETCH_BENEFICIARIES,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const modalRef = useRef<BeneficiariesDeleteRefObject>(null);

  const handleFetchBeneficiaries = useCallback(async () => {
    await mutation.mutateAsync({
      row_per_page: 15,
      page: tableState?.pagination?.current || 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState?.pagination?.current]);

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
      className: "text-grey-500 text-sm",
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
      render: (type: string) => (
        <span className="text-grey-500 text-sm">
          {type.toLowerCase() === "business" ? "Business" : "Individual"}
        </span>
      ),
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
      className: "text-grey-500 text-sm",
    },
    {
      title: "Action",
      key: "action",
      className: "text-grey-500 text-sm",
      render: (_, record) => (
        <Button
          type="text"
          icon={<TrashIcon className="h-4 w-4 text-grey-500" />}
          onClick={() => modalRef.current?.openModal(record)}
          className="text-grey-500">
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    handleFetchBeneficiaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState?.pagination?.current]);

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
            current: tableState?.pagination?.current || 1,
            pageSize: 15,
            total: mutation?.data?.pagination
              ? mutation?.data?.pagination?.total_record
              : 0,
            showSizeChanger: false,
            showQuickJumper: false,
          }}
          onChange={(pagination, filters, sorter, extra) => {
            setTableState({ pagination, filters, sorter, extra });
          }}
        />
      </div>
      <BeneficiaryDeleteModal
        ref={modalRef}
        refetch={handleFetchBeneficiaries}
      />
    </section>
  );
};

export const Component = BeneficiariesPage;

export default BeneficiariesPage;
