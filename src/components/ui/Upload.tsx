import { ChangeEvent, memo, useRef } from "react";
import { Button, Form } from "antd";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import DocumentPreview from "./DocumentPreview";

const Upload = ({
  label,
  file,
  setFile,
  image,
  className = "w-48",
}: {
  label: string;
  image: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  className?: string;
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  return (
    <Form.Item label={label}>
      <div>
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          ref={ref}
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          role="button"
          className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-md border border-dashed border-primary-500 p-4 transition-all duration-75 hover:bg-grey-50"
          onClick={() => ref.current?.click()}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50">
              <ArrowUpTrayIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-grey-600">
                Click to upload
              </p>
              <p className="text-xs text-grey-500">
                {file ? file.name : "JPG, PDF I 50kb max."}
              </p>
            </div>
          </div>
          <Button
            type="primary"
            className="bg-primary-50 text-primary hover:bg-primary-100"
          >
            Upload
          </Button>
        </div>
        <div className="flex h-44 items-center justify-center rounded-lg bg-primary-50">
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`flex aspect-[1.8] items-center justify-center ${className}`}
            >
              {file ? (
                <DocumentPreview file={file} />
              ) : (
                <img
                  src={image}
                  alt="preview"
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <p className="text-sm text-grey-500">Document Preview</p>
          </div>
        </div>
      </div>
    </Form.Item>
  );
};
export default memo(Upload);
