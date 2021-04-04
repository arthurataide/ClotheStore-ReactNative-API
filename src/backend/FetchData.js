import Config from "./ConfigAPI";

export const getData = async (path) => {
  try {
    let response = await fetch(Config.BASE_URL + path, {
      method: "GET",
      headers: Config.HEADERS,
    });

    if (response) {
      return await response.json();
    }
  } catch (e) {}
};

export const postData = async (path, data) => {
  try {
    let response = await fetch(Config.BASE_URL + path, {
      method: "POST",
      headers: Config.HEADERS,
      body: JSON.stringify(data),
    });
    return response;
  } catch (e) {}
};

export const updateData = async (path, data) => {
  try {
    let response = await fetch(Config.BASE_URL + path, {
      method: "PUT",
      headers: Config.HEADERS,
      body: JSON.stringify(data),
    });

    return response;
  } catch (e) {}
};

export const deleteData = async (path) => {
  try {
    let response = await fetch(Config.BASE_URL + path, {
      method: "DELETE",
      headers: Config.HEADERS,
    });

    return response;
  } catch (e) {}
};
