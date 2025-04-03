import * as steps from "@zag-js/steps"
import {useMachine, normalizeProps} from "@zag-js/solid"
import {Component, createMemo, createSignal, createUniqueId, Index, ValidComponent} from "solid-js"
import "~/css/steps.css"
import {SortableSections} from "~/components/page/sortable-sections.tsx";
import {Dynamic} from "solid-js/web";
import {classNames} from "~/lib/utils.ts";
import Icon from "~/components/ui/icon.tsx";


const Steps: Component<{}> = props => {

    const [getHideHeader, setHideHeader] = createSignal(false);

    const stepsData = createMemo(() => [
        {title: "Sections", component: SortableSections, data: {hideHeader: getHideHeader()}},
        {title: "Step 2", component: SortableSections, data: {hideHeader: getHideHeader()}},
        {title: "Step 3", component: SortableSections, data: {hideHeader: getHideHeader()}},
    ]);

    const service = useMachine(steps.machine, {
        id: createUniqueId(),
        count: stepsData.length,
    })

    const api = createMemo(() => steps.connect(service, normalizeProps))

    return (
        <>
                <div
                    class="flex items-baseline justify-between flex-shrink-0 px-0.5 bg-white border-b">
                    <p class="text-3xl pl-1 uppercase text-blue-900 tracking-tight">
                        Layout
                    </p>

                    <ul class="flex items-baseline space-x-1">

                        <li>
                            <button
                                onClick={() => setHideHeader((p) => !p)}
                                type="button"
                                class={classNames(
                                    getHideHeader() ? "bg-gray-200 text-blue-500/20" : " text-blue-500 border border-blue-500",
                                    "flex items-center justify-center size-7 text-blue-500 transition rounded-full hover:bg-gray-500/5 focus:bg-blue-500/10 focus:outline-none")}>
                                <Icon name="InspectionPanel" class="p-1 size-7"/>
                            </button>
                        </li>


                        <li>
                            <a class="flex items-center justify-center w-10 h-10 text-blue-500 transition rounded-full hover:bg-gray-500/5 focus:bg-blue-500/10 focus:outline-none"
                               href="#">
                                <Icon name="PencilRuler" class="p-0.5 size-7"/>
                            </a>
                        </li>
                    </ul>
                </div>


            <div class="flex-1 flex flex-row overflow-y-hidden">
        <main {...api().getRootProps()} class="flex-1 overflow-y-auto">
            <Index<{ title: string, data: any, component: ValidComponent }[]> each={stepsData()} class={""}>
                {(step, index) => (
                    <div {...api().getContentProps(props = {index: index})}>
                                <Dynamic<ValidComponent> component={step().component} {...step().data}/>
                    </div>
                )}
            </Index>
        </main>
            </div>

            <footer {...api().getListProps()} class="min-w-full h-12 container mx-auto p-4 lg:px-8 bg-gray-200">
                <Index<{ title: string, data: any, component: ValidComponent }[]> each={stepsData()}>
                    {(step, index: number) => (
                        <div {...api().getItemProps(props = {index: index})}>
                            <button {...api().getTriggerProps(props = {index: index})}>
                                <div {...api().getIndicatorProps(props = {index: index})}>{index + 1}</div>
                                <span>{step().title}</span>
                            </button>
                            <div {...api().getSeparatorProps(props = {index: index})} />
                        </div>
                    )}
                </Index>
            </footer>


            </>
    )
}

export {Steps};