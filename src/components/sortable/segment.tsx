import {Component} from "solid-js";
import {Swapy, SwapyHandle, SwapyItem, SwapySlot} from "~/components/ui/swapy";
import "./style.css"
import {VerticalCarousel} from "~/components/ui/carousel/vertical-carousel.tsx";

type PROPS = {
    count: number;
    children: any;
}

const Segment: Component<PROPS> = props => {

    const count = () => props.count;


    return (
        <div class="">
            <VerticalCarousel/>
        </div>
    );
};

export default Segment;