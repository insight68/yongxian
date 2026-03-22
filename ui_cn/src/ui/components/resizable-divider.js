var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {r = Reflect.decorate(decorators, target, key, desc);}
    else {for (var i = decorators.length - 1; i >= 0; i--) {if (d = decorators[i]) {r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;}}}
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
/**
 * A draggable divider for resizable split views.
 * Dispatches 'resize' events with { splitRatio: number } detail.
 */
let ResizableDivider = class ResizableDivider extends LitElement {
    constructor() {
        super(...arguments);
        this.splitRatio = 0.6;
        this.minRatio = 0.4;
        this.maxRatio = 0.7;
        this.isDragging = false;
        this.startX = 0;
        this.startRatio = 0;
        this.handleMouseDown = (e) => {
            this.isDragging = true;
            this.startX = e.clientX;
            this.startRatio = this.splitRatio;
            this.classList.add("dragging");
            document.addEventListener("mousemove", this.handleMouseMove);
            document.addEventListener("mouseup", this.handleMouseUp);
            e.preventDefault();
        };
        this.handleMouseMove = (e) => {
            if (!this.isDragging) {
                return;
            }
            const container = this.parentElement;
            if (!container) {
                return;
            }
            const containerWidth = container.getBoundingClientRect().width;
            const deltaX = e.clientX - this.startX;
            const deltaRatio = deltaX / containerWidth;
            let newRatio = this.startRatio + deltaRatio;
            newRatio = Math.max(this.minRatio, Math.min(this.maxRatio, newRatio));
            this.dispatchEvent(new CustomEvent("resize", {
                detail: { splitRatio: newRatio },
                bubbles: true,
                composed: true,
            }));
        };
        this.handleMouseUp = () => {
            this.isDragging = false;
            this.classList.remove("dragging");
            document.removeEventListener("mousemove", this.handleMouseMove);
            document.removeEventListener("mouseup", this.handleMouseUp);
        };
    }
    static { this.styles = css `
    :host {
      width: 4px;
      cursor: col-resize;
      background: var(--border, #333);
      transition: background 150ms ease-out;
      flex-shrink: 0;
      position: relative;
    }

    :host::before {
      content: "";
      position: absolute;
      top: 0;
      left: -4px;
      right: -4px;
      bottom: 0;
    }

    :host(:hover) {
      background: var(--accent, #007bff);
    }

    :host(.dragging) {
      background: var(--accent, #007bff);
    }
  `; }
    render() {
        return html ``;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("mousedown", this.handleMouseDown);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    }
};
__decorate([
    property({ type: Number })
], ResizableDivider.prototype, "splitRatio", void 0);
__decorate([
    property({ type: Number })
], ResizableDivider.prototype, "minRatio", void 0);
__decorate([
    property({ type: Number })
], ResizableDivider.prototype, "maxRatio", void 0);
ResizableDivider = __decorate([
    customElement("resizable-divider")
], ResizableDivider);
export { ResizableDivider };
