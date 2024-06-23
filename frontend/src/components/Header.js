import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Img/ZKTPS2.png";
import { toast } from "react-toastify";
import { storeContext } from "../useContext/storeContext";
import { Button, Navbar } from "flowbite-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
const Header = () => {
  const [display, setDisplay] = useState(null);
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { account, setAccount, status, index } = useContext(storeContext);
  const truncateWalletAddress = async (address, length = 4) => {
    if (!address) return "";
    const start = address.substring(0, length);
    const end = address.substring(address.length - length);
    setDisplay(`${start}...${end}`);
  };
  function connectWalletL2() {
    if (!primaryWallet) {
      setShowAuthFlow(true);
    } else {
      toast.success("connected");
    }
  }

  useEffect(() => {
    const connect = async () => {
      if (primaryWallet) {
        const signer = await primaryWallet.connector.getSigner();
        setAccount(signer);
        truncateWalletAddress(primaryWallet.address);
      }
    };
    connect();
  }, [primaryWallet]);

  return (
    <Navbar fluid rounded className="bg-transparent shadow-lg text-white">
      <Navbar.Brand href="/">
        <img
          src={logo}
          className="ml-20"
          alt="Flowbite React Logo"
          style={{
            height: "157px",
            marginTop: "-50px",
            marginBottom: "-55px",
            marginLeft: "100px",
          }}
        />
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          ZKTPS
        </span> */}
      </Navbar.Brand>
      <div className="flex md:order-2 mr-20">
        {!account ? (
          <Button color="dark" onClick={connectWalletL2}>
            Connect Wallet
          </Button>
        ) : (
          <Button color="dark" onClick={connectWalletL2}>
            {display}
          </Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {status ? (
          <Link to={`/home/${index}`}>Home</Link>
        ) : (
          <Link to="/">Home</Link>
        )}
        {status && (
          <>
            <Link to="/verify">Verify Ticket</Link>
            <Link to="/invalidate">Invalidate Ticket</Link>
            <Link to="/resale">Resale Tickets</Link>
          </>
        )}
        <Link to="/buyResale">Buy Resale Tickets</Link>
        <Link to="/info">Info</Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
