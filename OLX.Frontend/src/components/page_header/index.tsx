import "./style.scss"
import { Tooltip } from "antd";
import { PageHeaderProps } from "./props";



export const PageHeader: React.FC<PageHeaderProps> = ({ title, icon, onClick, buttonIcon, tooltipMessage }) => {
    const onButtonClick = () => {
        if (onClick) {
            onClick();
        }
    }
    return (
        <div  className=" text-white flex gap-5  w-full items-center page-header h-[60px] rounded-t-md pl-6 relative">
            {icon}
            <span className="text-xl">{title}</span>
            {onClick &&
                <Tooltip
                    color="geekblue"
                    title={tooltipMessage}>
                    <div style={{ right: '10%' }}
                        className="h-[45px] w-[45px] flex items-center justify-center cursor-pointer rounded-full bg-green-500 absolute top-9 "
                        onClick={onButtonClick}>
                        {buttonIcon}
                    </div>
                </Tooltip>}

        </div>)
}