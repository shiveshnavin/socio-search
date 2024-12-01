import { MatchResult } from "./gen/model";


export function matchBatchFace(originalFaceUrl: string, threshold: number, faceUrls: string[]): Promise<MatchResult[]> {
    return Promise.resolve(faceUrls.map((url) => ({
        "status": "match",
        "distance": 0.4182,
        "confidence": 58.18,
        "file": "81m1Of3sVSL._AC_UF10001000_QL80_.jpg"
    })))
}