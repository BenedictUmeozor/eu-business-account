import { Alert, Button } from "antd";

const TwoFactorAuth = () => {
  return (
    <div
      className="flex items-center justify-center py-16
  ">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">
          2-Factor Authentication
        </h3>
        <Alert
          message="To complete transfer payment via the web platform, you will be to generate a token on our authenticator to proceed"
          type="info"
          showIcon
          className="text-primary"
        />
        <div className="bg-grey-50 rounded-3xl p-8 flex flex-col items-center justify-center gap-y-4">
          <img
            src="/images/2fa.png"
            className="h-32 w-32 object-cover"
            alt="QR Code"
          />
          <p className="w-full text-center text-grey-700">
            Scan code to download authenticator
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Button type="primary" size="large" shape="round" className="w-48">
            Input Pin
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Component = TwoFactorAuth;

export default TwoFactorAuth;
