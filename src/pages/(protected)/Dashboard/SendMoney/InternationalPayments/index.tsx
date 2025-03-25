import { useNavigate, useSearchParams } from "react-router";
import { PAYMENT_TYPES_INTERNATIONAL } from "../constants";
import { message, Space, Tag } from "antd";

const InternationalPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleNavigate = (to: string, comingSoon?: boolean) => {
    if (comingSoon) {
      return message.info("This feature is coming soon");
    }
    navigate(to);
  };

  return (
    <div
      className="flex items-center justify-center py-16
  ">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <header className="space-y-1">
          <h3 className="text-xl text-grey-700 font-semibold">
            Select Payment Type
          </h3>
          <p className="text-grey-500">
            Whether you're supporting loved ones abroad or making local
            payments, we've got you covered!
          </p>
        </header>
        <section className="space-y-4">
          {PAYMENT_TYPES_INTERNATIONAL.map(option => (
            <div
              className="flex items-center gap-3 rounded-xl shadow p-5 bg-white cursor-pointer border-2 transition-all duration-200 ease-linear border-solid border-transparent hover:border-primary"
              key={option.title}
              onClick={() =>
                handleNavigate(
                  `${option.to}?currency=${searchParams.get("currency")}`,
                  option?.comingSoon
                )
              }>
              <img
                src={option.image}
                alt={option.title}
                className="w-11 aspect-square"
              />

              <div className="space-y-1 flex-grow">
                <Space>
                  <h5 className="text-base text-grey-700 font-medium">
                    {option.title}
                  </h5>
                  {option?.comingSoon && (
                    <Tag className="bg-primary-50 text-primary">
                      Coming Soon
                    </Tag>
                  )}
                </Space>
                <p className="text-sm text-grey-600">{option.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export const Component = InternationalPayment;

export default InternationalPayment;
