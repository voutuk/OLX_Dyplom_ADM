import React from 'react'
import { PrimaryButtonProps } from './props'
import { Button } from 'antd'

const PrimaryButton: React.FC<PrimaryButtonProps> = ({onButtonClick = () => {}, title, width = '412px', height = '44px', bgColor = '#FFBA00', fontColor = '#3A211C', isLoading, htmlType = "button"}) => {
  return (
    <Button loading={isLoading} onClick={onButtonClick} htmlType={htmlType} style={{backgroundColor: bgColor, color: fontColor, width: width, height: height, }} className={`p-0 pl-[24px] pr-[24px] rounded-[8px] text-[20px] font-normal font-montserrat leading-[28px]`}>
        {title}
    </Button>
  )
}

export default PrimaryButton