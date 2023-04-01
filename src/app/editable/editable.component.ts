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
export class EditableComponent implements OnInit, AfterViewInit {
  @ContentChild(ViewModeDirective) viewModeTpl!: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl!: EditModeDirective;
  @Output() update = new EventEmitter();
  editMode = new Subject();
  editMode$ = this.editMode.asObservable();

  @ViewChild("editTwo") editTwoButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild("saveButtonRef") saveButtonRef!: ElementRef<HTMLButtonElement>;
  editButtonClicks$!: Observable<any>;
  saveButtonClick$!: Observable<any>;

  mode: "view" | "edit" = "view";

  constructor(private host: ElementRef) {}
  ngAfterViewInit(): void {
    this.editButtonClicks$ = fromEvent(
      this.editTwoButtonRef.nativeElement,
      "click"
    );
    this.editButtonClicks$.pipe(untilDestroyed(this)).subscribe(() => {
      console.log("editObs");
      this.mode = "edit";
      this.editMode.next(true);
    });

    this.saveButtonClick$ = fromEvent(
      this.saveButtonRef.nativeElement,
      "click"
    );
    this.editMode$
      .pipe(
        switchMap(() => this.saveButtonClick$),
        untilDestroyed(this)
      )
      .subscribe((event) => {
        // other stuff at backend
        console.log("editmode save");
        this.toViewMode();
      });

      // other way?
    // this.saveButtonClick$.pipe(untilDestroyed(this), take(1)).subscribe(() => {
    //   console.log("saveObs");
    //   // fake http delay
    //   const source$ = of(4000, 3000, 2000);
    //   const subscribe = source$.subscribe((val) => {
    //     console.log(val);
    //     this.mode = "view";
    //     this.editMode.next(true);
    //     this.toViewMode();
    //   });
    // });
  }

  ngOnInit() {
    // this.viewModeHandler();
    // this.editModeHandler();
  }

  toViewMode() {
    this.update.next("");
    this.mode = "view";
  }

  edit2(): void {
    console.log("elref");
    this.mode = "edit";
    this.editMode.next(true);
  }
  save(): void {
    console.log("save");
    this.update.next("");
    this.mode = "view";
    this.editMode.next(true)
  }
  cancel(): void {
    console.log("cancel");
    this.mode = "view";
    this.editMode.next(true)
  }

  private get element() {
    console.log("this.host.nativeElement", this.host.nativeElement);
    return this.host.nativeElement;
  }

  private viewModeHandler() {
    fromEvent(this.element, "dblclick")
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        console.log("dbclick");
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

  ngOnDestroy() {
    this.editMode.unsubscribe();
  }
}
