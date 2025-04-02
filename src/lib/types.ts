

/* Sortable */

import {Id} from "@thisbeyond/solid-dnd";

export const ORDER_DELTA = 1000;

export interface Base {
    id: Id;
    name: string;
    title?: string;
    type: "group" | "item";
    order: string;
    color?: string;
    active: boolean;
}

export interface Group extends Base {
    type: "group";
}

export interface Item extends Base {
    type: "item";
    group: Id;
}

export type Entity = Group | Item;
