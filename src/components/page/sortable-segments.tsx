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

import {Sort, SortOverlay} from "~/components/ui/sortable/Sort";
import {Entity, ORDER_DELTA} from "~/lib/types";
import {Segment, SegmentOverlay} from "~/components/ui/sortable/segment";
import {log} from "vinxi/dist/types/lib/logger";


declare module "solid-js" {
    namespace JSX {
        interface Directives {
            sortable: any; // Corresponds to `use:any`
        }
    }
}


const sortByOrder = (segments: Segment[]) => {
    const sorted = segments.map((item) => ({order: new Big(item.order), item}));
    sorted.sort((a, b) => a.order.cmp(b.order));
    return sorted.map((entry) => entry.item);
};

const sortSortsByOrder = (segments: Sort[]) => {
    const sorted = segments.map((item) => ({order: new Big(item.order), item}));
    sorted.sort((a, b) => a.order.cmp(b.order));
    return sorted.map((entry) => entry.item);
};

export const SortableSections: Component<{
    hideHeader: boolean;
    addNewSegment: (e: any) => any;
}> = props => {

    const hideHeader = () => props.hideHeader;

    const [segments, setSegments] = createStore<Record<Id, Segment>>();
    const [sorts, setSorts] = createStore<Record<Id, Sort>>();
    let nextOrder = 0;

    const getNextOrder = () => {
        nextOrder += ORDER_DELTA;
        return nextOrder.toString();
    };
    const addSegment = (id: Id, name: string, title?: string, color?: string) => {
        setSegments(id, {
            id,
            name,
            title: title,
            color: color,
            order: getNextOrder(),
            active: true,
            list: []
        });
    };

    const addSort = (id: Id, name: string, segment: Id, color?: string) => {
        setSegments(id, {
            id,
            name,
            segment,
            color: color,
            type: "item",
            order: getNextOrder(),
            active: true
        });

        console.log(segments)
    };

    const setup = () => {
        batch(() => {
            addSegment(1, "Main", "Main");
            addSegment(2, "Section", "Section");
            addSort(101, "101", 1);
            addSort(201, "201", 2);
            addSort(202, "202", 2);

        });
    };

    onMount(setup);

    const segmented = createMemo(() =>
        sortByOrder(
            Object.values(segments).filter((item) => item.type === "segment")
        ) as Segment[]);

    const segmentIds = () => segmented().map((segment) => segment.id);

    const segmentOrders = () => segmented().map((segment) => segment.order);

    const segmentSorts = (segmentId: Id) => {
        let gi = sortSortsByOrder(
            Object.values(sorts).filter(
                (entity) => entity.segment === segmentId
            )
        ) as Sort[];

        let segment = Object.values(segments).find((segment: Segment) => segment.id === segmentId)

        segment.list

        console.log(gi)
        return gi;
    }

    const segmentSortIds = (segmentId: Id) =>
        segmentSorts(segmentId).map((item) => item.id);

    const segmentSortOrders = (segmentId: Id) =>
        segmentSorts(segmentId).map((item) => item.order);

    const isSortableSegment = (sortable: Draggable | Droppable) =>
        sortable.data.type === "segment";

    const closestEntity: CollisionDetector = (draggable, droppables, context) => {
        const closestSegment = closestCenter(
            draggable,
            droppables.filter((droppable) => isSortableSegment(droppable)),
            context
        );
        if (isSortableSegment(draggable)) {
            return closestSegment;
        } else if (closestSegment) {
            const closestSort = closestCenter(
                draggable,
                droppables.filter(
                    (droppable) =>
                        !isSortableSegment(droppable) &&
                        droppable.data.segment === closestSegment.id
                ),
                context
            );

            if (!closestSort) {
                return closestSegment;
            }

            const changingSegment = draggable.data.segment !== closestSegment.id;
            if (changingSegment) {
                const belowLastSort =
                    segmentSortIds(closestSegment.id)[segmentSortIds(closestSegment.id).length - 1] === closestSort.id &&
                    draggable.transformed.center.y > closestSort.transformed.center.y;

                if (belowLastSort) return closestSegment;
            }

            return closestSort;
        }
    };

    const move = (
        draggable: Draggable,
        droppable: Droppable,
        onlyWhenChangingSegment = true
    ) => {
        if (!draggable || !droppable) return;

        const draggableIsSegment = isSortableSegment(draggable);
        const droppableIsSegment = isSortableSegment(droppable);

        const draggableSegmentId = draggableIsSegment
            ? draggable.id
            : draggable.data.segment;

        const droppableSegmentId = droppableIsSegment
            ? droppable.id
            : droppable.data.segment;

        if (
            onlyWhenChangingSegment &&
            (draggableIsSegment || draggableSegmentId === droppableSegmentId)
        ) {
            return;
        }

        let ids, orders, order;

        if (draggableIsSegment) {
            ids = segmentIds();
            orders = segmentOrders();
        } else {
            ids = segmentSortIds(droppableSegmentId);
            orders = segmentSortOrders(droppableSegmentId);
        }

        if (droppableIsSegment && !draggableIsSegment) {
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
            setSegments(draggable.id, (entity) => ({
                ...entity,
                order: order.toString(),
                segment: droppableSegmentId,
            }));
        }
    };

    const onDragOver: DragEventHandler = ({draggable, droppable}) =>
        move(draggable, droppable as Droppable);

    const onDragEnd: DragEventHandler = ({draggable, droppable}) =>
        move(draggable, droppable as Droppable, false);


    const handleNewSegment = () => {
        let amt = Object.values(segments).filter((segment) => segment.type === "segment").length;
        let newA = amt + 1;

        let name = `Section ${newA}`

        addSegment(newA, name, name);
    }

    const handleNewSort = (e: { name: string; segment: Id }) => {

        let amt = Object.values(segments).filter(
            (entity) => entity.type === "item" && entity.segment === e.segment
        ).length;
        let gh = e.segment * 100;
        let newA = (gh + amt + 1);
        addSort(newA, e.name, e.segment);
        return Object.values(segments).find((entity) => entity.id === newA) as Sort

    }


    const handleRemoveSort = (id: Id) => {
        let item = Object.values(segments).find((item) => item.id === id) as Sort;

        setSegments(item.id, {
            id: item.id,
            name: item.name,
            segment: item.segment,
            color: item.color,
            type: "item",
            order: item.order,
            active: false
        });


    }


    createEffect(() => {
        console.log(segments)

    })

    return (
        <>


            <div class="flex flex-col flex-1 mt-5 self-stretch">
                <DragDropProvider
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    collisionDetector={closestEntity}
                    style={{ "touch-action": "none" }}

                >
                    <DragDropSensors/>
                    <div class={
                        classNames(
                            hideHeader() ? "" : "space-y-4",
                            "flex flex-col"
                        )}>
                        <SortableProvider ids={segmentIds()}>
                            <For<Segment[]> each={segmented()}>
                                {(segment, index) => (
                                    <Segment
                                        id={segment.id}
                                        name={segment.name}
                                        title={segment.title}
                                        items={segmentSorts(segment.id)}
                                        addSort={handleNewSort}
                                        removeSort={handleRemoveSort}
                                        hideHeader={hideHeader()}
                                    />
                                )}
                            </For>
                        </SortableProvider>

                        <Show<boolean> when={!hideHeader()}>
                            <div
                                class="fter:h-px my-8 flex items-center before:h-px before:flex-1  before:bg-gray-300 before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">
                                <button
                                    onClick={handleNewSegment}
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
                            const entity = segments[draggable.id];
                            return isSortableSegment(draggable) ? (
                                <SegmentOverlay name={entity.name} title={entity?.title} items={segmentSorts(entity.id)}/>
                            ) : (
                                <SortOverlay name={entity.name}/>
                            );
                        }}
                    </DragOverlay>
                </DragDropProvider>

            </div>
        </>
    );
};

const RemoveSortInnerModal: Component<{
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
                    <h3 class="text-base font-semibold text-gray-900" id="modal-title">Delete Sort?</h3>
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

const AddSortInnerModal: Component<{
    id: Id;
    add: ({
              name: string,
              segment: Id
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
                <h3 class="text-base font-semibold text-gray-900">Create Section Sort</h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Change the email address you want associated with your account.</p>
                </div>
                <div class="mt-5 sm:flex sm:items-center">
                    <div class="w-full sm:max-w-xl">
                        <input onInput={(e: InputEvent) => setName((e.target as HTMLInputElement).value)} type="text"
                               name="name" id="name" aria-label="Name"
                               class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                               placeholder="name"/>
                    </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">

                    <Close onClick={() => props.add({
                        name: getName(),
                        segment: id()
                    })} type="button"
                           class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Create</Close>


                    <Dialog.Trigger as="button" type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</Dialog.Trigger>
                </div>
            </div>
        </div>

    );
};

