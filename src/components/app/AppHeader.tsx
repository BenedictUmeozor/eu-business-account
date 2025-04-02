import { Avatar, Badge, Button, Input, Space } from "antd";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Notification } from "iconsax-react";
import Colors from "@/constants/colors";
import { useAppSelector } from "@/hooks";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import { getTimeBasedGreeting } from "@/utils";
import usePersonalDetails from "@/hooks/use-personal-details";

const AppHeader = () => {
  const session = useAppSelector(state => state.session);
  const navigate = useNavigate();

  const { personalDetails } = usePersonalDetails();

  const userInitials = useMemo(
    () =>
      `${session.user?.fname?.[0] || ""}${session.user?.lname?.[0] || ""}`.toUpperCase(),
    [session.user?.fname, session.user?.lname]
  );

  const handleNavigate = () => {
    navigate("/profile");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-0 border-b border-solid border-grey-200">
      <div className="flex items-center gap-12">
        <h2 className="text-lg font-normal">
          {getTimeBasedGreeting()}, {session.user?.fname}
        </h2>
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
            size="large"
            src={personalDetails?.profile_picture || null}
            onClick={handleNavigate}
            className={`cursor-pointer ${!personalDetails?.profile_picture ? "bg-primary" : ""}`}>
            {!personalDetails?.profile_picture ? userInitials : null}
          </Avatar>
          <div className="flex flex-col items-start gap-0.5">
            <h5 className="text-sm font-medium">{`${session.user?.fname} ${session.user?.lname}`}</h5>
            <p className="text-sm text-grey-500">{session.user?.email}</p>
          </div>
        </Space>
      </div>
    </header>
  );
};
export default AppHeader;
