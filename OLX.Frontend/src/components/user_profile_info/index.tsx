import { Rating } from "@mui/material"
import { formattedDate, getFormatDateTime, getUserDescr } from "../../utilities/common_funct"
import UserAvatar from "../user_avatar"
import { IOlxUser } from "../../models/user"
interface UserProfileInfoProps {
    user?: IOlxUser
    className?: string
}


const UserProfileInfo: React.FC<UserProfileInfoProps> = ({ user, className }) => {
    return (
        <div className={`flex items-center gap-[4vw] ${className}`}>
            <UserAvatar user={user} className=" h-full w-auto aspect-[16/16] " />

            <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-[1vh]">
                    <span className="font-montserrat font-medium text-adaptive-button-text">{getUserDescr(user)}</span>
                    <Rating sx={{ fontSize: "3.5vh" }} readOnly className="" value={5} />
                </div>
                <div className="flex gap-[1.4vh] flex-col">
                    <span className="font-montserrat text-[#9B7A5B]">Про користувача:</span>
                    {user?.settlementDescrption &&
                        <div className="flex gap-[.3vw]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[2.6vh] p-0 m-0" viewBox="2 0 24 24" fill="none">
                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 11.88 14.12 16.19 12 18.88C9.92 16.21 7 11.85 7 9Z" fill="#000000" />
                                <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" fill="#000000" />
                            </svg>
                            <span className="font-montserrat text-adaptive-1_9_text">{user?.settlementDescrption}</span>
                        </div>
                    }
                    <div className="flex items-center gap-[.4vw]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[2.1vh]" viewBox="0 0 24 24" fill="none">
                            <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9963 8.81854 22.7308 5.76845 20.4812 3.51881C18.2316 1.26918 15.1815 0.00370522 12 0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="black" />
                            <path d="M17.134 15.81L12.5 11.561V6.5C12.5 6.23478 12.3946 5.98043 12.2071 5.79289C12.0196 5.60536 11.7652 5.5 11.5 5.5C11.2348 5.5 10.9804 5.60536 10.7929 5.79289C10.6054 5.98043 10.5 6.23478 10.5 6.5V12C10.4999 12.1388 10.5286 12.276 10.5844 12.4031C10.6401 12.5301 10.7218 12.6442 10.824 12.738L15.783 17.283C15.9796 17.4598 16.2378 17.5525 16.502 17.5411C16.7662 17.5297 17.0154 17.4151 17.196 17.222C17.3749 17.0265 17.4688 16.7679 17.4572 16.5032C17.4456 16.2384 17.3293 15.9891 17.134 15.81Z" fill="black" />
                        </svg>
                        <span className="font-montserrat text-adaptive-1_9_text">На GoSell з {formattedDate(new Date(user?.createdDate || '')).slice(2)}</span>
                    </div>
                    <div className="flex items-center gap-[.4vw]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[2.1vh]" viewBox="0 0 24 24" fill="none">
                            <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9963 8.81854 22.7308 5.76845 20.4812 3.51881C18.2316 1.26918 15.1815 0.00370522 12 0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="black" />
                            <path d="M17.134 15.81L12.5 11.561V6.5C12.5 6.23478 12.3946 5.98043 12.2071 5.79289C12.0196 5.60536 11.7652 5.5 11.5 5.5C11.2348 5.5 10.9804 5.60536 10.7929 5.79289C10.6054 5.98043 10.5 6.23478 10.5 6.5V12C10.4999 12.1388 10.5286 12.276 10.5844 12.4031C10.6401 12.5301 10.7218 12.6442 10.824 12.738L15.783 17.283C15.9796 17.4598 16.2378 17.5525 16.502 17.5411C16.7662 17.5297 17.0154 17.4151 17.196 17.222C17.3749 17.0265 17.4688 16.7679 17.4572 16.5032C17.4456 16.2384 17.3293 15.9891 17.134 15.81Z" fill="black" />
                        </svg>
                        <span className="font-montserrat text-adaptive-1_9_text">Онлайн {getFormatDateTime(new Date(user?.lastActivity || ''))}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default UserProfileInfo