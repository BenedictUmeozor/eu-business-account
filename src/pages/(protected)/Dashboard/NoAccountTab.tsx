import { memo, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button, Tag, Modal } from "antd";
import Colors from "@/constants/colors";
import {
  ArrowUpRightIcon,
  EllipsisVerticalIcon,
  InfoIcon,
  PlusIcon,
  RotateCwSquareIcon,
  SendIcon,
} from "lucide-react";
import { useAppSelector } from "@/hooks";
import countries from "@/data/codes.json";
import ENDPOINTS from "@/constants/endpoints";

const data = [
  { name: "Total money in", value: 0, color: Colors.positive },
  { name: "Total money out", value: 0, color: Colors.pending },
];

const DoughnutChart = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-grey-600 font-medium">Your Money Analytics</h3>
        <Button
          type="primary"
          className="bg-grey-50 text-grey-500"
          shape="round"
          disabled>
          Last 30 days
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={450}>
              <Cell fill="#E5F1FF" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-3">
          {data.map((entry, index) => (
            <div key={index} className="flex items-start gap-2">
              <div
                className="w-3 h-3 rounded-full mt-1"
                style={{ backgroundColor: entry.color }}
              />
              <div className="space-y-0.5">
                <p className="text-sm text-grey-500">{entry.name}</p>
                <p className="font-medium">£{entry.value.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NoAccountTab = () => {
  const session = useAppSelector(state => state.session);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleViewAccountDetails = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const currency = useMemo(() => {
    return countries.find(
      c => c.countryCode.toLowerCase() === session.user?.country?.toLowerCase()
    );
  }, [session.user?.country]);

  return (
    <section className="grid grid-cols-[1.9fr_1.1fr] gap-4">
      <div className="p-6 shadow rounded-md flex flex-col gap-6 justify-between bg-white">
        <header className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-11 w-11 rounded-full overflow-hidden grid place-items-center">
              <img
                src={ENDPOINTS.FLAG_URL(
                  session.user?.country?.toLowerCase() ?? ""
                )}
                alt="gb"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-medium text-grey-500">
              Total {currency?.currencyCode} Balance
            </p>
            <p className="text-3xl text-grey-600 font-semibold font-nunito">
              {currency?.currencySymbol}0.00
            </p>
          </div>
          <Tag
            className="bg-pending-50 !text-pending flex items-center gap-0.5 text-sm p-1 px-1.5 rounded-md"
            icon={<InfoIcon className="w-4 h-4 text-pending" />}>
            Pending
          </Tag>
        </header>
        <div className="flex items-end justify-between">
          <Button
            type="primary"
            shape="round"
            className="bg-grey-50 text-grey"
            icon={<ArrowUpRightIcon className="w-4 h-4 text-grey" />}
            iconPosition="end"
            onClick={handleViewAccountDetails}>
            View Account Details
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
              <div
                className="bg-gray-200 h-12 w-12 rounded-full p-0 flex items-center justify-center cursor-not-allowed"
                role="button">
                <SendIcon className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-base text-primary">Send</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
              <div
                className="bg-gray-200 h-12 w-12 rounded-full p-0 flex items-center justify-center cursor-not-allowed"
                role="button">
                <PlusIcon className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-base text-primary">Fund</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
              <div
                className="bg-gray-200 h-12 w-12 rounded-full p-0 flex items-center justify-center cursor-not-allowed"
                role="button">
                <RotateCwSquareIcon className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-base text-primary">Convert</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
              <div
                className="bg-gray-200 h-12 w-12 rounded-full p-0 flex items-center justify-center cursor-not-allowed"
                role="button">
                <EllipsisVerticalIcon className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-base text-primary">More</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 shadow rounded-md bg-white">
        <DoughnutChart />
      </div>
      <Modal
        title="Account Pending"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}>
        <p>Your account is currently pending.</p>
      </Modal>
    </section>
  );
};

export default memo(NoAccountTab);
