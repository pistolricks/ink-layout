import { Index } from "solid-js"

import { Card, CardContent } from "~/components/ui/card/card.tsx"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "~/components/ui/carousel"

export function VerticalCarousel() {
    return (
        <Carousel
            opts={{
                align: "start"
            }}
            orientation="vertical"
            class="w-full max-w-xs overflow-y-auto"
        >
            <CarouselContent class="-mt-1 min-h-[200px]">
                <Index each={Array.from({ length: 5 })}>
                    {(_, index) => (
                        <CarouselItem class="pt-1 basis-1 h-full">
                            <div class="p-1">
                                <Card>
                                    <CardContent class="flex items-center justify-center p-6">
                                        <span class="text-3xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    )}
                </Index>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}