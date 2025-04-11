import ENDPOINTS from "@/constants/endpoints";
import { Alert, Button } from "antd";
import { CopyIcon } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

interface LocationState {
  amount: string;
  description: string;
  sortCode: string;
  beneficiary_id: string;
  currency: string;
}

const TwoFactorAuth = () => {
  const location = useLocation() as unknown as { state: LocationState };
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard/send-money/local-payments/single/2fa/confirm", {
      state: location.state,
    });
  };

  useEffect(() => {
    if (!location.state) {
      navigate("/dashboard", { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

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
          <div className="inline-flex items-center gap-1 mx-auto rounded-2xl bg-primary-50 py-2 px-4">
            <CopyIcon className="w-4 h-4 text-primary" />
            <a
              className="text-primary"
              href={ENDPOINTS.AUTHENTICATOR_APP_LINK}
              target="_blank"
              rel="noopener noreferrer">
              {ENDPOINTS.AUTHENTICATOR_APP_LINK}
            </a>
          </div>
          <p className="w-full text-center text-grey-700">
            Scan QR code or copy link to download authenticator
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            size="large"
            shape="round"
            className="w-48"
            onClick={handleClick}>
            Input Pin
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Component = TwoFactorAuth;

export default TwoFactorAuth;
