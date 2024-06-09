import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
      ingredients: new FormControl(null, {validators: Validators.required}),
      description: new FormControl(null, {validators: Validators.required}),
      id: new FormControl(null)
    },
  )
  public formHelper: FormHelper | null = null;
  public mode: MODE = MODE.NEW;
  public MODE = MODE;
  public subscription: Subscription = new Subscription();

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
    })

    this.subscription.add(paramMapSubscription);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public addRecipe(): void {
    this.recipeForm.markAllAsTouched();
    if (!this.recipeForm.valid) {
      return;
    }
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
  }

  public editRecipe(): void {
    this.recipeForm.markAllAsTouched();
    if (!this.recipeForm.valid) {
      return;
    }
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
  }
}
