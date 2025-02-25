import { Button, Result } from "antd";
import { useNavigate, useRouteError } from "react-router";

const ErrorBoundary = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center pt-8">
      <a href="https://hellomemoney.com/" className="flex items-center gap-2 mb-8">
        <img src="/images/hellome.png" alt="Hellomemoney" className="h-10 w-10" />
        <p className="font-cabinet text-2xl font-extrabold text-primary no-underline">
          HelloMe Money
        </p>
      </a>
      <Result
        status="error"
        title="Something went wrong"
        subTitle={error?.message || "An unexpected error occurred. Please try again."}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate("/")}>
            Back Home
          </Button>,
          <Button key="retry" onClick={() => window.location.reload()}>
            Try Again
          </Button>,
        ]}
      />
    </div>
  );
};

export const Component = ErrorBoundary;

export default ErrorBoundary;