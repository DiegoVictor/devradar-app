import React from 'react';
import './Loading.css';

export default function Loading() {
  return (<div className="lds-roller">
    <div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div>
  </div>);
}