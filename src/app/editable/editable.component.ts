import {
  Component,
  ContentChild,
  HostListener,
  ElementRef,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";

import { NgControl } from "@angular/forms";
import { fromEvent, Observable, of, Subject } from "rxjs";
import {
  switchMap,
  takeUntil,
  filter,
  take,
  switchMapTo,
  concatMap,
  timeout,
  catchError,
  delay,
} from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ViewModeDirective } from "./view-mode.directive";
import { EditModeDirective } from "./edit-mode.directive";

function makeRequest(timeToDelay: any) {
  return of("Request Complete!").pipe(delay(timeToDelay));
}

@UntilDestroy()
@Component({
  selector: "app-editable",
  templateUrl: "./editable.component.html",
  styleUrls: ["./editable.component.css"],
})
export class EditableComponent implements OnInit {
  @ContentChild(ViewModeDirective) viewModeTpl!: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl!: EditModeDirective;
  @Output() update = new EventEmitter();

  editMode = new Subject();
  editMode$ = this.editMode.asObservable();

  mode: "view" | "edit" = "view";

  constructor(private host: ElementRef) {}

  ngOnInit() {
    this.viewModeHandler();
    this.editModeHandler();
  }

  toViewMode() {
    this.update.next("");
    this.mode = "view";
  }

  private get element() {
    return this.host.nativeElement;
  }

  private viewModeHandler() {
    fromEvent(this.element, "dblclick")
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.mode = "edit";
        this.editMode.next(true);
      });
  }

  private editModeHandler() {
    const clickOutside$ = fromEvent(document, "click").pipe(
      filter(({ target }) => this.element.contains(target) === false),
      take(1)
    );

    this.editMode$
      .pipe(switchMapTo(clickOutside$), untilDestroyed(this))
      .subscribe((event) => this.toViewMode());
  }

  get currentView() {
    return this.mode === "view" ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngOnDestroy() {}
}
