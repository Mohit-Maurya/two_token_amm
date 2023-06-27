import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const AMMAddress = 'AMM_CONTRACT_ADDRESS';

const tokenAAddress = 'TOKEN_A_CONTRACT_ADDRESS';
const tokenBAddress = 'TOKEN_B_CONTRACT_ADDRESS';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const ammContractABI = []; // Add the AMM contract ABI here
const ammContract = new ethers.Contract(AMMAddress, ammContractABI, signer);

const tokenABI = []; // Add the ERC20 token contract ABI here
const tokenAContract = new ethers.Contract(tokenAAddress, tokenABI, signer);
const tokenBContract = new ethers.Contract(tokenBAddress, tokenABI, signer);

function App() {
  const [tokenA, setTokenA] = useState(null);
  const [tokenB, setTokenB] = useState(null);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');

  useEffect(() => {
    const fetchTokenBalances = async () => {
      // if (signer) {
      //   const tokenABalance = await tokenAContract.balanceOf(signer.getAddress());
      //   const tokenBBalance = await tokenBContract.balanceOf(signer.getAddress());
      //   setTokenA(tokenABalance.toString());
      //   setTokenB(tokenBBalance.toString());
      // }
    };

    fetchTokenBalances();
  }, []);

  const handleSwap = async () => {
    try {
      const tx = await ammContract.swap(tokenAAddress, ethers.utils.parseEther(amountIn));
      await tx.wait();
      setAmountIn('');
      setAmountOut('');
      // fetchTokenBalances();
    } catch (error) {
      console.error('Error swapping tokens:', error);
    }
  };

  const handleAmountInChange = (e) => {
    setAmountIn(e.target.value);
    if (e.target.value) {
      const amount = ethers.utils.parseEther(e.target.value);
      const reserveA = 1// Get the reserve of Token A from the AMM contract
      const reserveB = 1// Get the reserve of Token B from the AMM contract
      const amountOut = 1// Calculate the amount of Token B using the constant product formula
      setAmountOut(ethers.utils.formatEther(amountOut));
    } else {
      setAmountOut('');
    }
  };

  return (
    <Container>
      <h1>Two-Token AMM</h1>
      <Row>
        <Col>
          <h3>Token A: {tokenA}</h3>
          <Form.Group>
            <Form.Label>Amount In</Form.Label>
            <Form.Control type="text" value={amountIn} onChange={handleAmountInChange} />
          </Form.Group>
        </Col>
        <Col>
          <h3>Token B: {tokenB}</h3>
          <Form.Group>
            <Form.Label>Amount Out</Form.Label>
            <Form.Control type="text" value={amountOut} disabled />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" onClick={handleSwap}>Swap</Button>
    </Container>
  );
}

export default App;
