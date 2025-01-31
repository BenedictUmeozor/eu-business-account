import { ReactNode } from 'react';

const HeaderTitle = ({
  headerDescription,
  headerTitle,
  html,
}: {
  headerTitle: string;
  headerDescription?: string;
  html?: ReactNode;
}) => {
  return (
    <header className="space-y-2">
      <h3 className="text-2xl font-semibold text-grey-700">{headerTitle}</h3>
      <p className="text-grey-500">{html ? html : headerDescription}</p>
    </header>
  );
};
export default HeaderTitle;
