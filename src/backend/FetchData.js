import Config from "./Config";

export default async (path) => {
  let data;
  let response = await fetch(Config.BASE_URL + path , {method: "GET", headers: Config.HEADERS});

  if (response){
    return await response.json()
  }

};
