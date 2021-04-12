import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import Color from "../abis/Color.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(undefined);
  const [totalSupply, setTotalSupply] = useState(0);
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non ethereum browser detected. Consider using MetaMask!!");
    }
  };

  const loadColors = async (_contract, _totalSupply) => {
    let colorsArr = [];
    for (var i = 1; i <= _totalSupply; i++) {
      let color = await _contract.methods.colors(i - 1).call();
      colorsArr.push(color);
    }
    setColors(colorsArr);
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if (networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const _contract = new web3.eth.Contract(abi, address);
      const _totalSupply = await _contract.methods.totalSupply().call();
      setContract(_contract);
      setTotalSupply(_totalSupply.toNumber());
      // Load the colors
      loadColors(_contract, _totalSupply.toNumber());
    } else {
      window.alert("Smart contract is not deployed on detected network.");
    }
  };

  useEffect(async () => {
    await loadWeb3();
    await loadBlockchainData();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(colorInput);
    // Mint new color NFT token
    contract.methods
      .mint(colorInput)
      .send({ from: account }, (error, transactionHash) => {
        if (error) {
          console.log(error);
        } else {
          console.log("rerendering");
          setColors([...colors, colorInput]);
        }
      });
  };
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Color Tokens
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">
              <span id="account">{account}</span>
            </small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>Issue Token</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="e.g. #FFFFFF"
                  value={colorInput}
                  onChange={e => setColorInput(e.target.value)}
                  required
                />
                <input
                  type="submit"
                  className="btn btn-block btn-primary"
                  value="MINT"
                />
              </form>
            </div>
          </main>
        </div>
        <hr />
        <div className="row text-center">
          {colors.map((color, key) => {
            return (
              <div key={key} className="col-md-3 mb-3">
                <div className="token" style={{ backgroundColor: color }}></div>
                <div>{color}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
