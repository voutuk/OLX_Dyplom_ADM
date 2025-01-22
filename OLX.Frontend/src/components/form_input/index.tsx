import React from 'react'
import { Input, Form } from 'antd';
import { FormInputProps } from './props';

const FormInput: React.FC<FormInputProps> = ({label, name, rules = [], inputType="text", placeholder}) => {
  return (
    <Form.Item
        label={<label className='text-[#3A211C] font-unbounded text-base font-medium leading-5 '>{label}</label>}
        name={name}
        rules={rules.map(rule => ({
          ...rule,
          message: (
            <span className="font-montserrat text-[#BB8A52] text-[14px] font-normal leading-5 underline">
              {rule.message}
            </span>
          ),
        }))}
        required={false}
        className='text-left'
    >   
        {name=='password' ? 
        <Input.Password type={inputType} placeholder={placeholder} className='rounded-[8px] p-[10px]  w-[460px] h-[48px] text-[#9B7A5B] text-opacity-50 font-montserrat font-normal leading-6 text-base'/>
          :
        <Input type={inputType} placeholder={placeholder} className='rounded-[8px] p-[10px]  w-[460px] h-[48px] text-[#9B7A5B] text-opacity-50 font-montserrat font-normal leading-6 text-base'/>
        }
    </Form.Item>
  )
}

export default FormInput