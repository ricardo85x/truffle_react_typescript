import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils/types"
import { Contract } from "web3-eth-contract/types"
import { getWeb3, Web3Window } from "./lib/getWeb3"

// your generate this contract json file with truffle migration
import SimpleStorageContract from "./contracts/SimpleStorage.json"

export default function App() {

  const [storedData, setStoredData] = useState(0)
  const [inputValue, setInput] = useState("0")
  // const [web3, setWeb3] = useState<Web3 | null>(null)
  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [simpleStorage, setSimpleStorage] = useState<Contract | null>(null)

  const loadStorageData = useCallback(async () => {
    const response : number = await simpleStorage?.methods.get().call()
    !!response && setStoredData(response)

  }, [simpleStorage]);

  const reloadAccount = useCallback( async (first_load: boolean = false) => {
    let _web3: Web3;

    if (first_load) {

      _web3 = await getWeb3();

      (_web3.currentProvider as any).on('accountsChanged', () => {
        console.log('account changed');
        reloadAccount()
      });
 
      // detect Network account change
      (_web3.currentProvider as any).on('chainChanged', () => {
        console.log('network changed');
        reloadAccount()
      });

      
    } else {
      _web3 = new Web3((window as Web3Window).ethereum);
      // reset states
      setStoredData(0)
    }

    const _accounts = await _web3.eth.getAccounts();
    const _networkId = await _web3.eth.net.getId();

    // networkid is the first of the list
    let networkId = Object.keys(
      SimpleStorageContract.networks)[0] as keyof typeof SimpleStorageContract.networks;

    // iterate all network ids
    Object.keys(SimpleStorageContract.networks).forEach(_key => {
      const key = _key as keyof typeof SimpleStorageContract.networks;
      // if the network of the metamask is in contract, use it
      if (key === String(_networkId)) {
        networkId = key;
      }
    })

    const _simpleStorage = new _web3.eth.Contract(
      SimpleStorageContract.abi as AbiItem[],
      SimpleStorageContract.networks[networkId] && SimpleStorageContract.networks[networkId]?.address
    )

    // setWeb3(_web3);
    setAccounts(_accounts);
    setSimpleStorage(_simpleStorage);
  }, [])

  // load with page
  useEffect(() => {
    reloadAccount(true)
  }, [reloadAccount, loadStorageData])

  // run after web3 is set
  useEffect(() => {
    loadStorageData()
  }, [simpleStorage, loadStorageData])


  const handleEditStorageData = async ( value : any) => {
    if(!isNaN(value) && Number(value) >=0 && accounts) {
      await simpleStorage?.methods.set(parseInt(String(value))).send({
        from: accounts[0]
      })
      loadStorageData()
    }
  }

  return (
    <>
      <h1>Account  { !!accounts && accounts[0]}</h1>
      <p>Storage data: {storedData}</p>
      <label htmlFor="inputNumber">
        Data 
      </label>
      <input 
        type="number" 
        id="inputNumber" 
        onChange={ 
          evt => setInput(evt.target.value) 
        } 
        value={inputValue} 
      />
      <button 
        onClick={ 
          () => handleEditStorageData(inputValue)
        }
      >Update</button>
    </>
  );
}
