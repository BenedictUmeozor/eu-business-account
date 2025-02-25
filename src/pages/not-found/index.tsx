import { Button, Result } from "antd";
import { useNavigate } from "react-router";

const NotFound = () => {
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
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export const Component = NotFound;

export default NotFound;