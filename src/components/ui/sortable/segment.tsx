import {createEffect, createMemo, createSelector, createSignal, For, Show, VoidComponent} from "solid-js";
import {createSortable, Id, maybeTransformStyle, SortableProvider} from "@thisbeyond/solid-dnd";
import {div} from "big.js";
import {classNames} from "~/lib/utils";
import Icon from "~/components/ui/icon";

import {Sort, SortOverlay} from "~/components/ui/sortable/Sort.tsx";


const Segment: VoidComponent<{ id: Id; name: string; title?: string; list: Sort[]; hideHeader?: boolean; addSort: (e: any) => any; removeSort: (e: any) => any }> = (
    props
) => {
    const sortable = createSortable(props.id, {type: "segment"});


    const list = () => props.list;



    const [getSortedSortIds, setSortedSortIds] = createSignal(list().map((item) => item.id))

    const hideHeader = () => props.hideHeader ?? false;



    const [getSelectedId, setSelectedId] = createSignal<Id>(0)

    const isSelected = createSelector<Id>(getSelectedId)

    const selectSort = (id: Id) => {
        setSelectedId(id)
    }

    const removeSort = (id: Id) => {
        setSelectedId(id)
        if (isSelected(id)) {
            props.removeSort(id)
        }
    }


    const handleNewSort = () => {
        let gh = props.id * 100;
        let newA = (gh + list()?.length + 1);

        let newSort = props.addSort({
            name: `${newA}`,
            group: props.id
        })
        console.log("newSort", newSort)


    }




    const sortedSortIds = createMemo(() => {
        setSortedSortIds(list().map((item) => item.id))
        return getSortedSortIds()
    })




    createEffect(() => {
        console.log("props.list", props.list)
        console.log(list())
        console.log(getSelectedId())
    })

    return (
        <>
            <div
                ref={sortable.ref}
                style={maybeTransformStyle(sortable.transform)}
                classList={{"opacity-25": sortable.isActiveDraggable}}
                class={
                    classNames(
                        hideHeader() ? "" : "rounded-lg border border-gray-300",
                        "overflow-hidden")}
            >
                <div class="flex justify-center items-center">
                    <SortableProvider ids={sortedSortIds()}>
                        <For<Sort[]> each={list().filter((item) => item.active === true)}>
                            {(item) => (
                                <Sort id={item.id} name={item.name} segment_id={item.segment_id}
                                      remove={() => removeSort(item.id)}
                                      hideHeader={hideHeader()}/>
                            )}
                        </For>
                    </SortableProvider>
                </div>
                <Show<boolean> when={!hideHeader()}>
                    <div
                        class="column-header cursor-move rounded-b-lg  bg-gray-50" {...sortable.dragActivators}>
                        <div
                            class="flex justify-between items-center px-1  uppercase text-base h-7 text-gray-500 truncate">
                            <div class="flex justify-start items-center">
                                <span><Icon name="Grip" class="p-1"/></span>
                                <span>{props.name}</span>
                            </div>
                            <button as="button" onClick={handleNewSort}>
                                <span><Icon name="Plus" class="p-1"/></span>
                            </button>
                        </div>
                    </div>
                </Show>
            </div>
        </>
    );
};

const SegmentOverlay: VoidComponent<{ name: string; title?: string; list: Sort[] }> = (
    props
) => {
    return (
        <div class="rounded-lg border border-gray-300">
            <div class="flex justify-center items-center bg-gray-100">
                <For<Sort[]> each={props.list}>
                    {(item) => <SortOverlay name={item.name}/>}
                </For>
            </div>
            <div class="column-header cursor-move rounded-b-lg border-gray-300">
                <div class="flex justify-between items-center px-2  uppercase text-xs h-7 text-gray-500">
                    <span>{props.title} {props.name}</span>
                    <span><Icon name="Grip" class="p-0.5"/></span>
                </div>
            </div>
        </div>
    );
};

export {Segment, SegmentOverlay}

