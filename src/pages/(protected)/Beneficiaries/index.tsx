import { Tabs, TabsProps } from "antd";
import Local from "./Local";
import International from "./International";

const BeneficiariesPage = () => {
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
  ];

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-medium text-grey-600">Beneficiaries</h2>
      <Tabs items={tabs} />
    </section>
  );
};

export const Component = BeneficiariesPage;

export default BeneficiariesPage;
