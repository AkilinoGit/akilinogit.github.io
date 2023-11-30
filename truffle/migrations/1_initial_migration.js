const PrestamosFactory = artifacts.require("PrestamosFactory");

module.exports = function(_deployer) {
    // Use deployer to state migration tasks.
    _deployer.deploy(PrestamosFactory).then(function() {
      return _deployer.deploy(PrestamosFactory);
    });
  };