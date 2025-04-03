import {Steps} from "~/components/ui/steps";
import {createAsync, Params, RouteSectionProps, useParams} from "@solidjs/router";
import {GET} from "~/routes/api/page/[id].ts";
import {APIEvent} from "@solidjs/start/dist/server";
import {createEffect} from "solid-js";
import {getPage, getPages} from "~/lib/page.ts";

export const route = {
    preload: (event: APIEvent) => getPage(+event.params.id),
};

export default function Page(props: RouteSectionProps) {

    const page = createAsync(async () => (await fetch(`http://localhost:3000/api/page/${props.params.id}`)))

    createEffect(async () => {
        console.log("page",await page())
    })



    return <Steps/>;
}
