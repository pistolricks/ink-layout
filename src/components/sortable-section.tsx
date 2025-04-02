import {
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    SortableProvider,
    createSortable,
    closestCenter, Draggable,
} from "@thisbeyond/solid-dnd";
import {Component, createMemo, createSignal, For, JSXElement, Show} from "solid-js";
import Resizable from "@corvu/resizable";

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            sortable: any; // Corresponds to `use:any`
        }
    }
}

const Sortable = (props: { item: number, key: number, children?: JSXElement }) => {
    const item = () => props.item;
    item.id = props.key;

    const sortable = createSortable(item());
    return (
        <Resizable.Panel class="overflow-hidden flex flex-col" orientation="horizontal">
        <div
            use:sortable
            class="sortable"
            classList={{ "opacity-25": sortable.isActiveDraggable }}
        >
            {props.children}
        </div>
        </Resizable.Panel>
    );
};

export const SortableSection: Component<{
    orientation?: "horizontal" | "vertical"
}> = props => {

    const orientation = () => props.orientation ?? "horizontal"

    const [items, setItems] = createSignal<number[]>([1, 2, 3]);
    const [activeItem, setActiveItem] = createSignal<Draggable|null>(null);
    const currentItems = createMemo(() => items()?.map((item, i) => i + 1));

    const onDragStart = ({ draggable }) => setActiveItem(draggable?.id);

    const onDragEnd = ({ draggable, droppable }) => {
        if (draggable && droppable) {
            const fromIndex = currentItems().indexOf(draggable?.id);
            const toIndex = currentItems().indexOf(droppable?.id);
            if (fromIndex !== toIndex) {
                const updatedItems = currentItems().slice();
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
            <div class="size-full">
                <Resizable class="size-full" orientation={orientation()}>
                <SortableProvider ids={currentItems()?.map((item, i) => i + 1) ?? []}>
                    <For<number[]> each={items()}>
                        {(item, i) => (
                            <>
                                <Sortable item={item} key={i()} >
                                   <Show<boolean> when={i() === 1}>
                                       <h1>Hello</h1>
                                   </Show>
                                </Sortable>

                                <Show<boolean> when={i() + 1 !== (items()?.length)}>
                                    <Resizable.Handle
                                        aria-label="Resize Handle"
                                        class="group basis-3 py-0.75"
                                    />
                                </Show>


                            </>
                        )}
                    </For>
                </SortableProvider>
                </Resizable>
            </div>
            <DragOverlay>
                <div class="sortable">{activeItem()}</div>
            </DragOverlay>
        </DragDropProvider>
    );
};