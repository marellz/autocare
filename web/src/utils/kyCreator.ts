import ky from "ky";

export const createKyInstance = (path:string) => ky.create({
    prefixUrl: import.meta.env.VITE_API_URL + path,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
