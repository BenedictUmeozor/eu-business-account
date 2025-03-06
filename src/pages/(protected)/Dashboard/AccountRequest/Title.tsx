import clsx from "clsx";
import { memo } from "react";

const TITLES = [
  "Account Request Process",
  "Enter Personal Details",
  "Contact Address Info",
  "Occupation",
  "Let’s have a copy of your ID",
  "Tax Information",
  "Financial information",
  "",
  "",
  "Review your Information",
];

const Title = ({ current }: { current: number }) => {
  if (current === 0) {
    return (
      <span className="text-xl font-semibold text-grey-700">{TITLES[0]}</span>
    );
  }

  if (current === 8 || current === 7 || current === 10) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xl font-semibold text-grey-700">{TITLES[current]}</p>
      <div className="grid grid-cols-6 gap-1">
        <div
          className={clsx(
            "h-1 rounded-2xl",
            current >= 1 ? "bg-positive" : "bg-positive-50"
          )}
        />
        <div
          className={clsx(
            "h-1 rounded-2xl",
            current >= 2 ? "bg-positive" : "bg-positive-50"
          )}
        />
        <div
          className={clsx(
            "h-1 rounded-2xl",
            current >= 3 ? "bg-positive" : "bg-positive-50"
          )}
        />
        <div
          className={clsx(
            "h-1 rounded-2xl",
            current >= 4 ? "bg-positive" : "bg-positive-50"
          )}
        />
        <div
          className={clsx(
            "h-1 rounded-2xl",
            current >= 5 ? "bg-positive" : "bg-positive-50"
          )}
        />
        <div
          className={clsx(
            "h-1 rounded-2xl",
            current >= 6 ? "bg-positive" : "bg-positive-50"
          )}
        />
      </div>
    </div>
  );
};
export default memo(Title);
