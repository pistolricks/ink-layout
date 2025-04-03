import {APIEvent} from "@solidjs/start/dist/server";
import {getPages} from "~/lib/page.ts";


export async function GET(event: APIEvent) {

    console.log("event", event)

    return getPages()

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
