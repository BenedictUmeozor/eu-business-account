import { TRANSACTIONS_TABLE_FILTER } from "@/constants/filter";
import transactions from "@/data/conversion.json";
import { Button, Tag, Table, Select, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import clsx from "clsx";
import { ListFilter, RefreshCwIcon, XIcon } from "lucide-react";
import { useState } from "react";

const Conversions = () => {
  const [show, setShow] = useState(false);

  const columns: ColumnsType<(typeof transactions)[0]> = [
    {
      title: "Currency Pair",
      dataIndex: "currency_pair",
      key: "currency_pair",
      sorter: (a, b) => a.currency_pair.localeCompare(b.currency_pair),
      sortDirections: ["ascend", "descend"],
      className: "text-grey-500 text-sm",
      render: (_, record) => (
        <Space>
          <div className="h-7 w-7  rounded-full grid place-items-center bg-primary-50">
            <RefreshCwIcon className="h-4 w-4 text-primary" />
          </div>
          <span className="text-grey-700 text-sm">{record.currency_pair}</span>
        </Space>
      ),
    },
    {
      title: "Amount Debited",
      dataIndex: "amount_debited",
      key: "amount_debited",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Amount Credited",
      dataIndex: "amount_credited",
      key: "amount_credited",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Balance Before",
      dataIndex: "balance_before",
      key: "balance_before",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Balance After",
      dataIndex: "balance_after",
      key: "balance_after",
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
            "!text-sm rounded-md",
            status === "Success"
              ? "text-positive bg-positive-50"
              : "text-negative bg-negative-50"
          )}>
          {status}
        </Tag>
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
          Recent Conversions
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

export default Conversions;
