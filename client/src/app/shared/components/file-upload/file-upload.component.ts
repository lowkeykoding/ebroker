import { Component, ElementRef, ViewChild, input, output, signal } from '@angular/core';

export interface UploadedFile {
  file: File;
  previewUrl: string | null;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: 'file-upload.component.html',
})
export class FileUploadComponent {
  allowedTypes = input.required<string[]>();
  maxSizeBytes = input.required<number>();
  accept = input.required<string>();
  hint = input.required<string>();
  errorMessage = input.required<string>();
  isImages = input<boolean>(false);
  allowPrimarySelection = input<boolean>(false);

  filesChange = output<UploadedFile[]>();

  @ViewChild('fileInput') fileInputEl!: ElementRef<HTMLInputElement>;

  readonly inputId = `file-upload-${Math.random().toString(36).slice(2)}`;

  files = signal<UploadedFile[]>([]);
  error = signal<string | null>(null);
  isDragOver = signal<boolean>(false);
  primaryIndex = signal<number>(0);

  private dragCounter = 0;

  private validate(incoming: File[]): File[] {
    let rejected = false;
    const valid: File[] = [];
    for (const file of incoming) {
      if (!this.allowedTypes().includes(file.type) || file.size > this.maxSizeBytes()) {
        rejected = true;
      } else {
        valid.push(file);
      }
    }
    this.error.set(rejected ? this.errorMessage() : null);
    return valid;
  }

  private toUploadedFile(file: File): UploadedFile {
    return {
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    };
  }

  private addFiles(incoming: File[]): void {
    const valid = this.validate(incoming);
    if (valid.length === 0) return;
    this.files.update(existing => [...existing, ...valid.map(f => this.toUploadedFile(f))]);
    this.emitChange();
  }

  private emitChange(): void {
    const current = this.files();
    if (this.allowPrimarySelection() && current.length > 0) {
      const primary = this.primaryIndex();
      const ordered = [current[primary], ...current.filter((_, i) => i !== primary)];
      this.filesChange.emit(ordered);
    } else {
      this.filesChange.emit([...current]);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    this.addFiles(files);
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter++;
    this.isDragOver.set(true);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(): void {
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.isDragOver.set(false);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter = 0;
    this.isDragOver.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    this.addFiles(files);
  }

  setPrimary(index: number): void {
    this.primaryIndex.set(index);
    this.emitChange();
  }

  removeFile(index: number): void {
    const current = this.files();
    const removed = current[index];
    if (removed.previewUrl) URL.revokeObjectURL(removed.previewUrl);
    this.files.set(current.filter((_, i) => i !== index));

    const primary = this.primaryIndex();
    if (index === primary) {
      this.primaryIndex.set(0);
    } else if (index < primary) {
      this.primaryIndex.set(primary - 1);
    }
    this.emitChange();
  }

  removeAll(): void {
    this.files().forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
    this.files.set([]);
    this.primaryIndex.set(0);
    this.emitChange();
  }

  replaceAll(): void {
    this.removeAll();
    this.fileInputEl.nativeElement.click();
  }

  formatSize(bytes: number): string {
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
}
