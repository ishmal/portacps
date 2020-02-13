import { Injectable } from '@angular/core';

const HID = (<any>window).require('node-hid');

@Injectable({
  providedIn: 'root'
})
export class HidService {

  constructor() { }

  download() {
	const devices = HID.devices();
	const dev = devices.find(d => d.vendorId === 5538 && d.productId === 115);
	if (!dev) {
		console.log("device not found");
		return;
	}
	console.log(`device found: ${dev.product}`);
  }

  upload() {

  }

}
