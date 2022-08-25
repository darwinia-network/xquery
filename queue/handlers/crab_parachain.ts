import * as TE from "fp-ts/lib/TaskEither"
import { some, none, Option } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/function"
import { Handler, NextHandlerWithParams, HandlerError } from "../worker"
import * as SubQuery from "../utils/subquery"

const fetchSubQuery = SubQuery.fetchSubQuery("http://localhost:3000");

const buildQueryStr = (messageId: string) => {
    return `{  
        query {
            s2sEvent(id: "${messageId}") {
                id
                laneId
                nonce
                requestTxHash
                senderId
                block
            }
        }
    }`
}

type S2SEvent = {
    s2sEvent: {
        id: string,
        laneId: string,
        nonce: number,
        requestTxHash: string,
        senderId: string,
        block: {
            blockHash: string
        }
    }
}

export const handler: Handler = {
    handle: (params: unknown): TE.TaskEither<HandlerError, Option<NextHandlerWithParams>> => {
        console.debug("In crab_parachain handler --------------------------")
        console.debug(params as { messageId: string })

        const messageId = (params as { messageId: string }).messageId
        const queryStr = buildQueryStr(messageId)

        return pipe(
            fetchSubQuery<S2SEvent>(queryStr),
            TE.map((result) => result.s2sEvent.block.blockHash),
            TE.map((blockHash) => some({
                handlerName: "kusama",
                params: { messageId, blockHash }
            })),
            TE.mapLeft((err) => new HandlerError(err))
        )
    }
}