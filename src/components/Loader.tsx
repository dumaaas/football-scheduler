import { Spin, Space } from "antd";

function Loader() {
  return (
    <Space
      size="large"
      align="center"
      style={{
        display: "flex",
        justifyContent: "center",
        height: "calc(100vh - 180px)",
        width: "100%",
      }}
    >
      <Spin size="large" />
    </Space>
  );
}

export default Loader;
