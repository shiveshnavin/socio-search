
export function getNavParamsFromDeeplink(url: string) {
    let parts = url.split("/");

    let root, rootParams: any = {};
    root = parts[0];
    if (parts.length > 1) {

        let obj = {
            screen: '',
            params: {}
        };
        let lastCloneObj = undefined;
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            let cloneObj = Object.assign({}, obj);

            if (part?.indexOf("?") > -1) {
                cloneObj.screen = part.split("?")[0];
                const query = part.split("?")[1];
                const params: any = {};
                const queryParams = query.split("&");
                queryParams?.forEach((pk) => {
                    const [value, key] = pk.split("=")
                    params[key] = value;
                });
                cloneObj.params = params;
            } else {
                cloneObj.screen = part;
            }
            if (lastCloneObj == undefined) {
                lastCloneObj = cloneObj;
            } else {
                lastCloneObj.params = cloneObj;
            }
        }
        rootParams = lastCloneObj;
    }
    return [root, rootParams];
}
