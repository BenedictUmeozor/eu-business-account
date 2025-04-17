import { Button, Table, TableProps } from "antd";
// import BeneficiariesFilter from "./BeneficiariesFilter";
import data from "./data.json";
import { TrashIcon } from "lucide-react";

const Local = () => {
  const columns: TableProps<(typeof data)[0]>["columns"] = [
    {
      title: "Names",
      dataIndex: "name",
      key: "name",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Last Amount Paid",
      dataIndex: "lastAmountPaid",
      key: "lastAmountPaid",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Last Date Paid",
      dataIndex: "lastDatePaid",
      key: "lastDatePaid",
      className: "text-grey-500 text-sm",
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

  return (
    <>
      {/* <BeneficiariesFilter /> */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="name"
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
      />
    </>
  );
};

export default Local;
