import { Component, signal } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";
import { Navbar } from "../components/navbar/navbar";
import { Settings } from "../components/settings/settings";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Navbar, Settings],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  greetingMessage = signal("");

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage.set(text);
    });
  }

  activeComponent: any = null;

  onActivate(component: any): void {
    this.activeComponent = component;
  }

  onDeactivate(): void {
    this.activeComponent = null;
  }

  onModeChange(): void {
    console.log("mode changed");
    if (this.activeComponent && typeof this.activeComponent.onModeChange === 'function') {
      this.activeComponent.onModeChange();
    }
  }

}
