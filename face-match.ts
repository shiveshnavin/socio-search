import axios, { AxiosRequestConfig } from "axios";
import { MatchResult } from "./gen/model";


export function matchBatchFace(originalFaceUrl: string, threshold: number, faceUrls: string[]): Promise<MatchResult[]> {
    let config = {
        url: 'https://semibit-face-match.hf.space/run/predict',
        data: {
            "data": [
                {
                    "path": originalFaceUrl
                },
                threshold,
                faceUrls.map((path) => ({
                    path
                }))
            ]
        }
    } as AxiosRequestConfig
    return axios(config).then(resp => resp.data?.[0] || [])
}