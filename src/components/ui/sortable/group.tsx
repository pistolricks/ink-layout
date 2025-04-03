import {createEffect, createMemo, createSelector, createSignal, For, Show, VoidComponent} from "solid-js";
import {createSortable, Id, maybeTransformStyle, SortableProvider} from "@thisbeyond/solid-dnd";
import {div} from "big.js";
import {classNames} from "~/lib/utils";
import Icon from "~/components/ui/icon";
import Dialog from "@corvu/dialog";
import {Item,ItemOverlay} from "~/components/ui/sortable/item";
import Resizable from '@corvu/resizable'

const Group: VoidComponent<{ id: Id; name: string; title?: string; items: Item[]; hideHeader?: boolean; addItem: (e: any) => any; removeItem: (e: any) => any }> = (
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
                <div class="flex justify-center items-center h-full min-w-full">
                    <SortableProvider ids={sortedItemIds()} class="size-full">
                    <Resizable class="min-w-full h-full" orientation="horizontal">
                        <For<Item[]> each={items().filter((item) => item.active === true)}>
                            {(item, index) => (
                                <>
                                    <Resizable.Panel
                                        initialSize={1 / items().length}
                                        class="rounded-lg bg-corvu-100 w-full"
                                    >
                                <Item id={item.id} name={item.name} group={item.group}
                                      remove={() => removeItem(item.id)}
                                      hideHeader={hideHeader()}/>
                                </Resizable.Panel>
                                    <Show<boolean> when={items().length - 1 !== index()}>
                                    <Resizable.Handle
                                        aria-label="Resize Handle"
                                        class="group basis-1 px-0.5"
                                    >
                                        <div class="size-full rounded-sm transition-colors group-data-active:bg-corvu-300 group-data-dragging:bg-corvu-100" />
                                    </Resizable.Handle>
                                    </Show>
                                </>
                            )}
                        </For>
                        </Resizable>
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
                            <button as="button" onClick={handleNewItem}>
                                <span><Icon name="Plus" class="p-1"/></span>
                            </button>
                        </div>
                    </div>
                </Show>
            </div>
        </>
    );
};

const GroupOverlay: VoidComponent<{ name: string; title?: string; items: Item[] }> = (
    props
) => {
    return (
        <div class="rounded-lg border border-gray-300">
            <div class="flex justify-center items-center bg-gray-100">
                <For<Item[]> each={props.items}>
                    {(item) => <ItemOverlay name={item.name}/>}
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

export {Group, GroupOverlay}

