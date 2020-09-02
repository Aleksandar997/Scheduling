import { Component, OnInit, EventEmitter, ViewChild, Input } from '@angular/core';
import { ProgressLoaderComponent } from '../progressLoader/progressLoader.component';
import { FileService } from '../../services/file.service';
import { LoaderComponent } from '../loader/loader.component';
import { FormGroup } from '@angular/forms';
import { FormGroupHelper } from '../../helpers/formGroupHelper';
import { ToasterService } from '../toaster/toaster.service';
import { TranslatePipe } from '../../pipes/translate/translatePipe';
import { Router } from '@angular/router';
import { Settings } from '../../settings/settings';

@Component({
  selector: 'file-upload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.css']
})
export class FileUploadComponent implements OnInit {
  @ViewChild(ProgressLoaderComponent) private progressLoader: ProgressLoaderComponent;
  constructor(private fileService: FileService, private translate: TranslatePipe, private router: Router) { }
  imagePreview;
  @Input() previousFileGuid;
  private fileBase = new Array<File>();
  @Input() modelName = 'item';
  @Input() width;
  // onFileSelect = new EventEmitter<any>();
  ngOnInit() {
    this.reset();
  }
  setImagePreview(path: string) {
    this.imagePreview = Settings.FileServerUrl + path;
    this.previousFileGuid = path;
  }
  private getLocalization(key: string) {
    return this.translate.transform(key);
  }
  onFileChange(event) {
    this.fileBase = new Array<File>();
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.progressLoader.show();
      const file: File = fileList[0];
      let path: any;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async (e) => {
        path = await reader.result;
        this.progressLoader.timedClose(() => {
          this.fileBase.push(file);
          this.imagePreview = path;
        }, 1000);
      };
    }
  }

  reset() {
    this.imagePreview = 'assets/img/logo/placeholderCompanyLogo.png';
  }

  uploadFile<returnT>(
      thenFunc: (fileId) => Promise<returnT>,
      loaderRef: LoaderComponent = null,
      form: FormGroup,
      navigateOnFinishUrl: string = null) {
    if (!FormGroupHelper.isValid(form)) {
      ToasterService.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    loaderRef.show();
    this.fileService.uploadFile(this.fileBase, (fileId: number) => {
      thenFunc(fileId).then(() => {
        loaderRef.hide();
        ToasterService.openSuccess(`${this.modelName}_save_success`);
        if (navigateOnFinishUrl) {
          this.router.navigate([navigateOnFinishUrl]);
        }
      }).catch(err => {
        form.addServerErrors(err.error);
        loaderRef.hide();
        ToasterService.openSuccess(`${this.modelName}_save_error`);
      });
    }, this.previousFileGuid);
  }

  uploadFileClean(thenFunc: (fileId) => any) {
    return this.fileService.uploadFile(this.fileBase, (fileId: number) => {
      return thenFunc(fileId);
    }, this.previousFileGuid) as Promise<any>;
  }
}
