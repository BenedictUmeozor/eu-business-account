import { Avatar, Badge, Button, Input, Space } from 'antd';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Notification } from 'iconsax-react';
import Colors from '@/constants/colors';

const AppHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-0 border-b border-solid border-grey-200">
      <div className="flex items-center gap-12">
        <h2 className="text-lg font-normal">Good Morning, Michelle</h2>
        <div>
          <Input
            suffix={<MagnifyingGlassIcon width={20} />}
            className="w-[300px] rounded-full bg-gray-100"
            placeholder="Looking for something?"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          icon={
            <Badge count={2} color={Colors.primary}>
              <Notification className="h-5 w-5" />
            </Badge>
          }
          shape="circle"
          size="large"
          type="text"
        />
        <Space align="center">
          <Avatar
            src="/images/avatar.png"
            size={'large'}
            className="cursor-pointer"
          />
          <div className="flex flex-col items-start gap-0.5">
            <h5 className="text-sm font-medium">Michelle Mezie</h5>
            <p className="text-sm text-grey-500">michelle.dsgn@gmail.com</p>
          </div>
        </Space>
      </div>
    </header>
  );
};
export default AppHeader;
