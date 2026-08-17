import {Component, inject, input, signal} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {filter} from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

export type Meta = { title: string, svg: string }

@Component({
  selector: 'app-page-heading',
  standalone: true,
  templateUrl: './page-heading.component.html',
  styles: ``,
  imports: [
    RouterLink
  ]
})
export class PageHeadingComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);

  meta = input<Meta[]>([]);

  title!: string;
  breadcrumbs = signal<Breadcrumb[]>([]);

  constructor() {
    this.breadcrumbs.set(this.buildBreadcrumbs(this.activatedRoute.root));

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs.set(this.buildBreadcrumbs(this.activatedRoute.root));
    });
  }

  ngOnInit() {
    this.title = this.titleService.getTitle();
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL) {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.title;
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
