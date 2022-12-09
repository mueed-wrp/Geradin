import { ethers, run } from "hardhat";
const { getContractAddress } = require("@ethersproject/address");
import { PixiRadio } from "../typechain-types";
import { configService } from "../config";
const hre = require("hardhat");
const request = require("request");

async function main() {
	const args = [
		parseInt(configService.getValue("CAP", true)),
		parseInt(configService.getValue("REWARD", true)),
	];

	await verify(configService.getValue("CONTRACT_ADDRESS"), args);
}

async function verify(address: string, args: any[]) {
	await sleep(2);

	console.log("---> Verifying contract...");

	try {
		await run("verify:verify", {
			address: address,
			constructorArguments: args,
		});
		console.log("---> Verified");
	} catch (e: any) {
		if (e.message.toLowerCase().includes("already verified")) {
			console.log("---> Already Verified");
		}
	}
}

async function sleep(s: number) {
	return new Promise((resolve) => {
		console.log(`\nwaiting for ${s} seconds\n`);
		setTimeout(resolve, s * 1000);
	});
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
