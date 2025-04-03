

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

export type Segment = {
    id: Id;
    name: string;
    type: "segment";
    title?: string;
    order: string;
    color?: string;
    active: boolean;
    list: Sort[];
}

export type Sort = {
    id: Id;
    name: string;
    type: "sort";
    title?: string;
    order: string;
    color?: string;
    active: boolean;
    segment_id: Id;
}
