import { IUser } from "../models/account"
import { IOlxUser } from "../models/user";

export const getUserDescr = (user: IUser | IOlxUser | null): string => {

  return user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.email || ''
}

export function stringToColor(string: string | null) {

  if (string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
      return color;
    }
  }
  return '#000000';
}

export const getDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

export const getFormData = (data: any): FormData => {
  const formData = new FormData();
  Object.keys(data).forEach(function (key) {
    formData.append(key, data[key]);
  });
  return formData;
}