const HID = require('node-hid');
const promisify = require('util').promisify;

const Forms = require("./forms");

const CABLE_DEVICE = {
	vendorId: 5538, // 0x15a2
	productId: 115 // 0x73
};

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

const GD77_MODEL = [
	77, // M
	68, // D
	45, // -
	55, // 7
	54, // 6
	48, // 0
	80, // P
	255
];

const RD5R_MODEL = [ 
	66, // B
	70, // F
	45, // -
	53, // 5
	82, // R
	255, 
	255,
	255
];

const MMAP = {
	ADDR_DMR_CONTACT:6024, // 0x1788
	ADDR_CHANNEL: 14208, // 0x3780
}


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



/**
 * For sending and receiving codeplugs
 */
class Hid {
	constructor() {
		this.dev = null;
	}

	write(data) {
		const lenLo = data.length & 255;
		const lenHi = (data.length >> 8) && 255;
		const header = [1, 0, lenLo, lenHi];
		const buf = header.concat(data);
		const outbuf = zeroFill(buf, OUTPUT_REPORT_LEN);
		const outLen = this.dev.write(outbuf)
		return outLen;
	}

	read() {
		const data = this.dev.readSync();
		const len = data[2] + data[3] * 256;
		const out = [];
		for (let i = 0; i < len ; i++) {
			out[i] = data[i + 4];
		}
		return out;	
	}

	// 0x000000 - 0x01FFFF // codeplug
	// 0x000000
	// 0x001000

	getModel(bytes) {
		let str = "";
		for (let i = 0 ; i < 8 ; i++) {
			const b = bytes[i];
			if (b === 255) {
				break
			}
			const ch = String.fromCharCode(b);
			str += ch;
		}
		return str;
	}

	getAtAddr(addr, len) {
		const addrHi = (addr >> 8 ) & 255;
		const addrLo = addr & 255;
		this.write([ 82, addrHi, addrLo, len]);
		const data = this.read();
		return data;
	}

	async readCP() {
		try {
			const nrbytes = this.write(CMD.PRG);
			console.log("bytes: " + nrbytes);
			const ack = this.read();
			logj("data", ack);
			if (ack[0] !== CMD.ACK[0]) {
				return;
			}
			this.write(CMD.PRG2);
			let data = this.read();
			logj("data", data);
			const model = this.getModel(data);
			console.log("model: " + model);

			this.write(CMD.ACK);
			const ack2 = this.read();
			logj("ack2", ack2);
			if (ack2[0] !== CMD.ACK[0]) {
				return;
			}

			const gen = Forms.General;
			const addrPwd = gen.BASE + gen.prgPwd;
			data = this.getAtAddr(addrPwd, 8);
			logj("dataAt", data);

			setTimeout(() => this.dev.close(), 5000);
		} catch (e) {
			console.log(e);
			this.dev.close();
		}
	}

	async connect() {
		const devices = HID.devices();
		// logj("devices", devices);
		const devInfo = devices.find(d => d.vendorId === CABLE_DEVICE.vendorId &&
			 d.productId === CABLE_DEVICE.productId);
		if (!devInfo) {
			console.log("device not found");
			return;
		}
		logj("device found", devInfo);
		this.dev = new HID.HID(CABLE_DEVICE.vendorId, CABLE_DEVICE.productId);
	}

	async disconnect() {

	}

	async execute() {
		await this.connect();
		await this.readCP();
		await this.disconnect();
	}

} // class

async function runme() {
	const t = new Hid();
	try {
		await t.execute();
	} catch(e) {
		console.log(e);
	}
}

runme();