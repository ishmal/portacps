

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
class HidDevice extends Device {

	constructor(vendorId, productId) {
		super();
		this.vendorId = vendorId;
		this.productId = productId;
		this.inited = false;
	}

	async init() {
		const module = await import('node-hid');
		const HID = module.default;
		this.dev = new HID.HID(this.vendorId, this.productId);
		this.inited = true;
	}

	async read() {
		if (!this.inited) {
			await this.init();
		}
		const data = this.dev.readSync();
		return data;
	}

	async write(dataArray) {
		if (!this.inited) {
			await this.init();
		}
		this.dev.write(dataArray)
	}

	async close() {
		if (!this.inited) {
			return;
		}
		this.dev.close();
	}
}


/**
 * USB device implemented with WebUSB
 */
class WebUsbDevice extends Device {

	constructor(vendorId, productId) {
		super();
		this.vendorId = vendorId;
		this.productId = productId;
		this.inited = false;
		this.listDevices();
	}

	async init() {
		const filter = {
			vendorId: this.vendorId,
			productId: this.productId
		};
		this.dev = await navigator.usb.requestDevice({
			filters: [filter]
		});
		await this.dev.open();
		await this.dev.selectConfiguration(1);
		await this.dev.claimInterface(0);
		this.inited = true;
	}

	async listDevices() {
		const devices = await navigator.usb.getDevices();
		devices.forEach(d => console.log("device: " + JSON.stringify(d)));
		return devices;
	}

	async read(len) {
		if (!this.inited) {
			await this.init();
		}
		const result = await this.dev.transferIn(5, 64);
		return result.data;
	}

	async write(dataArray) {
		if (!this.inited) {
			await this.init();
		}
		await this.dev.transferOut(4, dataArray);
	}

	async close() {
		if (!this.inited) {
			return;
		}
		await this.dev.close();
	}
}


/**
 * Factory function for getting an environment-specific implementation
 * of a USB device
 *  
 * @param {number} vendorId 
 * @param {number} productId 
 */
export const UsbDevice = (vendorId, productId) => {
	if (typeof window === "undefined") {
		return new HidDevice(vendorId, productId);
	} else if (navigator.usb) {
		return new WebUsbDevice(vendorId, productId);
	} else {
		throw new Error("no usb api available");
	}
}


if (typeof module !== "undefined") {
	module.exports = UsbDevice;
}