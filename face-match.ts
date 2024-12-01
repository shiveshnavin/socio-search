import axios, { AxiosRequestConfig } from "axios";
import { MatchResult } from "./gen/model";


export async function matchBatchFace(originalFaceUrl: string, threshold: number, faceUrls: string[]): Promise<MatchResult[]> {
    let config = {
        method: 'POST',
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
    let response = await axios(config)
    return response.data.data?.[0]
}