import { ReactNode } from "react";

export interface PageHeaderProps {
    title?: string,
    icon?: ReactNode,
    onClick?: Function,
    buttonIcon?: ReactNode,
    tooltipMessage?:string
}