import { getCookie, setCookie } from "../helpers/cookie";


export const getUserIp = async () => {
  try {

    let geo = getCookie("user_geo_location");
    if(geo) {
        return JSON.parse(geo);
    }
    
    // load the user ip
    let res = await fetch("https://ipv4.jsonip.com/");
    res = await res.json();
    let details = {
      ip: res.ip,
    };

    // set cookie for 1 day
    setCookie("user_geo_location", JSON.stringify(details), 1);

    return {
      ip: res.ip,
    };
  } catch (error) {
    console.log(error);
  }
};
