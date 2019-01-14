import { Component } from '@angular/core';
import { MessageService } from './services/message.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  opened: boolean = true;
  title: string = 'Implementations, Inc.';

  constructor(public messageService : MessageService,
      private bottomSheet: MatBottomSheet) { 
    this.messageService.publishedMessages
    .subscribe(m => {
      this.openBottomSheet();
    })
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetOverviewExampleSheet {
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}