import Queue from 'bee-queue'
import * as SubQuery from "./utils/subquery"
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { pipe } from 'fp-ts/lib/function'

const fetchSubQuery = SubQuery.fetchSubQuery("http://localhost:3000");

const buildQueryStr = (size: number, after: O.Option<string>) => {
    const from = pipe(
        after,
        O.match(
            () => '',
            (a) => `after: "${a}",`
        )
    )

    return `{  
        query {
            s2sEvents(first: ${size}, ${from} orderBy: START_TIMESTAMP_ASC) {
                nodes {
                    id
                    startTimestamp
                }
                edges {
                    cursor
                }
            }
        }
    }`
}

type S2SEvents = {
    s2sEvents: {
        nodes: [{
            id: string
            startTimestamp: string
        }],
        edges: [{
            cursor: string
        }]
    }
}

const addJob = (queue: Queue, messageId: string) => {
    const params = { messageId: messageId }
    console.log(params)
    const job = queue.createJob(params);
    job.save()
}

// const main = async () => {
//     const queue = new Queue("crab_parachain")

//     let cursor: O.Option<string> = O.none;
//     while (true) {
//         const queryStr = buildQueryStr(2, cursor)
//         const result = await fetchSubQuery<S2SEvents>(queryStr)();

//         pipe(
//             E.Do,
//             E.apS("nodes", pipe(
//                 result,
//                 E.map((result) => result.s2sEvents.nodes),
//             )),
//             E.apS("edges", pipe(
//                 result,
//                 E.map((result) => result.s2sEvents.edges),
//             )),
//             E.map(({ nodes, edges }) => {
//                 if (nodes.length > 0) {
//                     cursor = O.some(edges[edges.length - 1].cursor)
//                     for (let i = 0; i < nodes.length; i++) {
//                         console.log(nodes[i].id)
//                         addJob(queue, nodes[i].id)

//                     }
//                     console.log("--------------")
//                 } else {
//                     sleep(6000 * 10).then(() => {
//                         console.log("wait 6 mins")
//                     })
//                 }
//             })
//         )
//     }
// }

const main = async () => {
    const queue = new Queue("crab_parachain")
    addJob(queue, "0x706163720x8")
}

main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })