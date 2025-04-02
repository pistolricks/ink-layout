import {
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    SortableProvider,
    createSortable,
    closestCenter,
    maybeTransformStyle,
    Id,
    DragEventHandler,
    Draggable,
    Droppable,
    CollisionDetector,
} from "@thisbeyond/solid-dnd";
import {
    Accessor,
    batch,
    Component,
    createEffect,
    createMemo,
    createSelector,
    createSignal,
    For,
    onMount,
    Show, ValidComponent,
    VoidComponent
} from "solid-js";
import {createStore, produce} from "solid-js/store";
import Big, {div, e} from "big.js";
import Icon from "~/components/ui/icon";
import {classNames} from "~/lib/utils";
import Dialog, {Close} from '@corvu/dialog'
import {Dynamic} from "solid-js/web";
import {Plus} from "lucide-solid";


declare module "solid-js" {
    namespace JSX {
        interface Directives {
            sortable: any; // Corresponds to `use:any`
        }
    }
}

export const ORDER_DELTA = 1000;

interface Base {
    id: Id;
    name: string;
    title?: string;
    type: "group" | "item";
    order: string;
    color?: string;
    active: boolean;
}

interface Group extends Base {
    type: "group";
}

interface Item extends Base {
    type: "item";
    group: Id;
}

type Entity = Group | Item;

const sortByOrder = (entities: Entity[]) => {
    const sorted = entities.map((item) => ({order: new Big(item.order), item}));
    sorted.sort((a, b) => a.order.cmp(b.order));
    return sorted.map((entry) => entry.item);
};

