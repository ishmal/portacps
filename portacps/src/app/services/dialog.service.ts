import { Injectable } from '@angular/core';

const { remote } = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor() { }

  async showOpenDialog(title: String) {
	const opts = {
		title,
		defaultPath: remote.app.getAppPath(),
		properties: ['openFile'],
		filters: [
			{ name: 'JSON files', extensions: ['json'] }
		]
	};
	const result = await remote.dialog.showOpenDialog(opts);
	return result;
  }

  async showSaveAsDialog(title: String) {
	const opts = {
		title,
		defaultPath: remote.app.getAppPath(),
		properties: ['createDirectory', 'showOverwriteConfirmation'],
		filters: [
			{ name: 'JSON files', extensions: ['json'] }
		]
	};
	const result = await remote.dialog.showSaveDialog(opts);
	return result;
  }
}
