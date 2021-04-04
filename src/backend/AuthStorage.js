import Storage from "./LocalStorage";
const KEY = "authentication"

const getAuthInfo = async () => {
    try{
        return data = await Storage.getAllDataForKey(KEY)
    }catch(e){console.error(e)}
}

const saveAuthInfo = async (data) => {
    try{
        console.log("saveAuthInfo")
        console.log(data)
        await Storage.save({key: KEY, id: data._id, data: JSON.stringify(data)})
    }catch(e){console.error(e)}
}

const deleteAuthInfo = async (data) => {
    try{
        await Storage.clearMapForKey(KEY)
    }catch(e){console.error(e)}
}

export {
    getAuthInfo,
    saveAuthInfo,
    deleteAuthInfo
}