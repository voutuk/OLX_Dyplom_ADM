import { Spin } from "antd";

const GlobalFallback:React.FC = () => {
  
    return (
      <Spin size="large" className=" mx-auto my-auto" spinning={true}/>
    );
  };
  
  export default GlobalFallback;