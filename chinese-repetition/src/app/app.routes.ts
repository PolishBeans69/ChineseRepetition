import { Routes } from "@angular/router";
import { Typing } from "../view/typing/typing";
import { Choose } from "../view/choose/choose";
import { Words } from "../view/words/words";
import { Home } from "../view/home/home";
import { AddItem } from "../view/add-item/add-item";

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "typing", component: Typing },
    { path: "choose", component: Choose },
    { path: "words", component: Words },
    { path: "home", component: Home },
    { path: "add", component: AddItem }
];
