// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract FlightSuretyData {
    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    bool private operational = true; // Blocks all state changes throughout the contract if false

    mapping(address => bool) private authorizedCallers; //who can call this contract

    //airline register
    struct Airline {
        string name;
        bool active;
        uint256 funds;
    }

    mapping(address => Airline) private airlines;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    /**
     * @dev Constructor
     *      The deploying account becomes contractOwner
     */
    constructor() {
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    /**
     * @dev Modifier that requires the "operational" boolean variable to be "true"
     *      This is used on all state changing functions to pause the contract in
     *      the event there is an issue that needs to be fixed
     */
    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _;
    }

    /**
     * @dev Modifier that requires the "ContractOwner" account to be the function caller
     */
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
     * @dev Requires a valid address
     */
    modifier requireValidAddress(address _address) {
        require(_address != address(0), "Address should be a valid one");
        _;
    }

    /**
     * @dev require to be an authirized caller
     */
    modifier requireAuthorizedCaller() {
        require(
            authorizedCallers[msg.sender] == true,
            "Only Authorized callers can do this action"
        );
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
     * @dev Get operating status of contract
     *
     * @return A bool that is the current operating status
     */
    function isOperational() public view returns (bool) {
        return operational;
    }

    /**
     * @dev Sets contract operations on/off
     *
     * When operational mode is disabled, all write transactions except for this one will fail
     */
    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    /**
     * @dev sets the authorized callers to this contract
     *
     * Calling this function to add authorized callers
     */

    function authorizeCaller(address _address)
        external
        requireContractOwner
        requireValidAddress(_address)
    {
        authorizedCallers[_address] = true;
    }

    /**
     * @dev deny access to a specific caller
     */
    function denyCaller(address _address)
        external
        requireContractOwner
        requireValidAddress(_address)
    {
        authorizedCallers[_address] = false;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     *
     */
    function registerAirline(address _address, string calldata name)
        external
        payable
        requireValidAddress(_address)
        requireAuthorizedCaller
        returns (bool success, uint256 votes)
    {
        airlines[_address].name = name;

        if (msg.value >= 1 ether) {
            airlines[_address].active = true;
            airlines[_address].funds = msg.value;
        } else {
            airlines[_address].active = false;
            airlines[_address].funds = 0;
        }

        return (true, 0);
    }

    /**
     * @dev Buy insurance for a flight
     *
     */
    function buy() external payable {}

    /**
     *  @dev Credits payouts to insurees
     */
    function creditInsurees() external pure {}

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    function pay() external pure {}

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */
    function fund()
        public
        payable
        requireValidAddress(msg.sender)
        requireAuthorizedCaller
    {
        if (airlines[msg.sender].active == true) {
            airlines[msg.sender].funds += msg.value;
        } else if (msg.value >= 1 ether) {
            airlines[msg.sender].active = true;
            airlines[msg.sender].funds = msg.value;
        }
    }

    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
     * @dev Fallback function for funding smart contract.
     *
     */
    fallback() external payable {
        fund();
    }

    /**
     * @dev Receive function for funding smart contract.
     *
     */
    receive() external payable {
        fund();
    }
}
