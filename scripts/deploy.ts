import { ethers, run } from "hardhat";
const { getContractAddress } = require("@ethersproject/address");
import { PixiRadio } from "../typechain-types";
import { configService } from "../config";
const hre = require("hardhat");
const request = require("request");

async function main() {
	const PixiRadio = await ethers.getContractFactory("PixiRadio");
	const pixiRadio = (await PixiRadio.deploy(
		configService.getValue("CAP"),
		configService.getValue("REWARD")
	)) as PixiRadio;
	await pixiRadio.deployed();
	console.log(" pixiRadio deployed at : ", pixiRadio.address);

	await sleep(20);

	await verify(pixiRadio.address, [
		configService.getValue("CAP"),
		configService.getValue("REWARD"),
	]);
}

async function verify(address: string, args: any[]) {
	console.log("Verifying contract...");

	try {
		await run("verify:verify", {
			address: address,
			constructorArgumentss: args,
		});

		console.log("Verified");
	} catch (e: any) {
		if (e.message.toLowerCase().includes("already verified")) {
			console.log("Already Verified");
		}
	}

	await sleep(10);
}

async function sleep(s: number) {
	return new Promise((resolve) => {
		console.log(`\nwaiting for ${s}\n`);
		setTimeout(resolve, s * 1000);
	});
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
