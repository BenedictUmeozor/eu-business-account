import HeaderTitle from "@/components/ui/HeaderTitle";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button, Checkbox, Select, Space, Form } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import BusinessInformation from "./BusinessInformation";
import PersonalInfo from "./PersonalInfo";
import ProofOfIdentity from "./ProofOfIdentity";
import { Link } from "react-router";
import AddShareholders from "./Shareholder";

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

const Review = ({ nextAction }: { nextAction: () => void }) => {
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [showLastPage, setShowLastPage] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  const next = useCallback(() => {
    if (selectedPage === 3) {
      setShowLastPage(true);
    } else {
      setSelectedPage(prev => (prev !== null ? prev + 1 : 0));
    }
  }, [selectedPage]);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedPage]);

  const onFinish = () => {
    nextAction();
  };

  return (
    <div className="h-full w-full space-y-12 p-8" ref={ref}>
      <section className="space-y-8">
        <HeaderTitle
          headerTitle="Review Information"
          headerDescription="Kindly vet all your details and document before final submission"
        />
        {showLastPage && (
          <section className="space-y-8">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <div className="space-y-4">
                <Form.Item
                  name="confirmDetails"
                  valuePropName="checked"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your details are correct",
                    },
                  ]}>
                  <Checkbox>
                    <p className="text-grey-500 font-medium text-base">
                      I have read through my submitted details and confirmed
                      they are correct
                    </p>
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name="acceptTerms"
                  valuePropName="checked"
                  rules={[
                    {
                      required: true,
                      message: "Please accept the terms and conditions",
                    },
                  ]}>
                  <Checkbox>
                    <p className="text-grey-500 font-medium text-base">
                      By clicking "Submit Profile", I accept the{" "}
                      <Link to="#" className="font-medium text-primary">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link to="#" className="font-medium text-primary">
                        Conditions
                      </Link>
                    </p>
                  </Checkbox>
                </Form.Item>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <Button
                  type="primary"
                  htmlType="button"
                  shape="round"
                  onClick={() => {
                    setShowLastPage(false);
                    setSelectedPage(0);
                  }}
                  className="w-48 bg-primary-50 text-base text-primary hover:bg-primary-100"
                  size="large">
                  Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  shape="round"
                  className="w-48 text-base"
                  size="large">
                  Submit Profile
                </Button>
              </div>
            </Form>
          </section>
        )}
        {!showLastPage && (
          <div className="grid grid-cols-2 gap-6">
            <Select
              className="w-full"
              placeholder="Select page to review"
              value={selectedPage}
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
      {selectedPage === 0 && !showLastPage && (
        <BusinessInformation next={next} isReview />
      )}
      {selectedPage === 1 && !showLastPage && (
        <PersonalInfo next={next} isReview />
      )}
      {selectedPage === 2 && !showLastPage && (
        <ProofOfIdentity next={next} back={next} isReview />
      )}
      {selectedPage === 3 && !showLastPage && (
        <AddShareholders next={() => setShowLastPage(true)} isReview />
      )}
    </div>
  );
};
export default Review;
