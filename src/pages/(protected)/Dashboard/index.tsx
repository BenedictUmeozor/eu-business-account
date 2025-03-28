import { Button, Card, Skeleton, Tabs, TabsProps } from "antd";
import { useMemo, useRef } from "react";
import Transactions from "./Transactions";
import AssetLineChart from "./LineChart";
import { useAppSelector } from "@/hooks";
import { useAccountContext } from "@/contexts/account";
import { PlusIcon } from "lucide-react";
import NoAccountTab from "./NoAccountTab";
import AddAccountModal from "@/components/global/AddAccountModal";
import ClientAccount from "./ClientAccount";

const Dashboard = () => {
  const accounts = useAppSelector(state => state.accounts.accounts);
  const { accountsLoading } = useAccountContext();

  const modalRef = useRef<HM.ModalRefObject>(null);

  const tabItems = useMemo(() => {
    const items: TabsProps["items"] =
      accounts?.map((account, index) => ({
        key: `${index + 1}`,
        label: account.currency,
        children: <ClientAccount account={account} />,
      })) || [];

    if (!accounts?.length) {
      return [
        {
          key: "1",
          label: "Pending Account",
          children: <NoAccountTab />,
        },
      ];
    }

    return items;
  }, [accounts]);
  // const tabItems = useMemo(() => {
  //   const items: TabsProps["items"] =
  //     currencies?.map((currency, index) => ({
  //       key: `${index + 1}`,
  //       label: currency,
  //       children: <AccountTab currency={currency} />,
  //     })) || [];

  //   if (!currencies?.length) {
  //     return [
  //       {
  //         key: "1",
  //         label: "Pending Account",
  //         children: <NoAccountTab />,
  //       },
  //     ];
  //   }

  //   return items;
  // }, [currencies]);

  return (
    <section className="space-y-6">
      {accountsLoading ? (
        <Skeleton active />
      ) : (
        <Tabs
          items={tabItems}
          defaultActiveKey="1"
          tabBarExtraContent={
            <Button
              type="text"
              className="text-primary"
              onClick={() => modalRef.current?.openModal()}
              icon={<PlusIcon className="w-4 h-4 text-primary" />}>
              Add Account
            </Button>
          }
        />
      )}
      <Transactions />
      <Card>
        <AssetLineChart />
      </Card>
      <AddAccountModal ref={modalRef} />
    </section>
  );
};

export const Component = Dashboard;

export default Dashboard;
