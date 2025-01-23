import React from 'react'
import { PrimaryButtonProps } from './props'
import { Button } from 'antd'

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onButtonClick = () => { }, title, width = '460px', height = '44px', bgColor = '#FFBA00', fontColor = '#3A211C', isLoading, htmlType = "button" }) => {
  return (
    <div className="primary-button" >
      <Button
        loading={isLoading}
        onClick={onButtonClick}
        htmlType={htmlType}
        style={{
          backgroundColor: bgColor,
          color: fontColor,
          width: width,
          height: height,
        }}
        className={`primary-button rounded-[8px] text-[20px] font-normal font-montserrat leading-[28px] border-none`}>
        {title}
      </Button>
    </div>
  )
}

export default PrimaryButton