export const cleanObject = (obj: Record<any, any>) => {
  for (const key in obj) {
    if (typeof obj[key] === "undefined") {
      delete obj[key];
    }
  }
  return obj;
};
