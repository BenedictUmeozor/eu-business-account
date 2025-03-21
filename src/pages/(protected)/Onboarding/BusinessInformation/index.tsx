import { memo, useState } from "react";
import HeaderTitle from "@/components/ui/HeaderTitle";
import clsx from "clsx";
import SecondForm from "./SecondForm";
import FirstForm from "./FirstForm";

const BusinessInformation = ({
  next,
  isReview,
}: {
  next: () => void;
  isReview?: boolean;
}) => {
  const [showSecondForm, setShowSecondForm] = useState(false);

  return (
    <div className={clsx("h-full w-full space-y-8", !isReview && "p-8")}>
      <header className="flex items-center justify-between">
        <HeaderTitle
          headerDescription="Tell us more about your business"
          headerTitle="Business Information"
        />
        {/* <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
          <img
            src="/images/logo.png"
            alt=""
            className="h-full w-full object-contain"
          />
          <Button
            type="primary"
            shape="circle"
            className="absolute bottom-0 right-0 bg-primary-50 outline outline-white"
            size="small"
            icon={<PencilIcon className="h-3 w-3 text-primary" />}
          />
        </div> */}
      </header>
      <section>
        {showSecondForm ? (
          <SecondForm next={next} />
        ) : (
          <FirstForm
            isReview={isReview ?? false}
            next={() => setShowSecondForm(true)}
          />
        )}
      </section>
    </div>
  );
};

export default memo(BusinessInformation);
