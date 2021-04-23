// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract Election {
    /*
     * Déclaration d'un candidat 
    */
    struct Candidate {
        uint id;
        string politicalParty;
        string firstname;
        string lastname;
        uint voteCount;
    }

    // Le nombre de candidats
    uint public candidatesCount;
  
    //mapping(_KeyType =>_ValueType)
    mapping(uint => Candidate) public candidates;
    // Les votants  dont la clé est le CNI et valeur true or false
    mapping(string => bool) voters;
    event votedEvent (uint indexed _candidateId);


    constructor() public {
        addCandidate("DevMaster", "Ousmane", "Ndiaye");
    }

    function addCandidate(string memory _politicalParty, 
    string memory _firstname, string memory _lastname) public returns (bool) {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _politicalParty,_firstname, _lastname, 0);
        return true;
    }
    
    function hasVoted(string memory identityCardNumber) public view returns(bool) {
        return voters[identityCardNumber];
    }

    /*function isValidVoter(string memory _identityCardNumber) public view returns(bool) {
        
    }*/

    function vote(uint _candidateId, string memory _identityCardNumber) public returns(bool){
        
            require(!voters[_identityCardNumber]);
            voters[_identityCardNumber] = true;
            candidates[_candidateId].voteCount++;
            // trigger voted event
            emit votedEvent(_candidateId);
            return true;
    }

  

}