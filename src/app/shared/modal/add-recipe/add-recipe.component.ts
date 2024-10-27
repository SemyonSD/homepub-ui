import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {ActivatedRoute, Router} from "@angular/router";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {filter, Subscription, switchMap, tap} from "rxjs";
import {RecipesService} from "../../services/recipes/recipes.service";
import {FormHelper} from "../../helpers/form-helper";
import {Recipe} from "../../models/recipe.model";

enum MODE {
  NEW = 'NEW',
  EDIT = 'EDIT'
}

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRecipeComponent implements OnInit, OnDestroy {
  public recipeForm: FormGroup = new FormGroup(
    {
      title: new FormControl(null, {validators: Validators.required}),
      ingredients: new FormArray([
        new FormGroup({
          name: new FormControl(null, {validators: Validators.required}),
          measurementValue: new FormControl(null, {validators: [Validators.required, Validators.min(0)]}),
          measurementName: new FormControl(null, {validators: Validators.required})
        })
      ]),
      description: new FormControl(null, {validators: Validators.required}),
      id: new FormControl(null)
    },
  )
  public formHelper: FormHelper | null = null;
  public mode: MODE = MODE.NEW;
  public MODE = MODE;
  public subscription: Subscription = new Subscription();
  public measurementValues: any[] = [{
    label: 'ml',
    value: 'ml'
  }, {
    label: 'gr',
    value: 'gr'
  }];

  constructor(private alertService: TuiAlertService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private recipesService: RecipesService
  ) {
  }

  public ngOnInit() {
    this.formHelper = new FormHelper(this.recipeForm);

    const paramMapSubscription = this.activatedRoute.paramMap.pipe(
      tap(paramMap => {
        return this.mode = paramMap.get('id') === 'new' ? MODE.NEW : MODE.EDIT;
      }),
      filter(paramMap => paramMap.get('id') !== 'new'),
      switchMap(paramMap => {
        const id: string | null = paramMap.get('id');
        if (!id) {
          throw Error('Id not found')
        }
        return this.recipesService.getRecipeById(id);
      })
    ).subscribe((recipe: Recipe) => {
      this.recipeForm.patchValue(recipe)
      debugger
      this.recipeForm.get('ingredients')?.patchValue(recipe.ingredients)
    })

    this.subscription.add(paramMapSubscription);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public submit(): void {
    this.recipeForm.markAllAsTouched();
    if (!this.recipeForm.valid) {
      return;
    }
    switch (this.mode) {
      case MODE.NEW:
        this.recipesService.createRecipe({...this.recipeForm.getRawValue()}).pipe(
          switchMap(() => {
            return fromPromise(this.router.navigate(['..'], {relativeTo: this.activatedRoute}))
          }),
          switchMap(() => {
            return this.alertService.open('Recipe has been successfully added', {
              autoClose: true,
              status: TuiNotification.Success
            })
          })
        ).subscribe()
        break;
      case MODE.EDIT:
        const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
        this.recipesService.putRecipe(id, this.recipeForm.getRawValue()).pipe(
          switchMap(() => {
            return fromPromise(this.router.navigate(['..'], {relativeTo: this.activatedRoute}))
          }),
          switchMap(() => {
            return this.alertService.open('Recipe has been successfully updated', {
              autoClose: true,
              status: TuiNotification.Success
            })
          })
        ).subscribe()
        break;
    }
  }

  public get ingredientsFormArray(): FormArray {
    return (this.recipeForm.get('ingredients') as FormArray);
  }

  public addIngredientRow(): void {
    this.ingredientsFormArray.push(new FormGroup({
      name: new FormControl(null, {validators: Validators.required}),
      measurementValue: new FormControl(null, {validators: Validators.required}),
      measurementName: new FormControl(null, {validators: Validators.required})
    }));
  }

  public removeIngredientRow(idx: number): void {
    this.ingredientsFormArray.removeAt(idx);
  }

  public showKey(evt: any) {
    console.log(evt)
  }
}
