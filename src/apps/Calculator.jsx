import { useMemo, useState } from 'react';

const keys = ['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='];

function tokenize(expression) {
  return expression.match(/\d+(?:\.\d+)?|[()+*/%-]/g) ?? [];
}

function evaluateExpression(expression) {
  const tokens = tokenize(expression.replace(/\s+/g, ''));
  if (!tokens.length || tokens.join('') !== expression.replace(/\s+/g, '')) throw new Error('Invalid expression');
  let index = 0;
  const peek = () => tokens[index];
  const consume = () => tokens[index++];
  const primary = () => {
    if (peek() === '(') { consume(); const value = addSub(); if (consume() !== ')') throw new Error('Missing parenthesis'); return value; }
    const token = consume();
    if (!/^\d+(?:\.\d+)?$/.test(token)) throw new Error('Expected number');
    return Number(token);
  };
  const unary = () => {
    if (peek() === '-') { consume(); return -unary(); }
    return primary();
  };
  const mulDiv = () => { let value = unary(); while (peek() === '*' || peek() === '/' || peek() === '%') { const op = consume(); const rhs = unary(); if (op === '*') value *= rhs; else if (op === '/') { if (rhs === 0) throw new Error('Division by zero'); value /= rhs; } else value %= rhs; } return value; };
  const addSub = () => { let value = mulDiv(); while (peek() === '+' || peek() === '-') { const op = consume(); const rhs = mulDiv(); value = op === '+' ? value + rhs : value - rhs; } return value; };
  const result = addSub();
  if (index !== tokens.length) throw new Error('Unexpected token');
  return result;
}

export default function Calculator() {
  const [value, setValue] = useState('0');
  const [history, setHistory] = useState([]);
  const display = useMemo(() => value.length > 18 ? `${value.slice(0, 18)}…` : value, [value]);

  const press = key => {
    if (/^\d$/.test(key) || key === '.') setValue(current => current === '0' ? key : current + key);
    else if (key === 'C') setValue('0');
    else if (key === '=') {
      try { const result = evaluateExpression(value); setHistory(current => [{ expression: value, result }, ...current].slice(0, 10)); setValue(String(Number.isInteger(result) ? result : Number(result.toFixed(12)))); }
      catch { setValue('Error'); }
    } else setValue(current => current === '0' ? key : current + key);
  };

  return <div className="calculator">
    <output aria-live="polite">{display}</output>
    <div className="calculator-keys">{keys.map(key => <button key={key} onClick={() => press(key)}>{key}</button>)}</div>
    {history.length > 0 && <section className="calculator-history"><h3>Historial</h3>{history.map((item, index) => <button key={`${item.expression}-${index}`} onClick={() => setValue(String(item.result))}>{item.expression} = {item.result}</button>)}</section>}
  </div>;
}
