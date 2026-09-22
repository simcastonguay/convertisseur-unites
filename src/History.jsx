import React from 'react';
import { Button, Paper } from '@mui/material';

export default function History({ entries, onRestore, onClear, format, storageUnavailable }) {
  return <Paper component="section" elevation={0} className="history" aria-labelledby="history-title">
    <div className="section-heading"><div><p className="eyebrow">VOS DERNIERS CALCULS</p><h2 id="history-title">Un peu de mémoire.</h2></div><Button size="small" onClick={onClear} disabled={!entries.length}>Effacer l’historique</Button></div>
    <p className="history-note">{storageUnavailable ? 'Le stockage est indisponible. Cet historique restera disponible jusqu’au rechargement de la page.' : 'Les six dernières conversions réussies, conservées dans ce navigateur.'}</p>
    {entries.length ? <ol className="history-list">{entries.map((entry, index) => <li key={index}><span><span className="history-source">{format(entry.value)} {entry.fromSymbol}</span><span aria-hidden="true" className="history-arrow"> → </span><strong>{format(entry.result)} {entry.toSymbol}</strong></span><Button size="small" onClick={() => onRestore(entry)} aria-label={`Reprendre ${format(entry.value)} ${entry.fromSymbol} vers ${entry.toSymbol}`}>Reprendre</Button></li>)}</ol> : <p className="history-empty">Votre première conversion vous attend. Elle apparaîtra ici.</p>}
  </Paper>;
}
