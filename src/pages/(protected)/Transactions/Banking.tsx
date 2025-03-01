import { TRANSACTIONS_TABLE_FILTER } from "@/constants/filter";
import transactions from "@/data/banking.json";
import { Button, Tag, Table, Space, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import clsx from "clsx";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  CloudDownloadIcon,
  ListFilter,
  XIcon,
} from "lucide-react";
import { useState } from "react";

const Banking = () => {
  const [show, setShow] = useState(false);

  const columns: ColumnsType<(typeof transactions)[0]> = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      sortDirections: ["ascend", "descend"],
      width: "20%",
      render: (_, record) => (
        <Space>
          <div
            className={clsx(
              "h-7 w-7  rounded-full grid place-items-center",
              { " bg-negative-50": record.type === "transfer" },
              { "bg-positive-50": record.type !== "transfer" }
            )}>
            {record.type === "transfer" ? (
              <ArrowUpIcon className="h-4 w-4 text-negative" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-positive" />
            )}
          </div>
          <span className="text-grey-700 text-sm">{record.customer}</span>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Date & Time",
      dataIndex: "date_time",
      key: "date_time",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: status => (
        <Tag
          className={clsx(
            "text-sm rounded-md",
            status === "successful"
              ? "text-positive bg-positive-50"
              : "text-negative bg-negative-50"
          )}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Actions",
      key: "download",
      render: () => (
        <Button
          type="text"
          icon={<CloudDownloadIcon className="w-4 h-4 text-grey-500" />}
        />
      ),
    },
    {
      key: "view",
      render: () => (
        <Button
          type="text"
          className="text-grey-500"
          icon={<ArrowUpRightIcon className="h-4 w-4 text-grey-500" />}>
          View
        </Button>
      ),
    },
  ];

  const rowSelection: TableRowSelection<(typeof transactions)[0]> = {
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
          Recent Transactions
        </h5>
        <Button
          type="primary"
          icon={<ListFilter className="h-4 w-4 text-grey-500" />}
          className="text-sm font-medium text-grey-500 bg-gray-50 border-grey-200"
          onClick={() => setShow(true)}>
          Filter
        </Button>
      </div>

      <div>
        <Table
          dataSource={transactions}
          columns={columns}
          rowSelection={rowSelection}
          onChange={(_pagination, _filters, sorter) => {
            console.log("Table changed:", sorter);
          }}
          components={{
            header: {
              cell: (props: any) => (
                <th {...props} className="text-grey-500 font-medium text-xs" />
              ),
            },
          }}
        />
      </div>
    </section>
  );
};

export default Banking;
