import {
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    SortableProvider,
    createSortable,
    closestCenter, Draggable,
} from "@thisbeyond/solid-dnd";
import { createSignal, For } from "solid-js";
import Resizable from "@corvu/resizable";

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            sortable: any; // Corresponds to `use:any`
        }
    }
}

const Sortable = (props: { item: any }) => {
    const sortable = createSortable(props.item);
    return (

        <div
            use:sortable
            class="sortable"
            classList={{ "opacity-25": sortable.isActiveDraggable }}
        >
            {props.item}
        </div>
    );
};

export const HorizontalSortable = () => {
    const [items, setItems] = createSignal<number[]>([1, 2, 3]);
    const [activeItem, setActiveItem] = createSignal<Draggable|null>(null);
    const ids = () => items();

    const onDragStart = ({ draggable }) => setActiveItem(draggable.id);

    const onDragEnd = ({ draggable, droppable }) => {
        if (draggable && droppable) {
            const currentItems = ids();
            const fromIndex = currentItems.indexOf(draggable.id);
            const toIndex = currentItems.indexOf(droppable.id);
            if (fromIndex !== toIndex) {
                const updatedItems = currentItems.slice();
                updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
                setItems(updatedItems);
            }
        }
        setActiveItem(null);
    };

    return (
        <DragDropProvider
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            collisionDetector={closestCenter}
        >
            <DragDropSensors />
            <div class="col-auto grid grid-cols-3">
                <Resizable class="size-full">
                <SortableProvider ids={ids()}>
                    <For<number[]> each={items()}>{(item) => <><Resizable.Panel><Sortable item={item} /></Resizable.Panel> <Resizable.Handle
                        aria-label="Resize Handle"
                        class="group basis-3 py-0.75"
                    /></>}</For>
                </SortableProvider>
                </Resizable>
            </div>
            <DragOverlay>
                <div class="sortable">{activeItem()}</div>
            </DragOverlay>
        </DragDropProvider>
    );
};