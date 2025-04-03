import {Component, createEffect, createSignal, For} from "solid-js";
import {createStore} from "solid-js/store";
import {div} from "big.js";
import Dialog, {Close} from '@corvu/dialog'
import {Entity, type Group as GroupType, GroupProps, ORDER_DELTA} from "~/lib/types";
import {Group} from "~/components/sortable/group";
import {Id} from "@thisbeyond/solid-dnd";

import groups from "~/data/groups.json";
import items from "~/data/items.json";
import Swapy from "~/components/ui/swapy/Swapy";
import {SwapyItem, SwapySlot} from "~/components/ui/swapy";

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            sortable: any; // Corresponds to `use:any`
        }
    }
}


export const SwapSections: Component<{
    hideHeader: boolean;
    addNewGroup: (e: any) => any;
}> = props => {

    const hideHeader = () => props.hideHeader;

    const [entities, setEntities] = createStore<Record<any, Entity>>();

    let nextOrder = 0;

    const getNextOrder = () => {
        nextOrder += ORDER_DELTA;
        return nextOrder.toString();
    };

    const handleNewItem = () => {}
const handleRemoveItem = () => {}

    return (
        <>

            <Swapy class="sortable container">
            <For<GroupProps[]> each={groups}>
                {(group, index) => (
                    <>
                    <SwapySlot slotId={`${group.id}`} class="container">
                        <SwapyItem  itemId={`${group.id}`} class="container">
                        <Group
                            id={group.id}
                            name={group.name}
                            title={group.title}
                            items={items.filter((item) => item.group === group.id)}
                            addItem={handleNewItem}
                            removeItem={handleRemoveItem}
                            hideHeader={hideHeader()}
                        />
                        </SwapyItem>
                    </SwapySlot>
                    </>
                )}
            </For>
            </Swapy>
        </>
    );
};
