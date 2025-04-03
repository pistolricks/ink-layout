import {Steps} from "~/components/ui/steps";
import {createAsync, RouteSectionProps} from "@solidjs/router";
import {createEffect} from "solid-js";
import {getPages} from "~/lib/page.ts";
import BaseSwapy from "~/components/ui/swapy/base-swapy.tsx";

export const route = {
    preload: () => getPages(),
};


export default function Index(props: RouteSectionProps) {

    const page = createAsync(async () => (await fetch(`http://localhost:3000/api/page`)))

    createEffect(async () => {
        console.log("page",await page())
    })


    return (<> <Steps/></>);
}
