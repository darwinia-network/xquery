import * as TE from "fp-ts/lib/TaskEither"
import { none, Option } from "fp-ts/lib/Option"
import { Handler, NextHandlerWithParams, HandlerError } from "../worker"

// rust comparison
type Result<E, T> = TE.TaskEither<E, T>
const Ok = TE.right
const None = none

export const handler: Handler = {
    handle: (params: unknown): Result<HandlerError, Option<NextHandlerWithParams>> => {
        console.debug("In kusama handler --------------------------")
        console.debug(params as {messageId: string, blockHash: string})
        return Ok(None)
    }
}