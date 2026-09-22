import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Chip, CircularProgress, MenuItem, Paper, TextField } from '@mui/material';

const format = (number) => new Intl.NumberFormat('fr-CA', { maximumSignificantDigits: 10 }).format(number);
function Icon({ name, size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'volume' ? <><path d="M12 3C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-12Z"/><path d="M9 15a3 3 0 0 0 3 3"/></> : name === 'swap' ? <><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/></> : <><path d="m3 16 13-13 5 5L8 21Z"/><path d="m7 12 2 2m2-6 2 2m2-6 2 2"/></>}
  </svg>;
}

export default function App() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('length');
  const [from, setFrom] = useState('ft');
  const [to, setTo] = useState('m');
  const [value, setValue] = useState('1');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const requestVersion = useRef(0);
  const category = categories.find((entry) => entry.id === categoryId);
  const source = category?.units.find((unit) => unit.id === from);
  const target = category?.units.find((unit) => unit.id === to);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/units', { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error();
      return response.json();
    }).then(setCategories).catch((error) => {
      if (error.name !== 'AbortError') setLoadError('Le serveur est inaccessible. Vérifiez son démarrage, puis rechargez la page.');
    });
    return () => controller.abort();
  }, []);

  function clearResult() { requestVersion.current += 1; setResult(null); setError(''); setLoading(false); }
  function chooseCategory(id) {
    const next = categories.find((entry) => entry.id === id);
    setCategoryId(id); setFrom(next.units[0].id); setTo(next.units[1].id); clearResult();
  }
  function swapUnits() {
    setFrom(to); setTo(from); clearResult();
  }
  async function submit(event) {
    event.preventDefault();
    const normalized = value.trim().replace(',', '.');
    const number = Number(normalized);
    if (!normalized || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized) || !Number.isFinite(number)) {
      clearResult(); setError('Entrez un nombre valide, par exemple 12,5.'); return;
    }
    const version = ++requestVersion.current;
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await fetch('/api/convert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: number, from, to }), signal: AbortSignal.timeout(10000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'La conversion a échoué.');
      if (version === requestVersion.current) setResult(data);
    } catch (error) {
      if (version === requestVersion.current) setError(error instanceof TypeError || error.name === 'TimeoutError' ? 'Le serveur ne répond pas. Réessayez dans un instant.' : error.message);
    } finally { if (version === requestVersion.current) setLoading(false); }
  }

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="/" aria-label="Unité, accueil"><span className="brand-icon"><Icon name="swap" /></span>unité<span className="brand-dot">.</span></a><span className="header-caption">Le convertisseur du quotidien</span><span className="header-badge">Simple. Précis. Utile.</span></header>
    <main>
      <section className="intro"><p className="eyebrow">MOINS DE CALCULS, PLUS DE CLARTÉ</p><h1>La bonne mesure.<br/><span>En un instant.</span></h1><p className="intro-copy">D’une unité à l’autre, gardez les choses simples.<br/>Choisissez votre mesure, on s’occupe du calcul.</p></section>
      {loadError ? <Alert severity="error">{loadError}</Alert> : !category ? <div className="loading"><CircularProgress size={28} aria-label="Chargement des unités" /></div> : <>
        <div className="workspace">
          <Paper component="section" elevation={0} className="converter" aria-labelledby="converter-title">
            <div className="section-heading"><h2 id="converter-title">Convertir une mesure</h2><Chip label="À vous de jouer" size="small" variant="outlined" /></div>
            <div className="category-tabs" role="group" aria-label="Catégorie de conversion">{categories.map((entry) => <button key={entry.id} className={`category-tab ${categoryId === entry.id ? 'active' : ''}`} aria-pressed={categoryId === entry.id} onClick={() => chooseCategory(entry.id)}><Icon name={entry.id} size={20}/>{entry.name}</button>)}</div>
            <form onSubmit={submit} noValidate>
              <TextField label="Valeur à convertir" value={value} onChange={(event) => { setValue(event.target.value); clearResult(); }} slotProps={{ htmlInput: { inputMode: 'decimal', maxLength: 80 } }} error={Boolean(error)} helperText="Les décimales avec une virgule ou un point sont acceptées." />
              <div className="unit-selectors"><TextField select label="De" value={from} onChange={(event) => { setFrom(event.target.value); clearResult(); }}>{category.units.map((unit) => <MenuItem key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</MenuItem>)}</TextField><button type="button" className="swap-button" onClick={swapUnits} aria-label="Inverser les unités" title="Inverser les unités"><Icon name="swap" size={20}/></button><TextField select label="Vers" value={to} onChange={(event) => { setTo(event.target.value); clearResult(); }}>{category.units.map((unit) => <MenuItem key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</MenuItem>)}</TextField></div>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} endIcon={loading ? <CircularProgress size={18} color="inherit"/> : <span>→</span>}>{loading ? 'Calcul en cours…' : 'Convertir'}</Button>
            </form>
            <section className={`result-panel ${result ? 'has-result' : ''}`} aria-live="polite" aria-atomic="true"><p className="result-label">VOTRE RÉSULTAT</p>{result ? <><p className="result-origin">{format(result.value)} {source.symbol} =</p><p className="result-number">{format(result.result)} <span>{target.symbol}</span></p><p className="result-formula">1 {source.symbol} = {format(result.factor)} {target.symbol}</p></> : <><p className="result-placeholder">Chaque mesure a son équivalent.</p><p className="result-hint">Votre résultat s’affichera ici.</p></>}</section>
          </Paper>
          <aside className="side-panel"><span className="aside-icon"><Icon name={categoryId} size={32}/></span><p className="eyebrow">LES UNITÉS, EN TOUTE SIMPLICITÉ</p><h2>Un petit calcul.<br/>Un grand coup de main.</h2><p>{category.description}</p><div className="ruler" aria-hidden="true"><div/><span>0</span><span>5</span><span>10</span></div><div className="tip"><span className="tip-label">LE SAVIEZ-VOUS ?</span><p>{categoryId === 'volume' ? 'Un gallon américain et un gallon impérial n’ont pas le même volume. Ici, vous choisissez lequel utiliser.' : 'Un pied mesure exactement 0,3048 mètre. Une référence pratique pour vos projets et vos mesures.'}</p></div></aside>
        </div>
        <section className="quick-reference" aria-labelledby="reference-title"><div><p className="eyebrow">DES REPÈRES PRATIQUES</p><h2 id="reference-title">À garder en tête.</h2></div><div className="reference-item"><span>LONGUEUR</span><p>1 pied <b>0,3048 m</b></p></div><div className="reference-item"><span>VOLUME</span><p>1 gallon US <b>3,7854 L</b></p></div><div className="reference-item"><span>DISTANCE</span><p>1 mille <b>1,609344 km</b></p></div></section>
      </>}
    </main><footer><span>unité. <span className="footer-muted">La mesure, tout simplement.</span></span><span>Calculs côté serveur · Affichage à 10 chiffres significatifs</span></footer>
  </div>;
}
