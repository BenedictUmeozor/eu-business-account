import { Button, Card, Col, Row, Tag } from "antd";
import { PlusCircleIcon } from "lucide-react";
import { useMemo } from "react";

const AddButton = ({
  shareholder,
  showForm,
  onEdit,
}: {
  shareholder: HM.Shareholder | null;
  showForm: () => void;
  onEdit?: (shareholder: HM.Shareholder) => void;
}) => {
  const isBusiness = useMemo(
    () => shareholder?.type === "Business",
    [shareholder]
  );

  const handleEditClick = () => {
    if (shareholder && onEdit) {
      onEdit(shareholder);
    }
  };

  if (!shareholder) {
    return (
      <Card
        role="button"
        onClick={showForm}
        className="flex cursor-pointer items-center justify-center bg-grey-50 transition-all duration-100 ease-linear hover:bg-grey-100">
        <div className="flex flex-col items-center justify-center gap-2">
          <PlusCircleIcon className="h-8 w-8 text-grey-500" />
          <p className="text-grey-600">Add Shareholder</p>
        </div>
      </Card>
    );
  }
  return (
    <Row
      gutter={16}
      justify={"space-between"}
      role="button"
      className="gap-2 rounded-md border border-solid border-grey-200 p-3">
      <Col span={16} className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full">
          <img
            src="/images/director.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-0.5">
          <p className="break-words font-medium text-grey-600">
            {isBusiness
              ? shareholder.business_name
              : `${shareholder.fname} ${shareholder.lname}`}
          </p>
          <p className="break-words text-gray-600">{shareholder.email}</p>
        </div>
      </Col>
      <Col
        span={4}
        className="flex h-full flex-col items-center justify-between">
        <Tag className="rounded-md text-pending-700 text-xs bg-pending-50">
          Shareholder
        </Tag>
        <Button 
          type="text" 
          className="text-sm text-primary" 
          size="small"
          onClick={handleEditClick}>
          Edit
        </Button>
      </Col>
    </Row>
  );
};

export default AddButton;
