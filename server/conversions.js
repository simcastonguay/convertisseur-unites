// Chaque facteur exprime une unité en mètres ou en litres.
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
  const result = value * (source.factor / target.factor);
  if (!Number.isFinite(result)) throw new ConversionError('Le résultat dépasse la capacité du calculateur.');
  return { value, from, to, result, factor: source.factor / target.factor, category: category.id };
}
