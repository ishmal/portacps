const HID = require('node-hid');
const promisify = require('util').promisify;

const HID_VendorId = 5538; // 0x15a2
const HID_ProductId = 115; // 0x73


const CMD = {
	ACK: [65], // A
	BASE: 66, // B
	CMD: 67, // C
	ENDR: [69, 78, 68, 82], // E N D R
	ENDW: [69, 78, 68, 87], // E N D W
	PRG: [2, 80, 82, 79, 71, 82, 65], // 2 P R O G R A
	PRG2: [77, 2], // M 2
	PRG3: [0x02, 0x50, 0x52, 0x4f, 0x47, 0x52, 0x41, 0x4d], // 2 P R O G R A M
	READ: 82, // R
	WRITE: 87, // W
};


function logj(msg, obj) {
	const json = JSON.stringify(obj, null, 2);
	console.log(msg + ":" + json);
}


class Hid {
	constructor() {

	}

	async execute() {
		const devices = HID.devices();
		// logj("devices", devices);
		const devInfo = devices.find(d => d.vendorId === HID_VendorId && d.productId === HID_ProductId);
		if (!devInfo) {
			console.log("device not found");
			return;
		}
		console.log(`device found: ${devInfo}`);
		const dev = new HID.HID(devInfo.path);
		logj("device", dev);
		const p_read = promisify(dev.read.bind(dev));
		try {
			const nrbytes = dev.write(CMD.PRG3);
			console.log("bytes: " + nrbytes);
			const data = dev.readSync();
			logj("data", data);
			dev.close();
		} catch (e) {
			console.log(e);
			dev.close();
		}

	}
}

async function runme() {
	const t = new Hid();
	await t.execute();
}

runme();