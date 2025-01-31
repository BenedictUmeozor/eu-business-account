import { Button, Image, Modal } from 'antd';
import { memo, useState } from 'react';
import { Document, Page } from 'react-pdf';

const DocumentPreview = ({ file }: { file: File }) => {
  const [open, setOpen] = useState(false);

  if (file.type.startsWith('image/')) {
    return (
      <Image
        src={URL.createObjectURL(file)}
        alt="document"
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <div>
      <Button type="link" onClick={() => setOpen(true)}>
        Click to view
      </Button>
      <Modal footer={null} open={open} onCancel={() => setOpen(false)}>
        <div className="flex justify-center">
          <Document file={file}>
            <Page
              pageNumber={1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={500}
              className="max-h-[80vh]"
            />
          </Document>
        </div>
      </Modal>
    </div>
  );
};

export default memo(DocumentPreview);
