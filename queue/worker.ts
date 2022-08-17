import { sleep, mkdir, writeFile } from "../utils"
import Queue from 'bee-queue'

// const save = (filename, dirname, content) => {
//     const path = `./data/${dirname}`
//     mkdir(path)
//     writeFile(`${path}/${filename}.json`, content)
// }

const addJob = (queueName: string, params: any) => {
    const queue = new Queue(queueName)
    const job = queue.createJob(params)
    job.timeout(3000).retries(2).save()
}

const next = async (currentHandlerName: string, nextHandler: any) => {
    if (nextHandler.name) {
        if (nextHandler.name == currentHandlerName) {
            await sleep(2000)
        }

        addJob(nextHandler.name, nextHandler.params)
    }
}


const handle = async (handlerName: string, handler: any, params: any) => {
    const result = await handler.handle(params)
    const messageKey = result.messageKey || params.messageKey

    if (!messageKey) {
        throw new Error(`Missing 'messageKey' in params or result of handler '${handlerName}'.`)
    }

    // add message key
    let nextHandler = null
    if (result.nextHandler && result.nextHandler.name) {
        nextHandler = {
            name: result.nextHandler.name,
            params: result.nextHandler.params || {}
        }
        nextHandler.params.messageKey = messageKey
    }

    return {
        messageKey: messageKey,
        messageData: result.messageData,
        nextHandler: nextHandler
    }
}

export const start = async (handlerName: string, handler: any) => {
    new Queue(handlerName).process(10, async (job) => {
        try {
            
            const result = await handle(handlerName, handler, job.data)

            // console.debug(`${handlerName}: params: ${JSON.stringify(job.data)}, result: ${JSON.stringify(result)}`)

            // if (result.messageKey && result.messageData) {

            //     save(handlerName, result.messageKey, JSON.stringify(result.messageData))

            //     if (result.nextHandler) {
            //         await next(handlerName, result.nextHandler)
            //     }

            // }
        } catch (err) {
            console.error(err)
        }

        return { ok: true }
    });
    console.log(`${handlerName} worker is running`)
}

