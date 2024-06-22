import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RpcProvider } from "starknet";
import { connect } from "starknetkit";
import logo from "../Img/logo1.png";
import { toast } from "react-toastify";
import { storeContext } from "../useContext/storeContext";
import { Button, Navbar } from "flowbite-react";
const Header = () => {
  const [display, setDisplay] = useState(null);
  //   const [account, setAccount] = useState(null);
  const { account, setAccount, status, index } = useContext(storeContext);
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
      toast.success("connected");
      setAccount(wallet.account);
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
  }, [account]);

  return (
    <Navbar fluid rounded className="shadow-md">
      <Navbar.Brand href="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          ZKTPS
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
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
          <Link to={`/home/${index}`} active>
            Home
          </Link>
        ) : (
          <Link to="/" active>
            Home
          </Link>
        )}
        {status && (
          <>
            <Link to="/verify">Verify Ticket</Link>
            <Link to="/invalidate">Invalidate Ticket</Link>
            <Link to="/resale">Resale Tickets</Link>
          </>
        )}
        <Link href="#">Info</Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
