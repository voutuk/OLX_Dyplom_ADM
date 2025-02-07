import { Input } from 'antd'
import './style.scss'

const LocationInput = () => {
    return (
        <div className='location-input'>
            <Input placeholder="Уся Україна"
            className='text-[#3a211c] font-montserrat text-base font-normal leading-normal w-[20.16vw] h-11 p-2.5 rounded-lg border border-[#9b7a5b]/50 justify-start items-center inline-flex' 
            prefix={<svg className='cursor-pointer mr-2' onClick={() => {}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 11.88 14.12 16.19 12 18.88C9.92 16.21 7 11.85 7 9Z" fill="#9B7A5B" />
                        <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" fill="#9B7A5B" />
                    </svg>}
        />
        </div>
        
    )
}

export default LocationInput