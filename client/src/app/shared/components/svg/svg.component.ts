import {Component, inject, input} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {catchError, map, Observable, of, shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-svg',
  imports: [],
  templateUrl: './svg.component.html',
  styles: ``,
})
export class SvgComponent {
  name = input.required<string>();

  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);
  private cache = new Map<string, Observable<string>>();

  svgContent: SafeHtml = '';

  ngOnChanges(): void {
    this.getIcon(this.name()).subscribe(svg => {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }

  getIcon(name: string): Observable<string> {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const request$ = this.http.get(`/svgs/${name}.svg`, { responseType: 'text' }).pipe(
      map(contents => this.processSvg(contents)),
      shareReplay(1),
      catchError(() => {
        console.error(`SVG not found: ${name}`);
        return of('');
      })
    );

    this.cache.set(name, request$);
    return request$;
  }

  private processSvg(contents: string): string {
    const svgStart = contents.indexOf('<svg');
    let svg = svgStart !== -1 ? contents.slice(svgStart) : contents;

    svg = svg
      .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
      .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');

    if (!svg.includes('fill=')) {
      svg = svg.replace('<svg', '<svg fill="currentColor"');
    }

    return svg;
  }
}
