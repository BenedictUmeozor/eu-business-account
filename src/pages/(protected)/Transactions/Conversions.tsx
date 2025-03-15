import ENDPOINTS from "@/constants/endpoints";
import { TRANSACTIONS_TABLE_FILTER } from "@/constants/filter";
import useSharedQueryAction from "@/hooks/use-shared-query-action";
import { Button, Tag, Table, Select, Space } from "antd";
import type { TableProps } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import clsx from "clsx";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ListFilter,
  RefreshCwIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import ExportModalRef from "./ExportModalRef";

const Conversions = () => {
  const [show, setShow] = useState(false);
  const [tableState, setTableState] =
    useState<HM.TableState<HM.ConversionTransaction>>();

  const { data, isPending } = useSharedQueryAction<{
    transaction: { data: HM.ConversionTransaction[] };
  }>({
    url: ENDPOINTS.GET_CONVERSIONS(tableState?.pagination?.current),
    key: ["conversions", tableState?.pagination?.current],
  });

  const exportRef = useRef<HM.ModalRefObject>(null);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-pending-500 bg-pending-50";
      case "completed":
        return "text-positive bg-positive-50";
      case "declined":
        return "text-negative bg-negative-50";
      case "completedwitherrors":
        return "text-pending-700 bg-pending-50";
      default:
        return "text-positive bg-positive-50";
    }
  };

  const columns: TableProps<HM.ConversionTransaction>["columns"] = [
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      className: "text-grey-500 text-sm",
      sorter: (a, b) => a.date.localeCompare(b.date),
      sortDirections: ["ascend", "descend"],
      render: (_, record) => (
        <Space>
          <div className="h-7 w-7 rounded-full grid place-items-center bg-primary-50 relative">
            <RefreshCwIcon className="h-4 w-4 text-primary" />
            {record.type.toLowerCase() === "credit" ? (
              <div className="absolute -bottom-1 right-0 flex rounded-full w-4 h-4 bg-positive-50 items-center justify-center">
                <ArrowDownIcon className="h-3 w-3 text-positive" />
              </div>
            ) : (
              <div className="absolute -bottom-1 right-0 flex rounded-full w-4 h-4 bg-negative-50 items-center justify-center">
                <ArrowUpIcon className="h-3 w-3 text-negative" />
              </div>
            )}
          </div>
          <span className="text-grey-700 text-sm">{record.date}</span>
        </Space>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "reference",
      key: "reference",
      className: "text-grey-500 text-sm",
      render: () => "HLM33140001",
    },
    {
      title: "Currency pair",
      dataIndex: "currency_pair",
      key: "currency_pair",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Balance Before",
      dataIndex: "balance_before",
      key: "balance_before",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Balance after",
      dataIndex: "balance_after",
      key: "balance_after",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Status",
      dataIndex: "transaction_status",
      key: "transaction_status",
      render: status => (
        <Tag className={clsx(getStatusStyle(status))}>
          {status || "Completed"}
        </Tag>
      ),
    },
  ];

  const rowSelection: TableRowSelection<HM.ConversionTransaction> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <section className="space-y-4">
      {show && (
        <div className="w-full flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Select
              placeholder="Select"
              options={TRANSACTIONS_TABLE_FILTER.days}
              className="w-36"
            />
            <Select
              placeholder="Select"
              options={TRANSACTIONS_TABLE_FILTER.currency}
              className="w-36"
            />
            <Select
              placeholder="Select"
              options={TRANSACTIONS_TABLE_FILTER.status}
              className="w-36"
            />
          </div>
          <Button
            type="primary"
            icon={<XIcon className="w-4 h-4 text-grey-100" />}
            className="bg-grey-400 text-grey-100"
            onClick={() => setShow(false)}>
            Close
          </Button>
        </div>
      )}

      <div className="w-full flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
        <h5 className="text-grey-600 font-medium text-base">
          Recent Conversions
        </h5>
        <Space>
          <Button
            type="primary"
            onClick={() => exportRef.current?.openModal()}
            icon={<UploadIcon className="h-4 w-4 text-grey-500" />}
            className="text-sm font-medium text-grey-500 bg-gray-50 border-grey-200">
            Export
          </Button>

          <Button
            type="primary"
            icon={<ListFilter className="h-4 w-4 text-grey-500" />}
            className="text-sm font-medium text-grey-500 bg-gray-50 border-grey-200"
            onClick={() => setShow(true)}>
            Filter
          </Button>
        </Space>
      </div>
      <div>
        <Table
          dataSource={data?.transaction?.data || []}
          columns={columns}
          rowSelection={rowSelection}
          onChange={(pagination, filters, sorter, extra) => {
            setTableState({ pagination, filters, sorter, extra });
          }}
          loading={isPending}
          components={{
            header: {
              cell: (props: any) => (
                <th {...props} className="text-grey-500 font-medium text-xs" />
              ),
            },
          }}
        />
      </div>
      <ExportModalRef ref={exportRef} />
    </section>
  );
};

export default Conversions;
