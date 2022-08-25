import Queue from 'bee-queue'
import * as O from "fp-ts/lib/Option";
import { Option } from "fp-ts/Option"
import { pipe } from 'fp-ts/lib/function'
import * as TE from "fp-ts/lib/TaskEither";
import { sleep } from 'fp-ts-std/Task'
import { mkMilliseconds } from 'fp-ts-std/Date'

import Result = TE.TaskEither;

// TODO: better error
export class HandlerError extends Error {
    public constructor(cause?: Error) {
        super('Handler Error')
        this.cause = cause
    }
}

export type NextHandlerWithParams = {
    handlerName: string,
    params: unknown
}

const sleep2 = (ms: number) => sleep(mkMilliseconds(ms))()

const addJob = (queueName: string, params: unknown) => {
    const queue = new Queue(queueName)
    const job = queue.createJob(params)
    job.save()
}

export interface Handler {
    handle: (params: unknown) => Result<HandlerError, Option<NextHandlerWithParams>>;
}
// 

export const start = (handlerName: string, handler: Handler) => {
    new Queue(handlerName).process(10, (job: Queue.Job<unknown>, done: Queue.DoneCallback<any>) => {

        const process = pipe(
            handler.handle(job.data),
            TE.match(
                (_err) => {
                    // TODO: err check
                    sleep2(10 * 1000).then(() => {
                        addJob(handlerName, job.data)
                    })
                    return "Done with error"
                },
                (optOfNhwp) => {
                    return pipe(
                        optOfNhwp,
                        O.match(
                            () => {
                                return "Done with none"
                            },
                            (nhwp) => {
                                addJob(nhwp.handlerName, nhwp.params)
                                return "Done with next"
                            }
                        )
                    )
                }
            ),

        )

        process().then((result) => {
            // { _tag: 'Left', left: 'xxx' }
            // { _tag: 'Right', right: { _tag: 'None' }
            // { _tag: 'Right', right: { _tag: 'Some', value: 'done' } 
            console.log(result)
        })


        return done(null, { ok: true })
    });
}