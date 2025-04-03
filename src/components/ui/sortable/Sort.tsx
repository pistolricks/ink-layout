import {Show, VoidComponent} from "solid-js";
import {createSortable, Id} from "@thisbeyond/solid-dnd";
import {div} from "big.js";
import {classNames} from "~/lib/utils";


const Sort: VoidComponent<{
    id: Id;
    name: string;
    segment_id: Id;
    hideHeader?: boolean;
    remove: () => void;
}> = (props) => {
    const hideHeader = () => props.hideHeader;

    const sortable = createSortable(props.id, {
        type: "item",
        segment_id: props.segment_id,
    });

    return (
        <>
            <div
                use:sortable
                class={classNames(
                    hideHeader() ? "" : "border border-b",
                    "sortable w-full",
                )}
                classList={{"opacity-25": sortable.isActiveDraggable}}
                style={{"touch-action": "none"}}
            >
                <Show<boolean> when={!hideHeader()}>
                    <div class="rounded-t-lg h-full w-full flex items-start justify-start flex-col  rounded-xs">
                        <div
                            class="h-full w-full flex items-center justify-start relative p-1 border-b shadow dark:border-gray-800">
                            <div class=" flex items-center justify-center">

                                <button type="button" onClick={props.remove}
                                        class="border border-red-400 m-1 w-4 h-4 rounded-full"/>
                                <span class="font-sans uppercase text-base text-gray-500 dark:text-gray-400 truncate">
                                 {props.name}
                            </span>
                            </div>
                            <div class="w-full flex items-center justify-center absolute left-0">

                            </div>
                        </div>
                    </div>
                </Show>
                <div class="h-full min-h-[100px] w-full bg-blue-200">
                    <div class="p-4">

                    </div>
                </div>
            </div>


        </>
    );
};

const SortOverlay: VoidComponent<{ name: string }> = (props) => {
    return (
        <div
            class={classNames(
                "border border-b",
                "sortable w-full",
                "bg-white"
            )}
        >
            <div class="rounded-t-lg h-full w-full flex items-start justify-start flex-col  rounded-xs">
                <div
                    class="h-full w-full flex items-center justify-start relative p-1 border-b shadow dark:border-gray-800">
                    <div class=" flex items-center justify-center">

                        <button type={'button'}
                                class="border border-red-400 m-1 w-4 h-4 rounded-full"/>
                        <span class="font-sans uppercase text-base text-gray-500 dark:text-gray-400 truncate">
                                 {props.name}
                            </span>
                    </div>
                    <div class="w-full flex items-center justify-center absolute left-0">

                    </div>
                </div>
            </div>
            <div class="h-full min-h-[100px] w-full bg-blue-200">
                <div class="p-4">

                </div>
            </div>
        </div>
    );
};

export {Sort, SortOverlay}