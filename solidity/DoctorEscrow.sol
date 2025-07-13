// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * DoctorEscrow
 * Stores patient deposits and tracks doctor confirmations.
 * Uses φ-weighting for reputation-based payouts.
 */
contract DoctorEscrow {
    uint256 private constant PHI_FIXED = 1618033;
    uint256 private constant SCALE = 1e6;

    struct Escrow {
        uint256 vaultBalance;
        address patient;
        address[] doctors;
        mapping(address => bool) signed;
        uint16 confirmCount;
        uint256 weightedSum;
        uint256 primeGapScore;
        bytes32 merkleRoot;
        bool released;
    }

    mapping(address => Escrow) private escrows;

    event Initialized(address indexed patient, uint256 amount);
    event Confirmed(address indexed doctor, address patient, uint16 count, uint256 wAvg);
    event Released(address indexed patient, uint256 amount);

    modifier onlyDoctor(address _patient) {
        require(isDoctor(_patient, msg.sender), "Not listed doctor");
        _;
    }
    modifier escrowExists(address _p) {
        require(escrows[_p].patient != address(0), "Escrow not found");
        _;
    }

    function isDoctor(address _p, address _d) public view returns (bool) {
        address[] storage d = escrows[_p].doctors;
        for (uint256 i = 0; i < d.length; i++) if (d[i] == _d) return true;
        return false;
    }

    function initializeEscrow(address[] calldata doctorList) external payable {
        require(msg.value > 0, "Deposit required");
        require(doctorList.length > 0, "Need doctors");
        Escrow storage e = escrows[msg.sender];
        require(e.patient == address(0), "Already exists");

        e.vaultBalance = msg.value;
        e.patient = msg.sender;
        e.doctors = doctorList;

        emit Initialized(msg.sender, msg.value);
    }

    function confirmAdvice(address patient, bytes32 merkleLeafHash, uint256 altMethodScore)
        external
        escrowExists(patient)
        onlyDoctor(patient)
    {
        Escrow storage e = escrows[patient];
        require(!e.released, "Funds released");
        require(!e.signed[msg.sender], "Already signed");

        e.signed[msg.sender] = true;
        e.confirmCount += 1;

        uint256 w = powPhi(e.confirmCount);
        e.weightedSum += w;

        if (altMethodScore > 0) {
            e.primeGapScore += altMethodScore;
        }

        e.merkleRoot = keccak256(abi.encodePacked(e.merkleRoot, merkleLeafHash));

        emit Confirmed(msg.sender, patient, e.confirmCount, e.weightedSum);

        if (e.confirmCount >= 300) {
            _releaseFundsInternal(patient);
        }
    }

    function releaseFunds() external escrowExists(msg.sender) {
        Escrow storage e = escrows[msg.sender];
        require(e.confirmCount >= 300, "Need 300 confirmations");
        _releaseFundsInternal(msg.sender);
    }

    function _releaseFundsInternal(address patient) internal {
        Escrow storage e = escrows[patient];
        require(!e.released, "Already released");
        e.released = true;

        uint256 bal = e.vaultBalance;
        uint256 len = e.doctors.length;
        uint256 totWeight = e.weightedSum;

        for (uint256 i = 0; i < len; i++) {
            address d = e.doctors[i];
            if (e.signed[d]) {
                uint256 share = (bal * powPhi(uint16(i + 1))) / totWeight;
                payable(d).transfer(share);
            }
        }
        uint256 left = address(this).balance;
        if (left > 0) payable(patient).transfer(left);

        emit Released(patient, bal);
    }

    function powPhi(uint16 n) internal pure returns (uint256) {
        uint256 result = SCALE;
        uint256 base = PHI_FIXED;
        while (n > 0) {
            if (n & 1 == 1) result = (result * base) / SCALE;
            base = (base * base) / SCALE;
            n >>= 1;
        }
        return result;
    }
}
