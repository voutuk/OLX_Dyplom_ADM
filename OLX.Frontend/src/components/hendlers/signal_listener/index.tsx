import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import React, { useEffect } from 'react'
import { APP_ENV } from '../../../constants/env';
import { useSelector } from 'react-redux';
import { addMessage, getToken, getUser } from '../../../redux/slices/userSlice';
import { useAppDispatch } from '../../../redux';
import { IAdminMesssage } from '../../../models/adminMesssage';
import { adminMessageAuthApi} from '../../../redux/api/adminMessageApi';

const SignalRListener: React.FC = () => {
    const user = useSelector(getUser);
    const token = useSelector(getToken);
    const dispatcher = useAppDispatch();
    useEffect(() => {
        if(user){
            (async () => {
                const connection = new HubConnectionBuilder()
                    .withUrl(APP_ENV.SERVER_HOST + '/hub',{
                        accessTokenFactory: () => token || ""
                    })
                    .withAutomaticReconnect()
                    .build();
    
                connection.on('ReceiveAdminMessage', ( message: IAdminMesssage) => {
                    dispatcher(addMessage(message))
                    dispatcher(adminMessageAuthApi.util.invalidateTags(['Messeges']))
                });

                connection.on('ReceiveUserMessage', ( message: IAdminMesssage) => {
                    dispatcher(addMessage(message))
                    dispatcher(adminMessageAuthApi.util.invalidateTags(['Messeges']))
                });
        
                try {
                    await connection.start();
                } catch (err) {
                    console.log(err);
                }
    
            })()
        }
       
    }, [user]);
    return null
}

export default SignalRListener
