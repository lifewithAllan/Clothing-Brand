import React from 'react';
import BuyerNavbar from '../../components/nav/BuyerNavbar';
import HamburgerMenu from '../../components/nav/HamburgerMenu';

export default function AboutPage() {
  return (<>
    <BuyerNavbar />
    <HamburgerMenu />
    <main style={{padding:20}}> <h2>About Us</h2><p>Information about the store.</p></main>
  </>);
}
