import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="loader"></div>`,
    styleUrl: 'loader.css'
})
export class Loader{
    constructor(){

    }
    
}