const ENV = {
  dev: {
    API_URL: "http://10.1.14.16:5234/api/",
  },
  prod: {
    API_URL: "https://api.perusahaan.com",
  },
};

export const Config = __DEV__ ? ENV.dev : ENV.prod;
