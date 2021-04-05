import Storage from "./LocalStorage";
const KEY = "authentication"

const getAuthInfo = async () => {
    try{
        const data = await Storage.getAllDataForKey(KEY)

        if (data.length > 0){
            return data[0]
        }
    }catch(e){console.error(e)}
}

const saveAuthInfo = async (data) => {
    try{
        console.log("saveAuthInfo")
        console.log(data)
        await Storage.save({key: KEY, id: data._id, data: data})
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