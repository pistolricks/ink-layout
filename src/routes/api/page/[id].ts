import {APIEvent} from "@solidjs/start/dist/server";
import {getPage} from "~/lib/page.ts";


export async function GET(event: APIEvent) {

    console.log("event", event)

    return getPage(+event.params.id)
}

export function POST() {
    // ...
}

export function PATCH() {
    // ...
}

export function DELETE() {
    // ...
}
