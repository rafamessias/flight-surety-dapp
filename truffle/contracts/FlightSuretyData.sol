// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract FlightSuretyData {
    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    bool private operational = true; // Blocks all state changes throughout the contract if false

    mapping(address => bool) private authorizedCallers; //who can call this contract

    enum AirlineStatus {
        Registered,
        Funded,
        Approved,
        Rejected
    }
    AirlineStatus constant defaultChoice = AirlineStatus.Registered;

    //airline struct
    struct Airline {
        string name;
        AirlineStatus status;
        uint256 funds;
        uint8 votes;
    }

    mapping(address => Airline) private airlines;
    uint8 private airlineCount;
    uint8 private multiPartyConsensus = 5;

    // Flights

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;
        address airline;
    }
    mapping(bytes32 => Flight) private flights;

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

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

    /**
    @dev verify if the airline is in funded status
     */
    modifier requireAirlineFundedStatus(address _address) {
        require(
            airlines[_address].status == AirlineStatus.Funded,
            "Airline should be in funded status"
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
    Change multi-party consensus parameter
     */
    function getMultiPartyConsensus()
        public
        view
        requireContractOwner
        returns (uint8)
    {
        return multiPartyConsensus;
    }

    /**
    Change multi-party consensus parameter
     */
    function setMultiPartyConsensus(uint8 _consensusCount)
        external
        requireContractOwner
    {
        require(
            _consensusCount > 0 && _consensusCount < 10,
            "Avoid too large number of consensus"
        );
        multiPartyConsensus = _consensusCount;
    }

    /**
     * @dev sets the authorized callers to this contract
     *
     * Calling this function to add authorized callers
     */

    function authorizeCaller(address _address)
        external
        requireIsOperational
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
        requireIsOperational
        requireContractOwner
        requireValidAddress(_address)
    {
        authorizedCallers[_address] = false;
    }

    function isAirline(address _address)
        private
        view
        requireValidAddress(_address)
        returns (bool)
    {
        bytes memory _name = bytes(airlines[_address].name);
        return _name.length != 0;
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
        requireIsOperational
        requireValidAddress(_address)
        requireAuthorizedCaller
        returns (bool success, uint8 votes)
    {
        airlines[_address].name = name;
        airlines[_address].funds = 0;
        airlines[_address].votes = 0;
        airlineCount++;

        return (true, 0);
    }

    /**
    @notice Airline approval function
     */

    function approveAirlineRegistration(address _address, bool approve)
        external
        requireIsOperational
        requireValidAddress(_address)
        requireAirlineFundedStatus(_address)
        requireAuthorizedCaller
        returns (bool success, uint8 votes)
    {
        if (airlineCount > multiPartyConsensus && approve == true) {
            airlines[_address].votes += 1;
            return (true, airlines[_address].votes);
        }

        if (approve == true) {
            airlines[_address].status = AirlineStatus.Approved;
            return (true, airlines[_address].votes);
        }

        if (approve == false) {
            return (false, airlines[_address].votes);
        }
    }

    /**
    @dev return airline info
     */
    function getAirline(address _address)
        external
        view
        requireValidAddress(_address)
        requireAuthorizedCaller
        returns (
            string memory name,
            uint8 status,
            uint256 funds,
            uint8 votes
        )
    {
        return (
            airlines[_address].name,
            uint8(airlines[_address].status),
            airlines[_address].funds,
            airlines[_address].votes
        );
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
    function fund(address _address)
        external
        payable
        requireIsOperational
        requireValidAddress(_address)
        requireAuthorizedCaller
    {
        require(
            msg.value >= 1 ether,
            "Airline funds should be 1 ether or more"
        );
        require(
            airlines[_address].status == AirlineStatus.Registered,
            "Airline should be in registered status in order to receive funds"
        );

        airlines[_address].funds = msg.value;
        // if more than 5, it requires multi-party consensus
        if (airlineCount < 6) airlines[_address].status = AirlineStatus.Funded;
    }

    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
     * @dev Receive function for funding smart contract.
     *
     */
    // receive() external payable {
    //     fund();
    // }
}
