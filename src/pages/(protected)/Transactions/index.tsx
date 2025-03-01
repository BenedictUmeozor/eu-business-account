import { Tabs, TabsProps } from "antd";
import Banking from "./Banking";
import Conversions from "./Conversions";
import Remittance from "./Remittance";

const TransactionsPage = () => {
  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Banking",
      children: <Banking />,
    },
    {
      key: "2",
      label: "Remittance",
      children: <Remittance />,
    },
    {
      key: "3",
      label: "Conversions",
      children: <Conversions />,
    },
  ];

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-medium text-grey-600">Transactions</h2>
      <Tabs items={tabs} />
    </section>
  );
};

export const Component = TransactionsPage;

export default TransactionsPage;
