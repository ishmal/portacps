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

	async constructor(vendorId, productId) {
		const HID = require('node-hid');
		this.dev = new HID.HID(vendorId, productId);
	}

	async read() {
		this.dev.readSync();
	}

	async write(dataArray) {
		this.dev.write(dataArray)
	}

	async close() {
		this.dev.close();
	}
}


/**
 * USB device implemented with WebUSB
 */
class WebUsbDevice extends Device {

	async constructor(vendorId, productId) {
		const filter = {
			vendorId,
			productId
		};
		this.dev = await navigator.usb.requestDevice({
			filters: [filter]
		});
		await this.dev.open();
		await this.dev.selectConfiguration(1);
		await this.dev.claimInterface(0);
	}

	async read(len) {
		const result = await this.dev.transferIn(0, len);
		return result.data;
	}

	async write(dataArray) {
		const data = new Uint8Array([1, ...dataArray]);
		await device.transferOut(0, data);
	}

	async close() {
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
export const UsbDevice = async (vendorId, productId) => {
	if (require) {
		return await new HidDevice(vendorId, productId);
	} else if (navigator.usb) {
		return await new WebUsbDevice(vendorId, productId);
	} else {
		throw new Error("no usb api available");
	}
}