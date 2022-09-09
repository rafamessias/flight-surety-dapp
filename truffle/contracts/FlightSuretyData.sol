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

    struct AirlineApproval {
        address airline;
        bool approval;
    }

    //airline struct
    struct Airline {
        string name;
        AirlineStatus status;
        uint256 funds;
        AirlineApproval[] votes;
    }

    mapping(address => Airline) private airlines;
    uint8 private airlineCount = 0;
    uint8 private multiPartyConsensusThreshold = 4;

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
    function getMultiPartyConsensusThreshold()
        public
        view
        requireContractOwner
        returns (uint8)
    {
        return multiPartyConsensusThreshold;
    }

    /**
    Change multi-party consensus parameter
     */
    function setmultiPartyConsensusThreshold(uint8 _consensusCount)
        external
        requireContractOwner
    {
        require(
            _consensusCount > 0 && _consensusCount < 10,
            "Avoid too large number of consensus"
        );
        multiPartyConsensusThreshold = _consensusCount;
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
        requireContractOwner
        requireValidAddress(_address)
        returns (bool)
    {
        bytes memory _name = bytes(airlines[_address].name);
        return _name.length != 0;
    }

    function getTotalAirlines()
        external
        view
        requireAuthorizedCaller
        returns (uint8)
    {
        return airlineCount;
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

        return (true, 0);
    }

    /**
    @notice Airline approval function
     */

    function approveAirlineRegistration(
        address _address,
        address _from,
        bool _approval
    )
        external
        requireIsOperational
        requireValidAddress(_address)
        requireAirlineFundedStatus(_address)
        requireAuthorizedCaller
        returns (bool success, uint8 votes)
    {
        //if we have more airlines than the threshold, apply multi-party consensus
        if (airlineCount >= multiPartyConsensusThreshold) {
            bool isDuplicatedVote = false;

            for (
                uint8 vote = 0;
                vote < airlines[_address].votes.length;
                vote++
            ) {
                if (airlines[_address].votes[vote].airline == _from) {
                    isDuplicatedVote = true;
                    break;
                }
            }

            require(!isDuplicatedVote, "Caller already vote for this Airline");

            airlines[_address].votes.push(
                AirlineApproval({airline: _from, approval: _approval})
            );

            // if votes are more than 50% of the airlines, define if it is approved or not
            if (airlines[_address].votes.length >= (airlineCount / 2)) {
                uint8 approvedVotes = 0;
                for (
                    uint8 vote = 0;
                    vote < airlines[_address].votes.length;
                    vote++
                ) {
                    if (airlines[_address].votes[vote].approval == true)
                        approvedVotes += 1;
                }

                if (approvedVotes >= (airlineCount / 2)) {
                    airlines[_address].status = AirlineStatus.Approved;
                    airlineCount += 1;
                } else {
                    airlines[_address].status = AirlineStatus.Rejected;
                }
            }
        } else {
            airlines[_address].votes.push(
                AirlineApproval({airline: _from, approval: _approval})
            );
            airlines[_address].status = AirlineStatus.Approved;
            airlineCount += 1;
        }

        return (true, uint8(airlines[_address].votes.length));
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
            uint8(airlines[_address].votes.length)
        );
    }

    function registerFlight(
        bytes32 flight,
        uint256 updatedTimestamp,
        address airline
    ) external requireValidAddress(airline) requireAuthorizedCaller {
        flights[flight].airline = airline;
        flights[flight].updatedTimestamp = updatedTimestamp;
        flights[flight].isRegistered = true;
        flights[flight].statusCode = 0;
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
        airlines[_address].status = AirlineStatus.Funded;
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
