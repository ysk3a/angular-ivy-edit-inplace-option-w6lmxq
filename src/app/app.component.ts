import { Component, VERSION } from "@angular/core";
import { FormGroup, FormArray, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  entities: { [key: string]: string | number | boolean | Date }[] = [
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
          return {
            ...e,
            [field]:
              e[
                field as keyof {
                  [key: string]: string | number | boolean | Date;
                }
              ],
          };
        }
        return e;
      });
    }
  }
  updateField(index: number, field: string) {
    const control = this.getControl(index, field);
    console.log("updateField", index, field, control.valid);

    if (control.valid) {
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
    }
  }
}

// from https://scribe.rip/https:/netbasal.com/keeping-it-simple-implementing-edit-in-place-in-angular-4fd92c4dfc70
