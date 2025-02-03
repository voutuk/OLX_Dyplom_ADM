import { IUser } from "../models/account"
import { IOlxUser, IShortOlxUser } from "../models/user";
import { ICategory, ICategoryShort, ICategoryTreeElementModel } from "../models/category";


export const getUserDescr = (user: IUser | IOlxUser | IShortOlxUser | null | undefined): string => {
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

export const buildTree = (categories: ICategory[], parentId?: number, disabled?: number[]): ICategoryTreeElementModel[] => {
  return categories.filter(x => x.parentId == parentId)
    .map(x => ({
      title: x.name,
      value: x.id,
      key: x.id,
      disabled: disabled?.includes(x.id),
      children: buildTree(categories, x.id, disabled)
    }))
};

export const getAllParentFilterIds = (categories: ICategory[], parentId?: number): number[] => {
  let filtersIds: number[] = [];
  while (parentId) {
    const parentCategory = categories.find(x => x.id == parentId);
    if (parentCategory) {
      filtersIds.push(...parentCategory.filters)
    }
    parentId = parentCategory?.parentId;
  }
  return filtersIds
}

export const getLastChildrenCategoriesIds = (categories: ICategory[], categoryId?: number): number[] => {
  const categoriesIds: number[] = [];
  const childCategories = categories.filter(x => x.parentId === categoryId);
  if (childCategories.length > 0) {
    childCategories.forEach(child => {
      categoriesIds.push(...getLastChildrenCategoriesIds(categories, child.id));
    });
  } else if (categoryId !== undefined) {
    categoriesIds.push(categoryId);
  }
  return categoriesIds;
};

export const getAllParents = (categories: ICategory[], parentId?: number): ICategoryShort[] => {
  const parentIds: ICategoryShort[] = [];
  if (parentId) {
    const parent = categories.find(x => x.id === parentId)
    parentIds.push({ id: parentId, name: parent?.name })
    parentIds.push(...getAllParents(categories, parent?.parentId))
  }
  return parentIds;
};

export const getQueryString = (filter: any): string => {
  var result = '';
  Object.keys(filter).forEach((key) => {
    if (filter[key] && filter[key]?.length !== 0) {
      var value = typeof (filter[key]) === "object"
        ? JSON.stringify(filter[key])
        : filter[key];
      var symbol = result === '' ? '?' : '&'
      result += `${symbol + key}=${value}`
    }
  });
  return result;
}

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('uk-UA').format(price);
};

export const formattedDate = (date: Date) => date.toLocaleDateString('uk-UA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).replace(/(\d+) (\w+) (\d+)/, '$1 $2 $3 р.');

export const getFormatDateTime = (date: Date): string => {
  const today: Date = new Date();
  const yesterday: Date = new Date(today.getDate() - 1)

  if (today.getDate() === date.getDate()) {
    return `согодні в ${date.toLocaleTimeString().slice(0, -3)}`
  }
  if (yesterday.getDate() === date.getDate()) {
    return `вчора в ${date.toLocaleTimeString().slice(0, -3)}`
  }
  if (date.getFullYear() < today.getFullYear()) {
    return formattedDate(date)
  }
  return formattedDate(date).slice(0,-5)
}