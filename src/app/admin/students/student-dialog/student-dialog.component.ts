import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Student } from '../../../_models/Student';
import { Teacher } from '../../../_models/Teacher';
import { countryNames } from '../../../_data/CountryFlagUrls';
import { Status } from '../../../_models/Status';
import { SharedService } from '../../../_services/shared.service';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.css',
})
export class StudentDialogComponent implements OnChanges {
  @Output() saveStudent = new EventEmitter<{
    newStudent: Student;
    selectedFile: File | null;
    isEditMode: boolean;
  }>();

  handleDialogHide() {
    this.onHideDialog.emit();
    this.resetFileInput();
  }

  constructor(
    private messageService: MessageService,
    private sharedService: SharedService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isEditMode) {
      this.imagePreview = this.getStudentImageUrl(this.newStudent.imageUrl);
    }
  }

  isModelStateValid(): boolean {
    if (this.newStudent.name.length <= 0) {
      return false;
    }
    if (this.newStudent.country.length <= 0) {
      return false;
    }
    if (!this.newStudent.status) {
      return false;
    }
    if (!this.newStudent.teacher.id) {
      return false;
    }
    if (!this.newStudent.contract) {
      return false;
    }
    if (!this.selectedFile) {
      return false;
    }
    return true;
  }
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  resetFileInput() {
    this.fileInput.nativeElement.value = null;
    this.imagePreview = null;
  }

  onFileUpload(event: any) {
    if (event && event.target) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);

        this.sharedService.showToastMessage(
          'info',
          'Upload Complete',
          'Image uploaded successfully',
          3000
        );
      }
    }
  }

  selectedFile!: File | null;
  imagePreview: string | ArrayBuffer | null = null;

  getStudentImageUrl(imageName: string): string {
    // return `http://localhost:5229/api/Images?imageUrl=${imageName}`;
    return `https://localhost:7189/images/${imageName}`;
  }

  @Input() isEditMode!: boolean;

  @Input() teachers!: Teacher[];

  countryNames: string[] = countryNames;
  statuses: string[] = [
    'QUALIFIED',
    'PROPOSAL',
    'RENEWAL',
    'NEGOTIATION',
    'UNQUALIFIED',
  ];

  @Input() displayDialog: boolean = false;
  @Input() newStudent: Student = {
    name: '',
    country: '',
    teacher: { name: '' },
    date: new Date(),
    contract: 0,
    status: Status.QUALIFIED,
    imageUrl: '',
  } as Student;

  onSaveStudent(): void {
    this.saveStudent.emit({
      newStudent: this.newStudent,
      selectedFile: this.selectedFile,
      isEditMode: this.isEditMode,
    });
    this.resetFileInput();
    this.handleDialogHide();
  }

  @Output() onHideDialog = new EventEmitter<void>();
}
