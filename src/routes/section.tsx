import {SortableSection} from "~/components/sortable-section";
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
                            <Icon name="InspectionPanel" />
                            </button>
                        </li>

                        <li>
                            <a class="flex items-center justify-center w-10 h-10 text-blue-500 transition rounded-full hover:bg-gray-500/5 focus:bg-blue-500/10 focus:outline-none"
                               href="#">
                                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M19.25 17.25V9.75C19.25 8.64543 18.3546 7.75 17.25 7.75H4.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z"/>
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M13.5 7.5L12.5685 5.7923C12.2181 5.14977 11.5446 4.75 10.8127 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V11"/>
                                </svg>
                            </a>
                        </li>

                        <li>
                            <a class="flex items-center justify-center w-10 h-10 text-blue-500 transition rounded-full hover:bg-gray-500/5 focus:bg-blue-500/10 focus:outline-none"
                               href="#">
                                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M4.75 19.25L9 18.25L18.2929 8.95711C18.6834 8.56658 18.6834 7.93342 18.2929 7.54289L16.4571 5.70711C16.0666 5.31658 15.4334 5.31658 15.0429 5.70711L5.75 15L4.75 19.25Z"/>
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="1.5" d="M19.25 19.25H13.75"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </header>
            </div>
        <div class="text-center mx-auto text-gray-700 p-4">

            <SortableSection hideHeader={getHideHeader()}/>

        </div>
        </main>
    );
}
