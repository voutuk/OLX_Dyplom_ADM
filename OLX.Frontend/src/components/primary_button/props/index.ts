export interface PrimaryButtonProps {
    onButtonClick?: () => void,
    title: string,
    width?: string,
    height?: string,
    bgColor?: string,
    fontColor?: string
    isLoading: boolean
    htmlType?:  "button" | "submit" | "reset"
}