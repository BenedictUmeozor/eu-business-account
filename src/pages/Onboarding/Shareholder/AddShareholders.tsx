import HeaderTitle from '@/components/ui/HeaderTitle';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import AddShareholderButton from './AddShareholderButton';
import AddShareholderForm from './AddShareholderForm';
import { Button } from 'antd';
import EditShareholder from './EditShareholder';

export interface Shareholder {
  id: number;
  business_name: string;
  email_address: string;
  role: string;
  residential_address: string;
  owns_over_25_percent: 1 | 0;
  authorized_signatory: 1 | 0;
  preferred_means_of_identification: 'NIN' | 'Passport' | 'Drivers License';
  front_image: File | null;
  back_image: File | null;
  type: 'Individual' | 'Business';
}

const AddShareholders = ({ next }: { next: () => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [selectedShareholder, setSelectedShareholder] =
    useState<Shareholder | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const _setShowForm = useCallback(() => setShowForm(true), []);
  const hanldeAddShareholder = useCallback(
    (shareholder: Shareholder) => {
      const length = shareholders.length;
      setShareholders([...shareholders, { ...shareholder, id: length + 1 }]);
      setShowForm(false);
      console.log(shareholders);
    },
    [shareholders],
  );

  const handleEditShareholder = useCallback(
    (shareholder: Shareholder) => {
      const newShareholders = shareholders.map(d => {
        if (d.id === shareholder.id) {
          return shareholder;
        } else {
          return d;
        }
      });
      setShareholders(newShareholders);
      setShowEditForm(false);
      setSelectedShareholder(null);
    },
    [shareholders],
  );

  const _setSelectedShareholder = useCallback((shareholder: Shareholder) => {
    setSelectedShareholder(shareholder);
    setShowEditForm(true);
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [shareholders]);

  if (showForm) {
    return <AddShareholderForm handleAddShareholder={hanldeAddShareholder} />;
  }

  if (showEditForm && !!selectedShareholder) {
    return (
      <EditShareholder
        shareholder={selectedShareholder}
        handleEditShareholder={handleEditShareholder}
      />
    );
  }

  return (
    <div className="h-full w-full space-y-8 p-8" ref={ref}>
      <HeaderTitle
        headerDescription="Add up to Four (4) key shareholders in your business"
        headerTitle="Add Key Shareholders"
      />
      <section className="grid grid-cols-1 grid-rows-[120px] gap-6 lg:grid-cols-2">
        <AddShareholderButton
          shareholders={shareholders}
          index={0}
          setShowForm={_setShowForm}
          setSelectedShareholder={_setSelectedShareholder}
        />
        <AddShareholderButton
          shareholders={shareholders}
          index={1}
          setShowForm={_setShowForm}
          setSelectedShareholder={_setSelectedShareholder}
        />
        <AddShareholderButton
          shareholders={shareholders}
          index={2}
          setShowForm={_setShowForm}
          setSelectedShareholder={_setSelectedShareholder}
        />
        <AddShareholderButton
          shareholders={shareholders}
          index={3}
          setShowForm={_setShowForm}
          setSelectedShareholder={_setSelectedShareholder}
        />
      </section>
      {shareholders.length > 0 && (
        <Button
          type="primary"
          onClick={next}
          className="w-48"
          shape="round"
          size="large"
        >
          Continue
        </Button>
      )}
    </div>
  );
};
export default memo(AddShareholders);
