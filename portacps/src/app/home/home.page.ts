import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { DialogService } from '../services/dialog.service';
import { HidService } from '../services/hid.service';


@Component({
	selector: 'app-tab1',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	providers: []
})
export class HomePage {

	constructor(
		private menu: MenuController, 
		private dialogService: DialogService,
		private hidService: HidService
		) {}

	async showOpenDialog() {
		console.log("showOpenDialog");
		const result = await this.dialogService.showOpenDialog("Open codeplug file");
		this.menu.close();
	}

	doSave() {
		console.log("doSave");
		this.menu.close();
	}

	async showSaveDialog() {
		console.log("showSaveDialog");
		const content = '{ mydata: "blah, blah" }';
		const result = await this.dialogService.showSaveAsDialog("Save codeplug file");
		this.menu.close();
	}

	doClose() {
		console.log("doClose");
		this.menu.close();
	}

	doDownload() {
		console.log("doDownload");
		this.hidService.download();
		this.menu.close();
	}

	doUpload() {
		console.log("doUpload");
		this.menu.close();
	}

}