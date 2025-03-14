import { Button, Select, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  EyeIcon,
  RefreshCwIcon,
} from "lucide-react";
import { TableRowSelection } from "antd/es/table/interface";
import clsx from "clsx";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { useTransactionData } from "@/hooks/use-transaction-data";
import { TablePaginationConfig } from "antd/es/table";
import ReceiptModal, { ReceiptRefObject } from "../Transactions/ReceiptModal";

const Transactions = () => {
  const [selected, setSelected] = useState("Local");
  const modalRef = useRef<ReceiptRefObject>(null);

  const { data, isPending, currentPage, updatePage } =
    useTransactionData(selected);

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

  const getColumns = (): ColumnsType<any> => {
    const baseColumns: ColumnsType<any> = [
      {
        title: "Date & Time",
        dataIndex: "date",
        key: "date",
        className: "text-grey-500 text-sm",
        sorter: (a: any, b: any) => a.date.localeCompare(b.date),
        sortDirections: ["ascend", "descend"],
        render: (_: any, record: any) => (
          <Space>
            <div className="h-7 w-7 rounded-full grid place-items-center bg-primary-50 relative">
              <RefreshCwIcon className="h-4 w-4 text-primary" />
              {record.type?.toLowerCase() === "credit" ? (
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
        title: "Balance After",
        dataIndex: "balance_after",
        key: "balance_after",
        className: "text-grey-500 text-sm",
      },
      {
        title: "Status",
        dataIndex: "transaction_status",
        key: "transaction_status",
        render: (status: string) => (
          <Tag className={clsx(getStatusStyle(status))}>
            {status || "Completed"}
          </Tag>
        ),
      },
    ];

    // Add conditional column - either Beneficiary or Currency Pair
    if (selected === "Conversion") {
      baseColumns.splice(2, 0, {
        title: "Currency pair",
        dataIndex: "currency_pair",
        key: "currency_pair",
        className: "text-grey-500 text-sm",
      });
    } else {
      baseColumns.splice(2, 0, {
        title: "Beneficiary",
        dataIndex: "beneficiary_name",
        key: "beneficiary_name",
        className: "text-grey-700 text-sm",
      });
    }

    // Only add the Action column for Local and International
    if (selected !== "Conversion") {
      baseColumns.push({
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Button
            type="text"
            icon={<EyeIcon className="w-4 h-4 text-grey-500" />}
            className="text-grey-500"
            onClick={() =>
              modalRef.current?.openModal(record as HM.Transaction)
            }>
            View
          </Button>
        ),
      });
    }

    return baseColumns;
  };

  const rowSelection: TableRowSelection<any> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) {
      updatePage(pagination.current);
    }
  };

  return (
    <section className="space-y-4">
      <div className="w-full flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
        <Space size="large">
          <h5 className="text-grey-600 font-medium text-base">
            Recent Transactions
          </h5>
          <Select
            placeholder="Select option"
            value={selected}
            onChange={setSelected}
            className="w-36 bg-gray-50"
            options={["Local", "International", "Conversion"].map(v => ({
              label: v,
              value: v,
            }))}
          />
        </Space>
        <Space>
          <Link to="/transactions">
            <Button
              type="primary"
              icon={<ArrowRightIcon className="h-4 w-4 text-grey-500" />}
              className="text-sm font-medium text-grey-500 bg-gray-50 border-grey-200">
              View All
            </Button>
          </Link>
        </Space>
      </div>

      <div>
        <Table
          dataSource={data}
          columns={getColumns()}
          rowSelection={rowSelection}
          loading={isPending}
          pagination={{ current: currentPage }}
          onChange={handleTableChange}
          components={{
            header: {
              cell: (props: any) => (
                <th {...props} className="text-grey-500 font-medium text-xs" />
              ),
            },
          }}
        />
      </div>
      {selected !== "Conversion" && <ReceiptModal ref={modalRef} />}
    </section>
  );
};

export default Transactions;
