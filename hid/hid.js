const HID = require('node-hid');
const promisify = require('util').promisify;

const HID_VendorId = 5538; // 0x15a2
const HID_ProductId = 115; // 0x73
const OUTPUT_REPORT_LEN = 42;

const CMD = {
	ACK: [65], // A
	BASE: 66, // B
	CMD: 67, // C
	ENDR: [69, 78, 68, 82], // E N D R
	ENDW: [69, 78, 68, 87], // E N D W
	PRG: [2, 80, 82, 79, 71, 82, 65], // 2 P R O G R A
	PRG2: [77, 2], // M 2
	PRG3: [0x00, 0x02, 0x50, 0x52, 0x4f, 0x47, 0x52, 0x41], // 2 P R O G R A M
	READ: 82, // R
	WRITE: 87, // W
};


function logj(msg, obj) {
	const json = JSON.stringify(obj, null, 2);
	console.log(msg + ":" + json);
}


const zeroFill = (arr, len) => {
	for (let i = arr.length; i < len; i++) {
		arr[i] = 0;
	}
	return arr;
};

const toOutput = (data) => {
	const lenLo = data.length & 255;
	const lenHi = (data.length >> 8) && 255;
	const header = [1, 0, lenLo, lenHi];
	const buf = header.concat(data);
	const outbuf = zeroFill(buf, OUTPUT_REPORT_LEN);
	return outbuf;
};

const fromOutput = (data) => {
	const len = data[2] + data[3] * 256;
	const out = [];
	for (let i = 0; i < len ; i++) {
		out[i] = data[i + 4];
	}
	return out;
};


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
		logj("device found", devInfo);
		const dev = new HID.HID(HID_VendorId, HID_ProductId);
		// dev.on("data", (data) => {
		//	logj("data", data);
		//});
		// dev.setNonBlocking(true);
		// logj("device", dev);
		const p_read = promisify(dev.read.bind(dev));
		try {
			const nrbytes = dev.write(toOutput(CMD.PRG));
			console.log("bytes: " + nrbytes);
			const rawData = dev.readSync();
			const ack = fromOutput(rawData);
			logj("data", ack);
			if (ack[0] !== CMD.ACK[0]) {
				return;
			}
			dev.write(toOutput(CMD.PRG2));
			const rawData2 = dev.readSync();
			const ack2 = fromOutput(rawData2);
			setTimeout(() => dev.close(), 5000);
			logj("data", ack2);
		} catch (e) {
			console.log(e);
			dev.close();
		}


	}

	execute2() {
		let len = 8;
		const doIt = () => {
			const dev = new HID.HID(HID_VendorId, HID_ProductId);
			dev.on("data", (data) => {
				logj("data", data);
			});
				console.log("len: " + len);
			const msg = toOutput(CMD.PRG, len);
			dev.write(msg);
			len++;
			setTimeout(() => {
				dev.close();
				if (len < 77) {
					doIt();
				}
			}, 700);
		};
		doIt();
	}
}

async function runme() {
	const t = new Hid();
	try {
		await t.execute();
	} catch(e) {
		console.log(e);
	}
}

runme();