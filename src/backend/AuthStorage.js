import Storage from "./LocalStorage";

const getAuthInfo = async () => {
    try{
        return data = await Storage.getAllDataForKey('authentication')
    }catch(e){}
}

const saveAuthInfo = async (data) => {
    try{
        await Storage.save('authentication', JSON.stringify(data))
    }catch(e){}
}

const deleteAuthInfo = async (data) => {
    try{
        await Storage.clearMapForKey('authentication')
    }catch(e){}
}

export {
    getAuthInfo,
    saveAuthInfo,
    deleteAuthInfo
}