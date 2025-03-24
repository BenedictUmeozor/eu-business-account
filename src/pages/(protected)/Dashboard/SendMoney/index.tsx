import { useNavigate, useSearchParams } from "react-router";
import { SEND_MONEY_OPTIONS } from "./constants";
import { Space, Tag } from "antd";

const SendMoney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleNavigate = (to: string) => {
    navigate(`${to}?currency=${searchParams.get("currency")}`);
  };

  return (
    <div
      className="flex items-center justify-center py-16
  ">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <header className="space-y-1">
          <h3 className="text-xl text-grey-700 font-semibold">Send Money</h3>
          <p className="text-grey-500">
            Whether you're supporting loved ones abroad or making local
            payments, we've got you covered!
          </p>
        </header>
        <section className="space-y-4">
          {SEND_MONEY_OPTIONS.map((option, index) => (
            <div
              className="flex items-center gap-6 rounded-xl shadow p-5 bg-white cursor-pointer border-2 transition-all duration-200 ease-linear border-solid border-transparent hover:border-primary"
              key={
                typeof option.title === "string"
                  ? option.title
                  : `option-${index}`
              }
              onClick={() => handleNavigate(option.to)}>
              <img
                src={option.image}
                alt={"option"}
                className="w-20 aspect-square"
              />

              <div className="space-y-1 flex-grow">
                <Space size="large">
                  <h5 className="text-base text-grey-700 font-medium">
                    {typeof option.title === "function"
                      ? option.title(searchParams.get("currency") || undefined)
                      : option.title}
                  </h5>
                  {option?.tag && (
                    <Tag className="rounded-md bg-primary-50 text-primary">
                      {option.tag}
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

export const Component = SendMoney;

export default SendMoney;
