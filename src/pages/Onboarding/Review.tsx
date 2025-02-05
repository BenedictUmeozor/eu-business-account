import HeaderTitle from "@/components/ui/HeaderTitle";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button, Checkbox, Select, Space } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import BusinessInformation from "./BusinessInformation";
import PersonalInfo from "./PersonalInfo";
import ProofOfIdentity from "./ProofOfIdentity";
import { Link } from "react-router";
import AddShareholders from "./Shareholder/AddShareholders";

const PAGES = [
  {
    index: 0,
    title: "Business Information",
  },
  {
    index: 1,
    title: "Personal Information",
  },
  {
    index: 2,
    title: "Identity Verification",
  },
  {
    index: 3,
    title: "Add Shareholders",
  },
];

const Review = ({
  nextAction,
  setLicense,
}: {
  nextAction: () => void;
  setLicense: (value: 1 | 0) => void;
}) => {
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const next = useCallback(
    () =>
      setSelectedPage(prev =>
        prev !== null ? (prev === 3 ? 6 : prev + 1) : 0
      ),
    []
  );

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedPage]);

  return (
    <div className="h-full w-full space-y-12 p-8" ref={ref}>
      <section className="space-y-8">
        <HeaderTitle
          headerTitle="Review Information"
          headerDescription="Kindly vet all your details and document before final submission"
        />
        {selectedPage === 6 && (
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox>
                  <p className="text-grey-500 font-medium text-base">
                    I have read through my submitted details and confirmed they
                    are correct
                  </p>
                </Checkbox>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox>
                  <p className="text-grey-500 font-medium text-base">
                    By clicking “submit profile”, I accept the{" "}
                    <Link to="#" className="font-medium text-primary">
                      terms
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="font-medium text-primary">
                      conditions
                    </Link>
                  </p>
                </Checkbox>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                type="primary"
                htmlType="button"
                shape="round"
                onClick={() => setSelectedPage(0)}
                className="w-48 bg-primary-50 text-base text-primary hover:bg-primary-100"
                size="large">
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                onClick={nextAction}
                className="w-48 text-base"
                size="large">
                Submit Profile
              </Button>
            </div>
          </section>
        )}
        {selectedPage !== 6 && (
          <div className="grid grid-cols-2 gap-6">
            <Select
              className="w-full"
              placeholder="Select page to review"
              options={PAGES.map(page => ({
                label: page.title,
                value: page.index,
              }))}
              onChange={value => {
                setSelectedPage(value);
              }}
            />
            <div className="flex items-center justify-end">
              <Space>
                <Button
                  type="text"
                  icon={<ChevronLeftIcon className="h-4 w-4" />}
                  disabled={!selectedPage}
                  onClick={() => setSelectedPage(prev => prev! - 1)}>
                  Previous
                </Button>
                <Button
                  type="text"
                  icon={<ChevronRightIcon className="h-4 w-4" />}
                  onClick={next}>
                  Next
                </Button>
              </Space>
            </div>
          </div>
        )}
      </section>
      {selectedPage === 0 && (
        <BusinessInformation next={next} isReview setLicense={setLicense} />
      )}
      {selectedPage === 1 && <PersonalInfo next={next} isReview />}
      {selectedPage === 2 && (
        <ProofOfIdentity next={next} back={next} isReview />
      )}
      {selectedPage === 3 && <AddShareholders next={next} isReview />}
    </div>
  );
};
export default Review;
