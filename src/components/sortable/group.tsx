import {createEffect, createMemo, createSelector, createSignal, For, Show, VoidComponent} from "solid-js";
import {createSortable, Id, maybeTransformStyle, SortableProvider} from "@thisbeyond/solid-dnd";
import {div, s} from "big.js";
import {classNames} from "~/lib/utils.ts";
import Icon from "~/components/ui/icon.tsx";
import Dialog from "@corvu/dialog";
import {Item, ItemOverlay} from "~/components/sortable/item.tsx";
import Resizable from '@corvu/resizable'

const Group: VoidComponent<{
    id: Id;
    name: string;
    title?: string;
    items: Item[];
    hideHeader?: boolean;
    addItem: (e: any) => any;
    removeItem: (e: any) => any
    removeGroup: (e: any) => any
}> = (
    props
) => {
    const sortable = createSortable(props.id, {type: "group"});


    const items = () => props.items;


    const [getSortedItemIds, setSortedItemIds] = createSignal(items().map((item) => item.id))

    const hideHeader = () => props.hideHeader ?? false;

    const [getSelectedId, setSelectedId] = createSignal<Id>(0)

    const selectedId = createMemo(() => getSelectedId())

    const isSelected = createSelector<Id>(selectedId)


    const removeItem = (id: Id) => {
        setSelectedId(id)
        if (isSelected(id)) {
            props.removeItem(id)
        }
    }

    const [getSelectedGroupId, setSelectedGroupId] = createSignal<Id>(0)

    const selectedGroupId = createMemo(() => getSelectedGroupId())

    const isSelectedGroup = createSelector<Id>(selectedGroupId)

    const removeGroup = (id: Id) => {
        setSelectedGroupId(id)
        if (isSelectedGroup(id)) {
            props.removeGroup(id)
        }
    }


    const handleNewItem = () => {
        let gh = props.id * 100;
        let newA = (gh + items()?.length + 1);

        let newItem = props.addItem({
            name: `${newA}`,
            group: props.id
        })
        console.log("newItem", newItem)


    }


    const sortedItemIds = createMemo(() => {
        setSortedItemIds(items().map((item) => item.id))
        return getSortedItemIds()
    })


    const [getSizes, setSizes] = createSignal<number[]>([0])

    const sizes = createMemo(() => {
        return getSizes()
    })

    const filtered = createMemo(() => items().filter((item) => item.active === true))

   // createEffect(() => console.log("filtered", filtered(), getSizes(), sizes()))




    return (
        <>
            <div
                ref={sortable.ref}
                style={maybeTransformStyle(sortable.transform)}
                classList={{"opacity-25": sortable.isActiveDraggable}}
                class={
                    classNames(
                        hideHeader() ? "" : "rounded-lg border border-gray-300",
                        "overflow-hidden h-full")}
            >

                <Show<boolean> when={!hideHeader()}>
                    <div
                        class="column-header  rounded-b-lg  bg-gray-50" {...sortable.dragActivators}>
                        <div
                            class="flex justify-between items-center px-1  uppercase text-base h-7 text-gray-500 truncate">
                            <div class="flex justify-start items-center space-x-1">
                                <Show<boolean>
                                    fallback={
                                        <button as="button" onClick={removeGroup}>
                                            <span><Icon name="SquareX" class="p-0.75 stroke-red-300"/></span>
                                        </button>
                                    }
                                    when={filtered()?.length > 0}>
                                    <span><Icon name="Grip" class="p-1"/></span>
                                </Show>

                                <span>{props.name}</span>
                            </div>
                            <div class="flex justify-end items-center space-x-1">
                            <button onClick={handleNewItem} as="button" >
                                <span><Icon name="Plus" class="p-1"/></span>
                            </button>
                            </div>
                        </div>
                    </div>
                </Show>
                <div class="flex justify-center items-center h-full min-w-full">
                    <SortableProvider ids={sortedItemIds()} class="size-full">
                        <Resizable onSizesChange={setSizes} class="min-w-full h-full" orientation="horizontal">
                            <For<Item[]> each={filtered()}>
                                {(item, index) => (
                                    <>
                                        <Resizable.Panel
                                            minSize={0.15}
                                            initialSize={1 / filtered().length}
                                            class="rounded-lg bg-corvu-100 w-full"
                                        >
                                            <Item id={item.id} name={item.name} group={item.group}
                                                  remove={() => removeItem(item.id)}
                                                  hideHeader={hideHeader()}
                                                  count={filtered().length}
                                            />
                                        </Resizable.Panel>
                                        <Show<boolean> when={items().length - 1 !== index()}>
                                            <Resizable.Handle
                                                aria-label="Resize Handle"
                                                class="group basis-1 px-0.5"
                                            >
                                                <div
                                                    class="size-full rounded-sm transition-colors group-data-active:bg-corvu-300 group-data-dragging:bg-corvu-100"/>
                                            </Resizable.Handle>
                                        </Show>
                                    </>
                                )}
                            </For>
                        </Resizable>
                    </SortableProvider>
                </div>

            </div>
        </>
    );
};

const GroupOverlay: VoidComponent<{ name: string; title?: string; items: Item[] }> = (
    props
) => {
    return (
        <div class="rounded-lg border border-gray-300">
            <div
                class="column-header cursor-move rounded-b-lg  bg-gray-50">
                <div
                    class="flex justify-between items-center px-1  uppercase text-base h-7 text-gray-500 truncate">
                    <div class="flex justify-start items-center">
                        <span><Icon name="Grip" class="p-1"/></span>
                        <span>{props.name}</span>
                    </div>
                    <button as="button">
                        <span><Icon name="Plus" class="p-1"/></span>
                    </button>
                </div>
            </div>
            <div class="flex justify-center items-center bg-gray-100">
                <For<Item[]> each={props.items}>
                    {(item) => <ItemOverlay name={item.name}/>}
                </For>
            </div>
        </div>
    );
};

export {Group, GroupOverlay}

