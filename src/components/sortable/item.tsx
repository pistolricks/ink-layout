import {Match, Show, Switch, VoidComponent} from "solid-js";
import {createSortable, Id} from "@thisbeyond/solid-dnd";
import {div} from "big.js";
import {classNames} from "~/lib/utils.ts";
import Segment from "~/components/sortable/segment.tsx";
import Icon from "~/components/ui/icon.tsx";


const Item: VoidComponent<{
    id: Id;
    name: string;
    group: Id;
    isDraggable: boolean;
    hideHeader: boolean;
    count: number;
    remove: () => void;
}> = (props) => {

    const isDraggable = () => props.isDraggable;
    const hideHeader = () => props.hideHeader;
    const count = () => props.count;

    const sortable = createSortable(props.id, {
        type: "item",
        group: props.group,
    });

    return (
        <>


            <Switch>
                <Match<boolean> when={hideHeader()}>
                    <PreviewOverlay name={props.name} hideHeader={hideHeader()}/>
                </Match>
                <Match<boolean> when={!isDraggable()}>
                    <SegmentOverlay name={props.name} hideHeader={hideHeader()}/>
                </Match>
            <Match<boolean>
                when={isDraggable()}>
                <div
                    use:sortable
                    classList={{"opacity-25": sortable.isActiveDraggable}}
                    class={classNames(
                        hideHeader() ? "" : "border border-b",
                        "w-full sortable",
                    )}

                >

                    <div class=" sortable w-full bg-blue-200 relative">
                        <div class="h-[300px]">
                            <div class="h-[300px] p-0.5 flex justify-center items-center">
                                {props.name}
                            </div>
                        </div>
                    </div>
                    <Show<boolean> when={!hideHeader()}>
                        <div
                            class=" rounded-t-lg h-full w-full flex items-start justify-between flex-col  rounded-xs">
                            <div
                                class="h-full w-full flex items-center justify-between relative p-1 border-b shadow dark:border-gray-800">
                                <div class="flex items-center justify-center text-gray-500 truncate space-x-1">


                                    <button type="button" onClick={props.remove}>
                                        <Icon name="SquareX" stroke-width={1.5} class="size-6 stroke-red-300 p-0.5"/>
                                    </button>

                                    <span
                                        class="font-sans uppercase text-base text-gray-500 dark:text-gray-400 truncate">
                                 {props.name}
                            </span>
                                </div>
                                <div
                                    class="w-1/2  h-6 flex items-center justify-end">
                                <span class="">
                                    <Icon
                                        name="Grip"
                                        style={{"touch-action": "none"}}
                                        class="sortable p-1 size-6 stroke-gray-500"
                                    />
                                </span>
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>
            </Match>

            </Switch>

        </>
    );
};

const ItemOverlay: VoidComponent<{ name: string }> = (props) => {
    return (
        <div
            class={classNames(
                "border border-b",
                "sortable w-full",
                "bg-white"
            )}
        >

            <div class="h-full  w-full bg-blue-200">
                <Segment count={8}/>
            </div>
            <div
                class=" rounded-t-lg h-full w-full flex items-start justify-between flex-col  rounded-xs">
                <div
                    class="h-full w-full flex items-center justify-between relative p-1 border-b shadow dark:border-gray-800">
                    <div class="flex items-center justify-center text-gray-500 truncate space-x-1">


                        <button type="button">
                            <Icon name="SquareX" stroke-width={1.5} class="size-6 stroke-red-300 p-0.5"/>
                        </button>

                        <span
                            class="font-sans uppercase text-base text-gray-500 dark:text-gray-400 truncate">
                                 {props.name}
                            </span>
                    </div>
                    <div
                        class="w-1/2  h-6 flex items-center justify-end">
                                <span class="">
                                    <Icon
                                        name="Grip"
                                        style={{"touch-action": "none"}}
                                        class="sortable p-1 size-6 stroke-gray-500"
                                    />
                                </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SegmentOverlay: VoidComponent<{ name: string, hideHeader: boolean }> = (props) => {
    const hideHeader = () => props.hideHeader;

    return (
        <div
            class={classNames(
                "border border-b",
                "sortable w-full",
                "bg-white"
            )}
        >

            <div class="h-full  w-full bg-blue-200">
                <Segment count={8}/>
            </div>
            <Show<boolean> when={!hideHeader()}>
                <div
                    class=" rounded-t-lg h-full w-full flex items-start justify-between flex-col  rounded-xs">
                    <div
                        class="h-full w-full flex items-center justify-between relative p-1 border-b shadow dark:border-gray-800">
                        <div class="flex items-center justify-center text-gray-500 truncate space-x-1">


                            <button type="button">
                                <Icon name="SquareX" stroke-width={1.5} class="size-6 stroke-red-300 p-0.5"/>
                            </button>

                            <span class="font-sans uppercase text-base text-gray-500 dark:text-gray-400 truncate">
                                 {props.name}
                            </span>
                        </div>
                        <div
                            class="w-4/6  h-6 flex items-center justify-end">
                                <span class="">
                                    <Icon
                                        name="SwatchBook"
                                        class="sortable p-1 size-6 stroke-gray-500"/></span>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};

const PreviewOverlay: VoidComponent<{ name: string, hideHeader: boolean }> = (props) => {

    return (
        <div
            class={classNames(
                "border border-b",
                "sortable w-full",
                " pb-0.5 bg-white"
            )}
        >
            <div class="h-full  w-full bg-blue-200">
                <Segment count={8}/>
            </div>
        </div>
    );
};


export {Item, ItemOverlay, SegmentOverlay}