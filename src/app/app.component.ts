import { Component, VERSION } from "@angular/core";
import { FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { of } from "rxjs";
import { fromEvent, delay } from "rxjs";
interface MyEntryType {
  // { [key: string]: string | number | boolean | Date }
  id: number;
  name: string;
  isAdmin: boolean;
}
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  entities: MyEntryType[] = [
    { id: 1, name: "Netanel Basal", isAdmin: true },
    { id: 2, name: "John Due", isAdmin: false },
  ];

  controls!: FormArray;

  ngOnInit() {
    const toGroups = this.entities.map((entity) => {
      const a = new FormControl(entity.isAdmin);
      return new FormGroup({
        name: new FormControl(entity.name, Validators.required),
        isAdmin: new FormControl(entity.isAdmin),
      });
    });
    this.controls = new FormArray(toGroups);
  }

  getControl(index: number, field: string): FormControl {
    return this.controls.at(index).get(field) as FormControl;
  }

  cancelChange(index: number, field: string) {
    const control = this.getControl(index, field);
    console.log("cancelChange", index, field);
    if (control.valid) {
      this.entities = this.entities.map((e, i) => {
        if (index === i) {
          // let focusField: keyof MyEntryType = field
          console.log("field", e[field as keyof MyEntryType]);
          control.patchValue(e[field as keyof MyEntryType]); // cancel and revert to original instead of 'cache' previous change
          return {
            ...e,
            // [field]: e[field as keyof typeof e]
            [field]: e[field as keyof MyEntryType],
          };
        }
        return e;
      });
    }
  }
  updateField(index: number, field: string, id: number) {
    const control = this.getControl(index, field);
    console.log("updateField", index, field, control.valid);

    if (control.valid) {
      // check if changes
      let entry = this.entities.find((el) => el.id == id);
      if (entry && entry[field as keyof MyEntryType] !== control.value) {
        console.log("entries check", entry);
        // fake delay http
        let fakeResponse = [1, 2, 3];
        let delayedObservable = of(fakeResponse).pipe(delay(100));
        delayedObservable.subscribe((data) => {
          console.log("fake resp", data);
          this.entities = this.entities.map((e, i) => {
            if (index === i) {
              let ret = {
                ...e,
                [field]: control.value,
              };
              console.log("entries loop", e, i, ret);
              return ret;
            }
            return e;
          });
          // const ranres = Math.random() < 0.5;
          // if (ranres) {
          //   console.log("random res next case");

          // } else {
          //   console.log("random res error case");
          // }
        });
      }
      // this.entities = this.entities.forEach((e, i) => {
      //   if (index === i) {
      //     e[field] === control.value;
      //     console.log("entries check", e, i);
      //     return;
      //   }
      //   return e;
      // });
    }
  }
}

// from https://scribe.rip/https:/netbasal.com/keeping-it-simple-implementing-edit-in-place-in-angular-4fd92c4dfc70
