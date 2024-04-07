import React from "react"
import { Api } from "@/common/api"

export class ContextData {
    appname: string = ''
    initialized: boolean = false
    api: Api = new Api()
}
export const AppContext = React.createContext({
    context: new ContextData(),
    setContext: (updatedCtx: ContextData) => { }
})
