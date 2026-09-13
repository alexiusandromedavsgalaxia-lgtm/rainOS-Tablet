import { useState } from 'react';
export default function Calculator() {
 const [value,setValue]=useState('0');
 const press=key=>{if (/^[0-9.]$/.test(key)) setValue(value==='0'?key:value+key); else if(key==='C') setValue('0'); else if(key==='='){try{if(!/^[0-9+*/().% -]+$/.test(value)) throw new Error(); setValue(String(Function('"use strict"; return ('+value+')')()));}catch{setValue('Error');}} else setValue(value==='0'?key:value+key);};
 return <div className="calculator"><output>{value}</output><div className="calculator-keys">{['C','(',')','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','%','='].map(key=><button key={key} onClick={()=>press(key)}>{key}</button>)}</div></div>;
}
