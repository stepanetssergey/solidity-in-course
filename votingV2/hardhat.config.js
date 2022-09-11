require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/e95eeda83f4e45f0ba8f79adb530310f',
      accounts: ['39a425bdce7f40ff9e9ca151065ac90aaa9a008e00b3b73da87ac29ece216a62'],
    }
  }
};
