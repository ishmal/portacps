import { Injectable } from '@angular/core';

const HID = (<any>window).require('node-hid');

const HID_VendorId = 5538;  // 0x15a2
const HID_ProductId = 115;  // 0x73


const CMD = {
	WRITE: 87, // W
	READ: 82, // R
	CMD: 67, // C
	BASE: 66, // B
	ENDR: [ 69, 78, 68, 82 ], // E N D R
	ENDW: [ 69, 78, 68, 87 ], // E N D W
	ACK: [ 65 ], // A
	PRG: [ 2, 80, 82, 79, 71, 82, 65 ], // 2, P R O G R A
	PRG2: [ 77, 2 ]  // M 2
};

@Injectable({
  providedIn: 'root'
})
export class HidService {

  constructor() { }

  download() {
	const devices = HID.devices();
	const dev = devices.find(d => d.vendorId === HID_VendorId && d.productId === HID_ProductId);
	if (!dev) {
		console.log("device not found");
		return;
	}
	console.log(`device found: ${dev.product}`);
  }

  upload() {

  }

}
