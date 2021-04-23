App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if ( (typeof window.ethereum !== 'undefined')) {
      // If a web3 instance is already provided by Meta Mask.
      //App.web3Provider = new Web3(window.web3.currentProvider);
      App.web3Provider = window.web3.currentProvider;
      //établir la connexion en récupérant la session web3 de Metamask 
      web3 = new Web3(window.ethereum);
      ethereum.request({ method: 'eth_requestAccounts' });
    } else if((typeof web3 !== 'undefined')){
      web3 = new Web3(web3.currentProvider);
    }else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // créer une instance de contrat Truffle à partir du fichier Election.json(ABI) dans le dossier buid
      App.contracts.Election = TruffleContract(election);
      // Connecter le provider App.web3Provider au contrat 
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      //Pour habiller la page HTML (index.html) 
      return App.render();
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
  
    loader.show();
    content.hide();
  
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        web3.eth.defaultAccount = App.account
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  
    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      
      
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
  
      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var parti = candidate[1];
          var prenom = candidate[2];
          var nom = candidate[3];
          var voteCount = candidate[4];
  
          // Afficher les candidats dans le tableau
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + nom +"</td><td>" + prenom +"</td><td>" + parti + "</td><td>" + voteCount + "</td></tr>";
          
          candidatesResults.append(candidateTemplate);

          // Afficher les candidats dans lle menu select
          var candidateOption = "<option value='" + id + "' >" + prenom+" "+nom+ "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
  
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    var cni = $('#cni').val();
    console.log(candidateId);
    console.log(cni);
    
    App.contracts.Election.deployed().then(function(instance) {
      
      return instance.vote(parseInt(candidateId), cni);
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  }
  

};



$(function() {
  $(window).load(function() {
    App.init();
  });
});
