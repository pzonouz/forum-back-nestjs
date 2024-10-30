export const ObjectItemsToLowercase = (obj: any) => {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].toLowerCase();
      } else if (typeof obj[key] === 'object') {
        ObjectItemsToLowercase(obj[key]);
      }
    });
  }
  return obj;
};
