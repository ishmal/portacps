import { Injectable } from '@angular/core';

const HID = ( < any > window).require('node-hid');
const promisify = ( < any > window).require('util').promisify;

const HID_VendorId = 5538; // 0x15a2
const HID_ProductId = 115; // 0x73


const CMD = {
	ACK: [65], // A
	BASE: 66, // B
	CMD: 67, // C
	ENDR: [69, 78, 68, 82], // E N D R
	ENDW: [69, 78, 68, 87], // E N D W
	PRG: [2, 80, 82, 79, 71, 82, 65], // 2, P R O G R A
	PRG2: [77, 2], // M 2
	READ: 82, // R
	WRITE: 87, // W
};

@Injectable({
	providedIn: 'root'
})
export class HidService {

	constructor() {}

	async download() {
		const devices = HID.devices();
		const devInfo = devices.find(d => d.vendorId === HID_VendorId && d.productId === HID_ProductId);
		if (!devInfo) {
			console.log("device not found");
			return;
		}
		console.log(`device found: ${devInfo.product}`);
		const dev = new HID.HID(devInfo.path);
		const p_read = promisify(dev.read.bind(dev));
		try {
			dev.write(CMD.PRG);
			const data = await p_read();
			const json = JSON.stringify(data);
			console.log("data: " + json);
			dev.close();
		} catch (e) {
			console.log(e);
			dev.close();
		}
	}

	upload() {

	}

}