import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Button,
  FormProps,
  Checkbox,
  InputNumber,
  Alert,
  Divider,
  message,
} from "antd";
import { memo, useEffect } from "react";
import HeaderTitle from "@/components/ui/HeaderTitle";
import clsx from "clsx";
import { useAppSelector } from "@/hooks";
import ENDPOINTS from "@/constants/endpoints";
import Loader from "@/components/app/Loader";
import useMutationAction from "@/hooks/use-mutation-action";
import { getErrorMessage } from "@/utils";
import _ from "lodash";
import moment, { Moment } from "moment";
import usePersonalDetails from "@/hooks/use-personal-details";
import useShareholders from "@/hooks/use-shareholders";

interface FormValues {
  fname: string;
  lname: string;
  oname: string;
  gender: string;
  dob: string | Moment;
  residential_address: string;
  town: string;
  region: string;
  postcode: string;
  occupation: string;
  business_stake: string;
  business_role: string[];
  percentage_stake: string;
  authorized_signatory: string;
}

const ROLES = ["UBO", "Director", "Shareholder"];
const GENDER = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];

const PersonalInfo = ({
  next,
  isReview,
}: {
  next: () => void;
  isReview?: boolean;
}) => {
  const [form] = Form.useForm<FormValues>();
  const session = useAppSelector(state => state.session);
  const hasBusinessStake = Form.useWatch("business_stake", form);
  const businessRole = Form.useWatch("business_role", form);

  const { personalDetails, isLoading, refetch } = usePersonalDetails(
    session?.user?.email
  );
  const { shareholders, getShareholders } = useShareholders();

  const addMutation = useMutationAction<unknown>({
    url: ENDPOINTS.ADD_SHAREHOLDER,
    method: "POST",
    mutationKey: ["add-shareholder"],
    invalidateQueries: ["get-shareholders"],
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const mutation = useMutationAction<HM.QueryResponse>({
    url: ENDPOINTS.PERSONAL_DETAILS,
    method: "POST",
    invalidateQueries: ["personal_details"],
    onSuccess: data => {
      message.success(data?.message);
      refetch();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish: FormProps<FormValues>["onFinish"] = async values => {
    const formattedValues = {
      ...values,
      business_role: Array.isArray(values.business_role)
        ? values.business_role.join(",")
        : values.business_role || "",
      oname: values.oname || "",
      business_stake: values.business_stake || "NO",
      percentage_stake: values.percentage_stake || "",
      authorized_signatory: values.authorized_signatory || "NO",
    };

    const payload = _.omit(formattedValues, ["fname", "lname"]);
    if (
      !isReview &&
      shareholders.length === 0 &&
      payload.business_stake === "YES"
    ) {
      await addMutation.mutateAsync({
        fname: session?.user?.fname,
        lname: session?.user?.lname,
        email: session?.user?.email || "",
        type: "Individual",
        residential_address: payload.residential_address || "",
        region: payload.town || "",
        postcode: payload.postcode || "",
        business_stake: "YES",
        business_role: "Shareholder",
        authorized_signatory: payload.authorized_signatory || "YES",
      });
    }
    await mutation.mutateAsync(payload);
    next();
  };

  useEffect(() => {
    getShareholders();
    if (personalDetails && !isLoading) {
      form.setFieldsValue({
        fname: personalDetails.fname,
        oname: personalDetails.oname,
        lname: personalDetails.lname,
        residential_address: personalDetails.address,
        town: personalDetails.city,
        postcode: personalDetails.postcode,
        occupation: personalDetails.occupation,
        business_stake: personalDetails.business_stake,
        business_role: personalDetails.business_role?.split(","),
        percentage_stake: personalDetails.percentage_stake,
        authorized_signatory: personalDetails.authorized_signatory,
        gender: personalDetails.gender,
        dob: personalDetails.dob ? moment(personalDetails.dob) : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalDetails, isLoading]);

  useEffect(() => {
    if (
      hasBusinessStake === "YES" &&
      (!businessRole || !businessRole.includes("shareholder"))
    ) {
      const updatedRoles = [...(businessRole || []), "shareholder"];
      form.setFieldValue("business_role", updatedRoles);
    }
  }, [hasBusinessStake, businessRole, form]);

  return (
    <div className={clsx("h-full w-full space-y-8", !isReview && "p-8")}>
      {isLoading && <Loader />}
      <header className="flex items-center justify-between">
        <HeaderTitle
          headerDescription="Let’s know your personal details"
          headerTitle="Personal Contact Information"
        />
        {/* <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
          <img
            src="/images/user.png"
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
      <Alert
        type="info"
        message="Kindly fill out the names as displayed on your government issued ID Card"
        showIcon
        closable
      />
      <section>
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          className="space-y-4"
          labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="First Name"
              name="fname"
              rules={[{ required: true, message: "First name is required" }]}>
              <Input className="w-full" placeholder="e.g John" disabled />
            </Form.Item>
            <Form.Item label="Middle Name (Optional)" name="oname">
              <Input className="w-full" placeholder="e.g Jane" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Last Name"
              name="lname"
              rules={[{ required: true, message: "Last name is required" }]}>
              <Input className="w-full" placeholder="e.g Doe" disabled />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                { required: true, message: "Please select your gender" },
              ]}>
              <Select
                className="w-full"
                placeholder="Select Gender"
                options={GENDER}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[
                { required: true, message: "Date of birth is required" },
              ]}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label="Residential Address"
              name="residential_address"
              rules={[
                { required: true, message: "Residential address is required" },
              ]}>
              <Input className="w-full" placeholder="e.g 123 Main St" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Town/City"
              name="town"
              rules={[{ required: true, message: "Town/City is required" }]}>
              <Input className="w-full" placeholder="Enter town" />
            </Form.Item>
            <Form.Item
              label="Region/State"
              name="region"
              rules={[{ required: true, message: "Region/State is required" }]}>
              <Input className="w-full" placeholder="Enter Region" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Post Code"
              name="postcode"
              rules={[{ required: true, message: "Post code is required" }]}>
              <Input className="w-full" placeholder="Enter Postal Code" />
            </Form.Item>
            <Form.Item
              label="Occupation"
              name="occupation"
              rules={[{ required: true, message: "Occupation is required" }]}>
              <Input className="w-full" placeholder="Enter Occupation" />
            </Form.Item>
          </div>
          <Divider>
            <span className="text-grey-500 font-medium">
              Role in the Business
            </span>
          </Divider>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              name="business_stake"
              label="Do you hold over 25% stake of the business?"
              rules={[
                {
                  required: true,
                  message: "Please select whether you hold over 25% stake",
                },
              ]}>
              <Radio.Group className="w-full">
                <div className="grid grid-cols-2 gap-2">
                  <Radio
                    value="YES"
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    Yes
                  </Radio>
                  <Radio
                    value="NO"
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    No
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Role in Business"
              name="business_role"
              rules={[
                { required: true, message: "Please select at least one role" },
              ]}>
              <Checkbox.Group className="w-full flex items-center gap-1.5">
                {ROLES.map(role => (
                  <Checkbox key={role} value={role.toLowerCase()}>
                    {role}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Enter your percentage(%) stake"
              name="percentage_stake"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: hasBusinessStake === "YES",
                  message: "Please enter your stake percentage",
                  validator: async (_, value) => {
                    if (value === null || value === undefined) {
                      return Promise.resolve();
                    }

                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                      return Promise.reject(
                        "Stake percentage must be a number"
                      );
                    }
                    if (numValue > 100) {
                      return Promise.reject(
                        "Stake percentage cannot be more than 100"
                      );
                    }
                    if (numValue < 0) {
                      return Promise.reject(
                        "Stake percentage cannot be less than 0"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              <InputNumber className="w-full" placeholder="Enter Percentage" />
            </Form.Item>
            <Form.Item
              label="Appoint as authorized signatory?"
              name="authorized_signatory"
              rules={[
                {
                  required: true,
                  message:
                    "Please select whether you are an authorized signatory",
                },
              ]}>
              <Radio.Group className="w-full">
                <div className="grid grid-cols-2 gap-2">
                  <Radio
                    value={"YES"}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    Yes
                  </Radio>
                  <Radio
                    value={"NO"}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    No
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className="flex items-center justify-start">
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={mutation.isPending || addMutation.isPending}
              className="text-base w-48"
              shape="round">
              {isReview ? "Confirm" : "Save & Continue"}
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
};
export default memo(PersonalInfo);
