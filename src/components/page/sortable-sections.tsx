import {
    closestCenter,
    CollisionDetector,
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    Draggable,
    DragOverlay,
    Droppable,
    Id,
    SortableProvider,
} from "@thisbeyond/solid-dnd";
import {batch, Component, createEffect, createMemo, createSignal, For, onMount, Show} from "solid-js";
import {createStore} from "solid-js/store";
import Big, {div} from "big.js";
import Icon from "~/components/ui/icon";
import {classNames} from "~/lib/utils";
import Dialog, {Close} from '@corvu/dialog'
import {Group, GroupOverlay} from "~/components/ui/sortable/group";
import {Item, ItemOverlay} from "~/components/ui/sortable/item";
import {Entity, ORDER_DELTA} from "~/lib/types";
import Resizable from '@corvu/resizable'

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            sortable: any; // Corresponds to `use:any`
        }
    }
}


const sortByOrder = (entities: Entity[]) => {
    if(!entities)return;
    const sorted = entities.map((item) => {
        if(!item)return;
        return ({order: new Big(item.order), item})
    });
    if(!sorted)return;
    sorted.sort((a, b) => a.order.cmp(b.order));
    return sorted.map((entry) => entry.item);
};

export const SortableSections: Component<{
    hideHeader: boolean;
    addNewGroup: (e: any) => any;
}> = props => {

    const hideHeader = () => props.hideHeader;

    const [entities, setEntities] = createStore<Record<Id, Entity|undefined>>();

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
    };

    const setup = () => {
        batch(() => {
            addGroup(1, "Main", "Main");
            addGroup(2, "Section", "Section");
            addItem(101, "101", 1);
            addItem(201, "201", 2);
            addItem(202, "202", 2);

        });
    };

    onMount(setup);

    const groups = createMemo(() => {
        if(!entities)return;
            return sortByOrder(
                Object.values(entities).filter((item): item is Group => item?.type === "group")
            ) as Group[]
    })

    const groupIds = () => groups().map((group) => group.id);

    const groupOrders = () => groups().map((group) => group.order);

    const groupItems = (groupId?: Id) => {
        if(!groupId)return;
        if(!entities)return;
            return sortByOrder(
                Object.values(entities).filter(
                    (entity) => entity?.type === "item" && entity.group === groupId
                )
            ) as Item[];
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
                    groupItemIds(closestGroup.id)[groupItemIds(closestGroup.id).length - 1] === closestItem.id &&
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
            order = new Big(orders[orders.length - 1] ?? -ORDER_DELTA).plus(ORDER_DELTA).round();
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
        if (!entities) return;
        let newA = Object.values(entities).filter((group) => group?.type === "group").length + 1;

        let name = `Section ${newA}`

        addGroup(newA, name, name);
    }

    const handleNewItem = (e: { name: string; group: Id }) => {
        if(!entities)return;
        let amt = Object.values(entities).filter(
            (entity) => entity?.type === "item" && entity.group === e.group
        ).length;
        let gh = e.group * 100;
        let newA = (gh + amt + 1);
        addItem(newA, e.name, e.group);
        return Object.values(entities).find((entity) => entity?.id === newA) as Item

    }


    const handleRemoveItem = (id: Id) => {
        if(!entities)return;

        console.log(id, "remove")
        let arr = Object.values(entities).filter((item) => item?.id !== id);

        setEntities(id, undefined)



        console.log("entities", entities)

    }


    return (
        <>


            <div class="flex flex-col flex-1 mt-5 self-stretch">
                <DragDropProvider
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    collisionDetector={closestEntity}
                    style={{"touch-action": "none"}}

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
                                    <>

                                        <Group
                                            id={group.id}
                                            name={group.name}
                                            title={group.title}
                                            items={groupItems(group.id)}
                                            addItem={handleNewItem}
                                            removeItem={handleRemoveItem}
                                            hideHeader={hideHeader()}
                                        />

                                    </>
                                )}
                            </For>

                        </SortableProvider>

                        <Show<boolean> when={!hideHeader()}>
                            <div
                                class="fter:h-px my-8 flex items-center before:h-px before:flex-1  before:bg-gray-300 before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">
                                <button
                                    onClick={handleNewGroup}
                                    type="button"
                                    class="flex items-center rounded-full border border-gray-300 bg-secondary-50 px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100">
                                    <Icon name="Plus" class="mr-1 h-4 w-4"/>
                                    Add Section
                                </button>
                            </div>
                        </Show>
                    </div>
                    <DragOverlay>
                        {(draggable: Draggable) => {
                            if(!entities)return;
                                const entity = entities[draggable.id];
                                if(!entity)return;
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