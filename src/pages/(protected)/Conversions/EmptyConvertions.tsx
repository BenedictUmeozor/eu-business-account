import { Button } from "antd";

interface EmptyConvertionsProps {
  onShowConversionForm: () => void;
}

const EmptyConvertions = ({ onShowConversionForm }: EmptyConvertionsProps) => {
  return (
    <div className="border border-grey-200 border-solid rounded-xl flex items-center justify-center min-h-80 bg-white py-12">
      <div className="w-full max-w-96 flex flex-col gap-6 items-center justify-center">
        <img
          src="/images/empty-conversions.png"
          alt="No conversions available"
          className="w-40"
        />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-grey-600">
            No Conversions yet
          </h3>
          <p className="text-grey-500">
            You have not made any conversions yet, when you do - it would appear
            here
          </p>
        </div>
        <Button
          type="primary"
          className="bg-primary-50 text-primary w-48"
          shape="round"
          size="large"
          onClick={onShowConversionForm}>
          Try now
        </Button>
      </div>
    </div>
  );
};

export default EmptyConvertions;
