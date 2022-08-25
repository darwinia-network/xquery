const axios = require('axios');
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from 'fp-ts/lib/function'

// TODO: better error
export class SubQueryError extends Error {
    public constructor(cause?: Error) {
        super('Fetch data from SubQuery failed')
        this.cause = cause
    }
}

export type Resp<T> = {
    data: {
        data: {
            query: T
        }
    }
}

// (url: string) => <T>(query: string) => TE.TaskEither<SubQueryError, T>
export const fetchSubQuery = (url: string) => <T>(query: string): TE.TaskEither<SubQueryError, T> => {
    return pipe(
        TE.tryCatch(
            () => axios.post(url, { query }),
            (reason) => new SubQueryError(reason as Error)
        ),
        TE.map((resp) => {
            return (resp as Resp<T>).data.data.query
        }),
    )
}


// // example
// const buildQueryStr = (size: number) => {
//     return `{  
//         query {
//             s2sEvents(first: ${size}, orderBy: START_TIMESTAMP_ASC) {
//                 nodes {
//                     id
//                     startTimestamp
//                 }
//                 edges {
//                     cursor
//                 }
//             }
//         }
//     }`
// }
// type S2SEvents = {
//     s2sEvents: {
//         nodes: [{
//             id: string
//             startTimestamp: string
//         }],
//         edges: [{
//             cursor: string
//         }]
//     }
// }
// const fetchSubQueryFromLocal = fetchSubQuery("http://localhost:3000")
// const fetchMessageIds = fetchSubQueryFromLocal<S2SEvents>(buildQueryStr(2))

// // run
// ; (async () => {
//     const nodes = pipe(
//         await fetchMessageIds(),
//         E.map((result) => result.s2sEvents.nodes)
//     )

//     console.log(nodes)
// })()
