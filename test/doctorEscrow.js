const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DoctorEscrow", function () {
  it("tracks confirmations and requires 300", async function () {
    const [patient, d1, d2, d3] = await ethers.getSigners();
    const DoctorEscrow = await ethers.getContractFactory("DoctorEscrow");
    const escrow = await DoctorEscrow.connect(patient).deploy();
    await escrow.initializeEscrow(
      [d1.address, d2.address, d3.address],
      { value: ethers.parseEther("1") }
    );

    await expect(
      escrow.connect(d1).confirmAdvice(patient.address, ethers.ZeroHash, 0)
    )
      .to.emit(escrow, "Confirmed");
    await expect(
      escrow.connect(d2).confirmAdvice(patient.address, ethers.ZeroHash, 0)
    )
      .to.emit(escrow, "Confirmed");

    await expect(escrow.connect(patient).releaseFunds()).to.be.revertedWith("Need 300 confirmations");
  });
});
