import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RpcProvider } from "starknet";
import { connect } from "starknetkit";
import logo from "../Img/logo1.png";
const Header = () => {
  const [display, setDisplay] = useState(null);
  const [account, setAccount] = useState(null);
  const truncateWalletAddress = async (address, length = 4) => {
    if (!address) return "";
    const start = address.substring(0, length);
    const end = address.substring(address.length - length);
    setDisplay(`${start}...${end}`);
  };
  async function connectWalletL2() {
    const { wallet } = await connect({
      provider: new RpcProvider({
        nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
      }),
      dappName: "ZKTPS",
    });
    if (wallet && wallet.isConnected) {
      setAccount(wallet.account);
      localStorage.setItem("account", wallet.account);
    }
  }

  useEffect(() => {
    const connect = async () => {
      try {
        const address = account.address;
        truncateWalletAddress(address);
      } catch (error) {
        console.log(error);
      }
    };
    connect();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark text-bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ fontSize: "25px" }}>
          <img
            src={logo}
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="Logo"
          />
          <span className="ms-1">ZKTPS</span>
        </Link>
        <button
          className="navbar-toggler"
          data-bs-target="#navDrop"
          data-bs-toggle="collapse"
          aria-controls="navDrop"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navDrop">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/verify" className="nav-link">
                Verify Ticket
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/invalidate" className="nav-link">
                Invalidate Ticket
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/info" className="nav-link">
                Info
              </Link>
            </li>
            {!account ? (
              <li className="nav-item">
                <button className="btn btn-light" onClick={connectWalletL2}>
                  Connect Wallet
                </button>
              </li>
            ) : (
              <li className="nav-item ms-1">
                <button className="btn btn-light" onClick={connectWalletL2}>
                  {display}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
