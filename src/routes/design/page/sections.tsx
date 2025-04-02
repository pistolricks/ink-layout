import {SortableSections} from "~/components/page/sortable-sections";
import Icon from "~/components/ui/icon";
import {createSignal} from "solid-js";
import {classNames} from "~/lib/utils";

export default function Section() {

    const [getHideHeader, setHideHeader] = createSignal(false);


    return (
        <main>
            <div class=" bg-gray-100">
                <header
                    class="sticky top-0 z-10 flex items-center justify-between flex-shrink-0 h-16 px-4 bg-white border-b">
                    <p class="text-xl font-semibold tracking-tight">
                        Layout
                    </p>

                    <ul class="flex items-center -mr-2 space-x-1">

                        <li>
                            <button
                                onClick={() => setHideHeader((p) => !p)}
                                type="button" class={classNames(
                                getHideHeader() ? "bg-gray-200 text-blue-500/20" : " text-blue-500",
                                "flex items-center justify-center w-10 h-10  transition rounded-full hover:bg-gray-500/5 focus:outline-none")}>
                                <Icon name="InspectionPanel"/>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setHideHeader((p) => !p)}
                                type="button" class={classNames(
                                getHideHeader() ? "bg-gray-200 text-blue-500/20" : " text-blue-500",
                                "flex items-center justify-center w-10 h-10  transition rounded-full hover:bg-gray-500/5 focus:outline-none")}>
                                <Icon name="PencilRuler"/>
                            </button>
                        </li>
                    </ul>
                </header>
            </div>
            <div class="text-center mx-auto text-gray-700 p-4">

                <SortableSections hideHeader={getHideHeader()}/>

            </div>
        </main>
    );
}
