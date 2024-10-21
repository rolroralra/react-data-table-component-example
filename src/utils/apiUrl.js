export const getApiUrl = () => {
    console.log(`process.env.NODE_ENV=${process.env.NODE_ENV}`);

    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PRODUCTION
    : process.env.REACT_APP_API_URL_LOCAL;
    
    console.log(`apiUrl=${apiUrl}`);

    return apiUrl;
  };