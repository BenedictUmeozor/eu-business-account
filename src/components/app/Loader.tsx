import { Spin } from "antd";

const Loader = () => {
  return (
    <div className="fixed left-0 top-0 z-[99999] grid h-screen w-screen place-items-center bg-black/60">
      <Spin size="large" />
    </div>
  );
};
export default Loader;
