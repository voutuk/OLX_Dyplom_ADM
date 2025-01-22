import { IUser } from "../models/account"
import { IOlxUser } from "../models/user";
import { ICategory } from "../models/category";

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
    if (Array.isArray(data[key])) {
      if (typeof data[key][0] === 'object' && !(data[key] instanceof File)) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        data[key].forEach((item: any) => formData.append(key, item));
      }
    } else if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }

  });
  return formData;
}

export const mapCategoryToTreeData = (categories: ICategory[]): any[] => {
  return categories.map((category) => ({
    title: category.name,
    value: category.id,
    key: category.id,
    children: mapCategoryToTreeData(category.childs),
  }));
};



export const getCategoryFromTree = (categoryId: number, categoryTree: ICategory[]): ICategory | null => {
  for (let index = 0; index < categoryTree.length; index++) {
    if (categoryId === categoryTree[index].id) {
      return categoryTree[index]
    }
    else if (categoryTree[index].childs.length > 0) {
      const category = getCategoryFromTree(categoryId, categoryTree[index].childs)
      if (category) {
        return category;
      }
      continue;
    }
  }
  return null

};