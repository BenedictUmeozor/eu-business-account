import { Button, Card, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  CloudDownloadIcon,
  ListFilter,
} from "lucide-react";
import transactions from "@/data/transactions.json";
import { TableRowSelection } from "antd/es/table/interface";
import clsx from "clsx";

interface Transaction {
  customer: string;
  type: string;
  transaction_id: string;
  date_time: string;
  status: string;
  amount: string;
}

const Transactions = () => {
  const columns: ColumnsType<Transaction> = [
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
        <Tag className="text-sm text-positive bg-positive-50 rounded-md">
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

  const rowSelection: TableRowSelection<Transaction> = {
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
      <Card>
        <div className="w-full flex items-center justify-between">
          <h5 className="text-grey-600 font-medium text-base">
            Recent Transactions
          </h5>
          <Button
            type="primary"
            icon={<ListFilter className="h-4 w-4 text-grey-500" />}
            className="text-sm font-medium text-grey-500 bg-gray-50 border-grey-200">
            Filter
          </Button>
        </div>
      </Card>
      <div>
        <Table
          dataSource={transactions}
          columns={columns}
          rowSelection={rowSelection}
          onChange={(pagination, filters, sorter) => {
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
export default Transactions;