const Item: VoidComponent<{
    id: Id;
    name: string;
    group: Id;
    hideHeader?: boolean;
    remove: () => void;
}> = (props) => {
    const hideHeader = () => props.hideHeader;

    const sortable = createSortable(props.id, {
        type: "item",
        group: props.group,
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

const ItemOverlay: VoidComponent<{ name: string }> = (props) => {
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

const Group: VoidComponent<{ id: Id; name: string; title?: string; items: Item[]; hideHeader?: boolean; addItem: (e: any) => any; removeItem: (e: {id: Id, groupId: Id}) => any }> = (
    props
) => {
    const sortable = createSortable(props.id, {type: "group"});


    const items = () => props.items;

    const [getItems, setItems] = createSignal(items());

    const currentItems = createMemo(() => getItems())

    const [getSortedItemIds, setSortedItemIds] = createSignal(currentItems().map((item) => item.id))

    const hideHeader = () => props.hideHeader ?? false;



    const [getSelectedId, setSelectedId] = createSignal<Id>(0)

    const isSelected = createSelector<Id>(getSelectedId)

    const selectItem = (id: Id) => {

    }

    const removeItem = (e: {id: Id, groupId: Id}) => {
        setSelectedId(e.id)
        if (isSelected(e.id)) {
            props.removeItem({id: e.id, groupId: e.groupId})

            setItems(items())
        }
    }


    const handleNewItem = () => {
        let gh = props.id * 100;
        let newA = (gh + currentItems()?.length + 1);

        let newItem = props.addItem({
            name: `Item ${newA}`,
            group: props.id
        })
        console.log("newItem", newItem)
        setItems(items())

    }




    const sortedItemIds = createMemo(() => {
        setSortedItemIds(currentItems().map((item) => item.id))
        return getSortedItemIds()
    })



    createEffect(() => {
        console.log("props.items", props.items)
        console.log(getItems())
        console.log(currentItems())
        console.log(getSelectedId())
    })

    onMount(() => {
        setItems(items())
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
                    <SortableProvider ids={sortedItemIds()}>
                        <For<Item[]> each={currentItems()}>
                            {(item) => (
                                <Show<boolean> when={item.active === true}>
                                   <div class={'text-gray-600 h-12'}> {item.active}</div>
                                <Item id={item.id} name={item.name} group={item.group}
                                      remove={() => removeItem({ id: item.id, groupId: item.group })}
                                      hideHeader={hideHeader()}/>
                                </Show>
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
                            <button as="button" onClick={handleNewItem}>
                            <span><Icon name="Plus" class="p-1"/></span>
                            </button>
                        </div>
                    </div>
                </Show>
            </div>

            <Dialog.Portal>
                <Dialog.Overlay
                    class="fixed inset-0 z-40 bg-black/50 data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0%"/>
                <Dialog.Content
                    class="fixed left-1/2 top-1/2 z-50 min-w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-corvu-400 bg-white px-6 py-5 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10%">

                    <RemoveItemInnerModal remove={() => removeItem({id: getSelectedId(), groupId: props.id })} id={props.id} />

                </Dialog.Content>
            </Dialog.Portal>
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

export const SortableSection: Component<{
    hideHeader: boolean;
    addNewGroup: (e: any) => any;
}> = props => {

    const hideHeader = () => props.hideHeader;

    const [entities, setEntities] = createStore<Record<Id, Entity>>();

    let nextOrder = 0;

    const getNextOrder = () => {
        nextOrder += ORDER_DELTA;
        return nextOrder.toString();
    };
    const addGroup = (id: Id, name: string, title?: string, color?: string) => {
        setEntities(id, {
            id,
            name,
            title: title,
            color: color,
            type: "group",
            order: getNextOrder(),
            active: true
        });
    };

    const addItem = (id: Id, name: string, group: Id, color?: string) => {
        setEntities(id, {
            id,
            name,
            group,
            color: color,
            type: "item",
            order: getNextOrder(),
            active: true
        });

        console.log(entities)
    };


    const setup = () => {
        batch(() => {
            addGroup(1, "Main", "Main");
            addGroup(2, "Section", "Section");
            addItem(101, "item 101", 1);
            addItem(201, "item 201", 2);
            addItem(202, "item 202", 2);

        });
    };

    onMount(setup);

    const groups = createMemo(() =>
        sortByOrder(
            Object.values(entities).filter((item) => item.type === "group")
        ) as Group[]);

    const groupIds = () => groups().map((group) => group.id);

    const groupOrders = () => groups().map((group) => group.order);


    const groupItems = (groupId: Id) => {

     let gi = sortByOrder(
            Object.values(entities).filter(
                (entity) => entity.type === "item" && entity.group === groupId && entity.active
            )
        ) as Item[];

     console.log(gi)
        return gi;
    }

    const groupItemIds = (groupId: Id) =>
        groupItems(groupId).map((item) => item.id);

    const groupItemOrders = (groupId: Id) =>
        groupItems(groupId).map((item) => item.order);

    const isSortableGroup = (sortable: Draggable | Droppable) =>
        sortable.data.type === "group";

    const closestEntity: CollisionDetector = (draggable, droppables, context) => {
        const closestGroup = closestCenter(
            draggable,
            droppables.filter((droppable) => isSortableGroup(droppable)),
            context
        );
        if (isSortableGroup(draggable)) {
            return closestGroup;
        } else if (closestGroup) {
            const closestItem = closestCenter(
                draggable,
                droppables.filter(
                    (droppable) =>
                        !isSortableGroup(droppable) &&
                        droppable.data.group === closestGroup.id
                ),
                context
            );

            if (!closestItem) {
                return closestGroup;
            }

            const changingGroup = draggable.data.group !== closestGroup.id;
            if (changingGroup) {
                const belowLastItem =
                    groupItemIds(closestGroup.id).at(-1) === closestItem.id &&
                    draggable.transformed.center.y > closestItem.transformed.center.y;

                if (belowLastItem) return closestGroup;
            }

            return closestItem;
        }
    };

    const move = (
        draggable: Draggable,
        droppable: Droppable,
        onlyWhenChangingGroup = true
    ) => {
        if (!draggable || !droppable) return;

        const draggableIsGroup = isSortableGroup(draggable);
        const droppableIsGroup = isSortableGroup(droppable);

        const draggableGroupId = draggableIsGroup
            ? draggable.id
            : draggable.data.group;

        const droppableGroupId = droppableIsGroup
            ? droppable.id
            : droppable.data.group;

        if (
            onlyWhenChangingGroup &&
            (draggableIsGroup || draggableGroupId === droppableGroupId)
        ) {
            return;
        }

        let ids, orders, order;

        if (draggableIsGroup) {
            ids = groupIds();
            orders = groupOrders();
        } else {
            ids = groupItemIds(droppableGroupId);
            orders = groupItemOrders(droppableGroupId);
        }

        if (droppableIsGroup && !draggableIsGroup) {
            order = new Big(orders.at(-1) ?? -ORDER_DELTA).plus(ORDER_DELTA).round();
        } else {
            const draggableIndex = ids.indexOf(draggable.id);
            const droppableIndex = ids.indexOf(droppable.id);
            if (draggableIndex !== droppableIndex) {
                let orderAfter, orderBefore;
                if (draggableIndex === -1 || draggableIndex > droppableIndex) {
                    orderBefore = new Big(orders[droppableIndex]);
                    orderAfter = new Big(
                        orders[droppableIndex - 1] ?? orderBefore.minus(ORDER_DELTA * 2)
                    );
                } else {
                    orderAfter = new Big(orders[droppableIndex]);
                    orderBefore = new Big(
                        orders[droppableIndex + 1] ?? orderAfter.plus(ORDER_DELTA * 2)
                    );
                }

                if (orderAfter !== undefined && orderBefore !== undefined) {
                    order = orderAfter.plus(orderBefore).div(2.0);
                    const rounded = order.round();
                    if (rounded.gt(orderAfter) && rounded.lt(orderBefore)) {
                        order = rounded;
                    }
                }
            }
        }

        if (order !== undefined) {
            setEntities(draggable.id, (entity) => ({
                ...entity,
                order: order.toString(),
                group: droppableGroupId,
            }));
        }
    };

    const onDragOver: DragEventHandler = ({draggable, droppable}) =>
        move(draggable, droppable as Droppable);

    const onDragEnd: DragEventHandler = ({draggable, droppable}) =>
        move(draggable, droppable as Droppable, false);


    const handleNewGroup = () => {
        let amt = Object.values(entities).filter((group) => group.type === "group").length;
        let newA = amt + 1;

        let name = `Section ${newA}`

        addGroup(newA, name, name);
    }

    const handleNewItem = (e: {name: string; group: Id}) => {

       let amt = Object.values(entities).filter(
            (entity) => entity.type === "item" && entity.group === e.group
        ).length;
        let gh = e.group * 100;
        let newA = (gh + amt + 1);
        addItem(newA, e.name, e.group);
        return Object.values(entities).find((entity) => entity.id === newA) as Item

    }


    const handleRemoveItem = (e: {id: Id, groupId: Id}) => {

        console.log("e", e)

        let id = e.id;

        setEntities(id, produce((entity) => {
            entity.active = false
        }))

        console.log('remove',entities)

        groupItems(e.groupId)
    }


    createEffect(() => {
        console.log(entities)
        console.log(groups())
    })

    return (
        <>


            <div class="flex flex-col flex-1 mt-5 self-stretch">
                <DragDropProvider
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    collisionDetector={closestEntity}
                >
                    <DragDropSensors/>
                    <div class={
                        classNames(
                            hideHeader() ? "" : "space-y-4",
                            "flex flex-col"
                        )}>
                        <SortableProvider ids={groupIds()}>
                            <For<Group[]> each={groups()}>
                                {(group, index) => (
                                    <Group
                                        id={group.id}
                                        name={group.name}
                                        title={group.title}
                                        items={groupItems(group.id)}
                                        addItem={handleNewItem}
                                        removeItem={handleRemoveItem}
                                        hideHeader={hideHeader()}
                                    />
                                )}
                            </For>
                        </SortableProvider>

                        <div class="fter:h-px my-8 flex items-center before:h-px before:flex-1  before:bg-gray-300 before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">
                            <button
                                onClick={handleNewGroup}
                                type="button" class="flex items-center rounded-full border border-gray-300 bg-secondary-50 px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100">
                                <Icon name="Plus" class="mr-1 h-4 w-4"/>
                                Add Section
                            </button>
                        </div>

                    </div>
                    <DragOverlay>
                        {(draggable: Draggable) => {
                            const entity = entities[draggable.id];
                            return isSortableGroup(draggable) ? (
                                <GroupOverlay name={entity.name} title={entity?.title} items={groupItems(entity.id)}/>
                            ) : (
                                <ItemOverlay name={entity.name}/>
                            );
                        }}
                    </DragOverlay>
                </DragDropProvider>

            </div>
        </>
    );
};

const RemoveItemInnerModal: Component<{
    id: Id;
    remove: (id: Id) => void;
}> = props => {

    const id = () => props.id;

    return (
        <div class="">
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">

            </div>
            <div class="sm:flex sm:items-start">
                <div
                    class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <svg class="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
                    </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 class="text-base font-semibold text-gray-900" id="modal-title">Delete Item?</h3>
                </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">

                <Close onClick={() => props.remove(id())} type="button"
                       class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Remove</Close>


                <Dialog.Trigger as="button" type="button"
                                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</Dialog.Trigger>
            </div>
        </div>
    );
};

const AddItemInnerModal: Component<{
    id: Id;
    add: ({
        name: string,
        group: Id
              }) => any;
}> = props => {

    const id = () => props.id;

    const [getName, setName] = createSignal("")


    createEffect(() => {
        console.log(getName())
    })

    return (

            <div class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-base font-semibold text-gray-900">Create Section Item</h3>
                    <div class="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Change the email address you want associated with your account.</p>
                    </div>
                    <div class="mt-5 sm:flex sm:items-center">
                        <div class="w-full sm:max-w-xl">
                            <input onInput={(e: InputEvent) => setName((e.target as HTMLInputElement).value)} type="text" name="name" id="name" aria-label="Name"
                                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                   placeholder="name"/>
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">

                        <Close onClick={() => props.add({
                            name: getName(),
                            group: id()
                        })} type="button"
                               class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Create</Close>


                        <Dialog.Trigger as="button" type="button"
                                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</Dialog.Trigger>
                    </div>
                </div>
            </div>

);
};

