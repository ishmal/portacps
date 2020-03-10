const usb = require("usb");
const promisify = require("util").promisify;

const FTDI_DEVICE = {
	vendorId: 1027, // 0x0403
	productId: 24577, // 0x6001
};

/**
 * Base class for a USB device
 */
class Device {
	async read() {
		return [];
	}

	async write(dataArray) {

	}

	async close() {

	}
}

/**
 * USB device implemented with the HID interface
 */
class UsbDevice extends Device {

	constructor(vendorId, productId) {
		super();
		this.vendorId = vendorId;
		this.productId = productId;
		this.inited = false;
	}

	async init() {
		this.dev = usb.findByIds(this.vendorId, this.productId);
		this.dev.open();
		const p_claim = promisify(this.dev.__claimInterface.bind(this.dev));
		await p_claim(0);
		this.iface = this.dev.interface();
		this.inited = true;
	}

	async read() {
		if (!this.inited) {
			await this.init();
		}
		const inEndpoint = this.iface.endpoints[0];
		inEndpoint.transfer(64, (e, d) => {
			if (e) {
				throw new Error(e);
			} else {
				return d;
			}
		});
	}

	async write(dataArray) {
		if (!this.inited) {
			await this.init();
		}
		const outEndpoint = this.iface.endpoints[1];
		outEndpoint.transfer(dataArray, (e) => {
			if (e) {
				throw new Error(`write: ${e}`);
			} else {
				return;
			}
		});
	}

	async close() {
		if (!this.inited) {
			return;
		}
		this.dev.close();
	}
}


class Ftdi {
	constructor() {

	}

	async write(cmd) {

	}

	async readBlock(address, nrBytes) {
		const cmdLetter = 83; // S
		const hi = (address >> 8) & 0xff;
		const lo = address & 0xff;
		const len = nrBytes & 0xff;
		const cmd = [cmdLetter, hi, lo, len];
		await this.dev.write(cmd);
		const rx = await this.dev.read(64);
		if (rx[0] !== 88) { // X
			throw new Error("readBlock received error");
		}
		const rxAddr = data[1] << 8 + data[2];
		if (rxAddr !== address) {
			throw new Error("readBlock received bad address");
		}
		const rxLen = rx[3];
		if (rxLen !== nrBytes) {
			throw new Error("readBlock received bad number of bytes")
		}
		await this.write([6]);
		const ack = await this.read(1);
		if (ack[0] !== 6) {
			throw new Error("readBlock received bad acknowledge");
		}
		const data = [];
		for (let i = 0; i < nrBytes; i++) {
			data[i] = rx[i + 3];
		}
		return data;
	}

	async download() {

		// Main block.
		for (let addr = 0; addr < 0x1800; addr += 0x40) {
			const data = await this.readBlock(addr, 0x40);
		}

		// Auxiliary block starts at 0x1EC0.
		for (let addr = 0x1EC0; addr < 0x2000; addr += 0x40) {
			const data = await this.readBlock(addr, 0x40);
		}

	}

	async execute() {
		const devices = usb.getDeviceList();
		// console.log("devices: " + JSON.stringify(devices, null, 2));
		const devInfo = devices.find(d => {
			const dd = d.deviceDescriptor;
			return dd.idVendor === FTDI_DEVICE.vendorId && dd.idProduct === FTDI_DEVICE.productId;
		});
		if (!devInfo) {
			console.log("device nod found");
			return;
		}
		this.dev = new UsbDevice(FTDI_DEVICE.vendorId, FTDI_DEVICE.productId);
		this.dev.init();
		console.log("FTDI device found");
		await this.download();
	}
}

async function runme() {
	const tool = new Ftdi();
	await tool.execute();
}

runme();