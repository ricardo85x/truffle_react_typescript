import Web3 from "web3";
import { provider as Provider } from "web3-core/types"

export interface Web3Window extends Window {
    ethereum?: Provider | any,
    web3?: Web3
}
export const getWeb3 = () =>
  new Promise<Web3>((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if ((window as Web3Window).ethereum) {
        const web3 = new Web3((window as Web3Window).ethereum);
        try {
          // Request account access if needed
          await (window as Web3Window).ethereum.request(
            {
               method: 'eth_requestAccounts' 
            }
          );
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if ((window as Web3Window).web3) {
        // Use Mist/MetaMask's provider.
        const web3 = (window as Web3Window).web3;
        resolve(web3 as Web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        reject("Error on conect to web3 provider")
      }
    });
  });

