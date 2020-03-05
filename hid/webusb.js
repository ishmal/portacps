

const genericFilter = {
	vendorId: 0x0bda,
	classCode: 0xFF, // vendor-specific
	// protocolCode: 0x01
};


class WebUsb {
	constructor() {

	}

	async getDevices(filters = []) {
		const device = await navigator.usb.requestDevice({ filters: []})
		const devices = await navigator.usb.getDevices();
		return devices;
	}

	async execute() {

	}
}



window.document.addEventListener("DOMContentLoaded", () => {
	const tool = new WebUsb();
	const button = document.getElementById('run-button');
	button.addEventListener('click', async () => {
	  const devices = await tool.getDevices();
	  devices.forEach(d => console.log(JSON.stringigy(d)));
	});
	
});

