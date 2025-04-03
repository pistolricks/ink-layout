import {query} from "@solidjs/router";
import {APIEvent} from "@solidjs/start/dist/server";


export const getPages = query(async () => {
    "use server";
    return ((await fetch(`http://localhost:4000/v1/vendors`)).json());
}, "pages")

export const getPage = query(async (id: number) => {
    "use server";
    return ((await fetch(`http://localhost:4000/v1/vendors/${id}`)).json());
}, "page")
