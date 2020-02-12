import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { saveAs } from 'file-saver';

@Component({
	selector: 'app-tab1',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	providers: []
})
export class HomePage {

	constructor(private menu: MenuController) {}

	showOpenDialog() {
		console.log("showOpenDialog");
		document.getElementById('file-input').click();
		this.menu.close();
	}

	doSave() {
		console.log("doSave");
		this.menu.close();
	}

	showSaveDialog() {
		console.log("showSaveDialog");
		const content = '{ mydata: "blah, blah" }';
		const blob = new Blob([content], {type: "text/json;charset=utf-8"});
		const fs = saveAs(blob, "testMe.json", { autoBom: true })
		this.menu.close();
	}

	doClose() {
		console.log("doClose");
		this.menu.close();
	}

	doDownload() {
		console.log("doDownload");
		this.menu.close();
	}

	doUpload() {
		console.log("doUpload");
		this.menu.close();
	}

}