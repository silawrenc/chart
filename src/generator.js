const defaultBasis = 'random'
const make = (count=100, xFn, yFn) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    let x = xFn();
    let y = yFn(x);
    results.push({x, y});
  }
  return results;
}

function generator(params) {
  let basis = params.basis || defaultBasis;
  if (!generator[basis]) {
    throw new Error('Basis not supported');
  }
  return generator[basis](params);
}

generator.random = ({count, xmin=0, xmax=100, ymin=0, ymax=100}) => {
  const x = () => Math.random()*(xmax-xmin)+xmin;
  const y = () => Math.random()*(ymax-ymin)+ymin;
  return make(count, x, y);
}

generator.linear = ({count, xmin=0, xmax=100, m=0.5, c=5, e=2}) => {
  const x = () => Math.random()*(xmax-xmin)+xmin;
  const y = x => m*x + c*1 + (Math.random()-0.5)*2*e;
  return make(count, x, y);
}

generator.polynomial = ({count, xmin=0, xmax=100, a0=1, a1=1, a2=1, a3=1, e=2}) => {
  const x = () => Math.random()*(xmax-xmin)+xmin;
  const y = x => a0*1 + a1*x + a2*Math.pow(x, 2) + a3*Math.pow(x, 3) + (Math.random() - 0.5)*2*e;
  return make(count, x, y);
}

module.exports = generator;
