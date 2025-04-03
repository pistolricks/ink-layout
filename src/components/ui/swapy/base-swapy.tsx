import {Component} from "solid-js";
import {Swapy, SwapyHandle, SwapyItem, SwapySlot} from "~/components/ui/swapy";

type PROPS = {}

const BaseSwapy: Component<PROPS> = props => {

    return (
        <Swapy
            dragAxis={'both'}
            class="sortable"
            style={{ display: "flex"}}>
            <SwapySlot style={{ background: "green" }}>
                <SwapyItem>Foo</SwapyItem>
            </SwapySlot>
            <SwapySlot style={{ background: "white" }}>
                <SwapyItem class="item">
                    Bar
                    <SwapyHandle class="handle" />
                </SwapyItem>
            </SwapySlot>
            <SwapySlot style={{ background: "blue" }}>
                <SwapyItem>Baz</SwapyItem>
            </SwapySlot>
        </Swapy>
    );
};

export default BaseSwapy;