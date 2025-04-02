import {Router} from "@solidjs/router";
import {FileRoutes} from "@solidjs/start/router";
import {Suspense} from "solid-js";
import Dialog from '@corvu/dialog'
import Nav from "~/components/Nav";

import "./app.css";
import Resizable from "@corvu/resizable";

export default function App() {
    return (
        <Router
            root={props => (
                <>
                    <Nav/>
                        <Suspense><Dialog>{props.children}</Dialog></Suspense>
                </>
            )}
        >
            <FileRoutes/>
        </Router>
    );
}
