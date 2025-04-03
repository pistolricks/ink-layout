import { Index } from "solid-js"

import { Card, CardContent } from "~/components/ui/card/card.tsx"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "~/components/ui/carousel"
import "./style.css"
export function VerticalCarousel() {
    return (
        <Carousel
            opts={{
                align: "start"
            }}
            orientation="vertical"
            class="embla"
        >
            <div class="embla__viewport">
            <CarouselContent class="embla__container">
                <Index each={Array.from({ length: 5 })}>
                    {(_, index) => (
                        <CarouselItem class="embla__slide">

                                <Card class="embla__slide__number rounded-none">

                                        <span class="text-3xl font-semibold">{index + 1}</span>

                                </Card>

                        </CarouselItem>
                    )}
                </Index>
            </CarouselContent>
            </div>
        </Carousel>
    )
}