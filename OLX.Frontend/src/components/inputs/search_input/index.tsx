import React from 'react'
import './style.scss'
import { Input } from 'antd'
import { SearchOutlined } from '@mui/icons-material'

interface SearchInputProps {
    className?: string
    textColor?: string
    color?: string
}

const SearchInput: React.FC<SearchInputProps> = ({ className='' }) => {
    return (
        <div className='search-input'>
            <Input className={` rounded-[1.1vh] ${className} pl-[1vw] w-[38vw] h-[5vh] text-[#BB8A52] text-[2vh] leading-6`}
                placeholder="Пошук"
                prefix={<SearchOutlined style={{ fontSize: "4vh"}} />} />
        </div>
    )
}

export default SearchInput