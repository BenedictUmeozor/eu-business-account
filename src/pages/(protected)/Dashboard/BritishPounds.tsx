import { Button, Tag } from "antd";
import {
  CheckCheckIcon,
  CircleCheckBigIcon,
  CopyIcon,
  SendIcon,
  PlusIcon,
  RotateCwSquareIcon,
  EllipsisVerticalIcon,
} from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router";
import Colors from "@/constants/colors";

const data = [
  { name: "Total Money In", value: 1200, color: Colors.positive },
  { name: "Total Money Out", value: 700.95, color: Colors.pending },
];

const BritishPounds = () => {
  return (
    <section className="grid grid-cols-[1.9fr_1.1fr] gap-4">
      <div className="p-6 shadow rounded-md space-y-4 bg-white">
        <header className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-11 w-11 rounded-full overflow-hidden grid place-items-center">
              <img src={"/images/gb.png"} alt="gb" className="w-full h-full" />
            </div>
            <p className="font-medium text-grey-500">Total GBP Balance</p>
            <p className="text-3xl text-grey-600 font-semibold font-nunito">
              $444.00
            </p>
          </div>
          <Tag
            className="bg-positive-50 !text-positive flex items-center gap-0.5 text-sm p-1 px-1.5 rounded-md"
            icon={<CircleCheckBigIcon className="w-4 h-4 text-positive" />}>
            Active
          </Tag>
        </header>
        <div className="flex items-end justify-between">
          <ClipboardCopy />
          <div className="flex items-center gap-4">
            <Link
              to="#"
              className="flex flex-col items-center justify-center gap-1 text-primary group">
              <div
                className="bg-primary-50 h-12 w-12 group-hover:bg-primary-100 transition-all duration-200 ease-linear rounded-full p-0 flex items-center justify-center cursor-pointer"
                role="button">
                <SendIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base ">Send</span>
            </Link>
            <Link
              to="#"
              className="flex flex-col items-center justify-center gap-1 text-primary group">
              <div
                className="bg-primary-50 h-12 w-12 group-hover:bg-primary-100 transition-all duration-200 ease-linear rounded-full p-0 flex items-center justify-center cursor-pointer"
                role="button">
                <PlusIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base ">Fund</span>
            </Link>
            <Link
              to="#"
              className="flex flex-col items-center justify-center gap-1 text-primary group">
              <div
                className="bg-primary-50 h-12 w-12 group-hover:bg-primary-100 transition-all duration-200 ease-linear rounded-full p-0 flex items-center justify-center cursor-pointer"
                role="button">
                <RotateCwSquareIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base ">Convert</span>
            </Link>
            <Link
              to="#"
              className="flex flex-col items-center justify-center gap-1 text-primary group">
              <div
                className="bg-primary-50 h-12 w-12 group-hover:bg-primary-100 transition-all duration-200 ease-linear rounded-full p-0 flex items-center justify-center cursor-pointer"
                role="button">
                <EllipsisVerticalIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base ">More</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="p-6 shadow rounded-md bg-white">
        <DoughnutChart />
      </div>
    </section>
  );
};

const DoughnutChart = () => {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            startAngle={90}
            endAngle={450}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-1">
        {data.map((entry, index) => (
          <div key={index} className="flex items-start gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />

            <span className="text-sm text-grey-500">
              {entry.name} <strong>${entry.value.toFixed(2)}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClipboardCopy = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex items-center gap-0.5 bg-gray-50 rounded-md p-1 px-2.5">
      <span className="text-sm text-grey-500">Hellome... 4044209090</span>
      <CopyToClipboard text="Hellome... 4044209090" onCopy={handleCopy}>
        <Button
          type="text"
          icon={
            copied ? (
              <CheckCheckIcon className="w-4 h-4 text-grey-500" />
            ) : (
              <CopyIcon className="w-4 h-4 text-grey-500" />
            )
          }
        />
      </CopyToClipboard>
    </div>
  );
};

export default BritishPounds;
