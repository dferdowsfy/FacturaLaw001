export const clients = [
  { id: 'meta', name: 'Meta' },
  { id: 'google', name: 'Google' },
  { id: 'walmart', name: 'Walmart' },
  { id: 'tesla', name: 'Tesla' },
  { id: 'apple', name: 'Apple' }
];

export const attorneys = [
  { id: 'jd1', name: 'John Davis', rate: 350 },
  { id: 'mh1', name: 'Maria Henderson', rate: 400 },
  { id: 'rw1', name: 'Robert Wilson', rate: 375 },
  { id: 'ak1', name: 'Alice Kim', rate: 425 },
  { id: 'bs1', name: 'Brian Smith', rate: 350 }
];

export const cases = [
  { id: 'davis-smith', name: 'Davis vs Smith' },
  { id: 'walmart-smith', name: 'Walmart vs Smith' },
  { id: 'tesla-harper', name: 'Tesla vs Harper' }
];

export const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const decimalHours = (i + 1) * 0.1;
  const minutes = Math.round(decimalHours * 60);
  return {
    value: Number(decimalHours.toFixed(1)),
    label: `${decimalHours.toFixed(1)}h (${minutes}m)`
  };
});