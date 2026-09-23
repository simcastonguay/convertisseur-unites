// Chaque facteur exprime une unité en mètres, en litres ou en mètres par seconde.
export const categories = [
  { id: 'length', name: 'Longueur', description: 'Des petits projets aux grands parcours.', units: [
    { id: 'm', name: 'Mètres', symbol: 'm', factor: 1 },
    { id: 'km', name: 'Kilomètres', symbol: 'km', factor: 1000 },
    { id: 'cm', name: 'Centimètres', symbol: 'cm', factor: 0.01 },
    { id: 'ft', name: 'Pieds', symbol: 'pi', factor: 0.3048 },
    { id: 'in', name: 'Pouces', symbol: 'po', factor: 0.0254 },
    { id: 'mi', name: 'Milles', symbol: 'mi', factor: 1609.344 },
  ] },
  { id: 'volume', name: 'Volume', description: 'La bonne mesure, jusqu’à la dernière goutte.', units: [
    { id: 'l', name: 'Litres', symbol: 'L', factor: 1 },
    { id: 'ml', name: 'Millilitres', symbol: 'mL', factor: 0.001 },
    { id: 'gal-us', name: 'Gallons américains', symbol: 'gal US', factor: 3.785411784 },
    { id: 'gal-imp', name: 'Gallons impériaux', symbol: 'gal imp', factor: 4.54609 },
  ] },
  { id: 'temperature', name: 'Température', description: 'De la météo à la cuisine, trouvez vos repères.', units: [
    { id: 'c', name: 'Celsius', symbol: '°C', factor: 1, offset: 0 },
    { id: 'f', name: 'Fahrenheit', symbol: '°F', factor: 5 / 9, offset: -160 / 9 },
    { id: 'k', name: 'Kelvins', symbol: 'K', factor: 1, offset: -273.15 },
  ] },
  { id: 'speed', name: 'Vitesse', description: 'Sur la route, sur l’eau ou au pas de course.', units: [
    { id: 'kmh', name: 'Kilomètres par heure', symbol: 'km/h', factor: 1 / 3.6 },
    { id: 'mps', name: 'Mètres par seconde', symbol: 'm/s', factor: 1 },
    { id: 'mph', name: 'Milles par heure', symbol: 'mi/h', factor: 0.44704 },
    { id: 'kn', name: 'Nœuds', symbol: 'nd', factor: 1852 / 3600 },
  ] },
];

export class ConversionError extends Error {}

export function convert(input) {
  if (!input || typeof input !== 'object') throw new ConversionError('La demande est invalide.');
  const { value, from, to } = input;
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new ConversionError('Entrez un nombre fini.');
  const category = categories.find((entry) => entry.units.some((unit) => unit.id === from));
  const source = category?.units.find((unit) => unit.id === from);
  const target = category?.units.find((unit) => unit.id === to);
  if (!source || !target) throw new ConversionError('Choisissez deux unités de la même catégorie.');
  const factor = source.factor / target.factor;
  const offset = ((source.offset || 0) - (target.offset || 0)) / target.factor;
  const celsius = value * source.factor + (source.offset || 0);
  if (category.id === 'temperature' && celsius < -273.15 - 1e-10) throw new ConversionError('La température ne peut pas être inférieure au zéro absolu (0 K).');
  let result = value * factor + offset;
  // Les limites physiques restent exactes malgré les imprécisions des nombres flottants.
  if (category.id === 'temperature' && to === 'k' && Math.abs(result) < 1e-10) result = 0;
  if (!Number.isFinite(result)) throw new ConversionError('Le résultat dépasse la capacité du calculateur.');
  return { value, from, to, result, factor, offset, category: category.id };
}
