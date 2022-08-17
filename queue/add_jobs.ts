import Queue from 'bee-queue'
import { sleep } from "../utils"

const fetch = require('./fetch_graph').fetch('http://localhost:3000');

const buildQueryStr = (size: number, after: string) => {
    let from = '' 
    if(after) { 
        from = `after: "${after}",`
    }

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

const addJob = (queue: Queue, messageId: string) => {
    const params = { messageId: messageId }
    console.log(params)
    const job = queue.createJob(params);
    job
        .timeout(3000)
        .retries(2)
        .save()
}

// const fetchMessages = async (cursor: string) => {
//     const query = buildQueryStr(2, cursor)
//     const result = await fetch(query, "s2sEvents")
//     const nodes = result.nodes;
// }

const main = async () => {
    const queue = new Queue("crab_parachain")

    let cursor = undefined;
    while(true) {
        const query = buildQueryStr(2, cursor)
        const result = await fetch(query, "s2sEvents")
        const nodes = result.nodes;
        if(nodes.length > 0) {
            const edges = result.edges;
            cursor = edges[edges.length-1].cursor
            for(let i = 0; i < nodes.length; i++) {
                console.log(nodes[i].id)
                addJob(queue, nodes[i].id)
                
            }
            console.log("--------------")
        } else {
            await sleep(6000 * 10)
        }
        
    }
        
}

main()
    .then(async () => {
        // await sleep(2000)
    })
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })