import { Tabs, TabsProps } from "antd";
import Local from "./Local";
import Conversions from "./Conversions";
import International from "./International";

const TransactionsPage = () => {
  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Local",
      children: <Local />,
    },
    {
      key: "2",
      label: "International",
      children: <International />,
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
