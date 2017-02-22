import regression from 'regression';

export {linear, polynomial};

const sanitise = data => data.map(({x, y}) => [parseFloat(x), parseFloat(y)]);
const calc = {
  max: data => Math.max(...data.map(([x]) => x)),
  min: data => Math.min(...data.map(([x]) => x))
};
const points = 500;
// signed sig fig
const ssf = v => ((Math.sign(v) >= 0) ? '+' : '') + sf(v);
// sig fig
const sf = v => v.toPrecision(3);

function linear(data) {
  data = sanitise(data);
  let r = regression('linear', data);
  let [m, c] = r.equation;
  return {
    generated: generateLinear(m, c, data),
    type: 'linear',
    formula: `y = ${sf(m)}x${ssf(c)}`,
    rsquared: sf(r.r2)
  }
}

function polynomial(data) {
  data = sanitise(data);
  let r = regression('polynomial', data, 3);
  let [a0, a1, a2, a3] = r.equation;
  return {
    generated: generatePolynomial(a0, a1, a2, a3, data),
    type: 'polynomial',
    formula: `y = ${sf(a0)}${ssf(a1)}x${ssf(a2)}x<sup>2</sup>${ssf(a3)}x<sup>3</sup>`,
    rsquared: sf(r.r2)
  }
}

function generateLinear(m, c, data) {
  return generateData(x => m*x + c, data);
}

function generatePolynomial(a0, a1, a2, a3, data) {
  return generateData(x => a0 + a1*x + a2*Math.pow(x,2) + a3*Math.pow(x,3), data);
}

function generateData(expression, data) {
  let [max, min] = [calc.max(data), calc.min(data)];
  let generated = [];
  for (var i = 0; i < points; i++) {
    let x = (i*(max-min)/points)+min;
    generated.push({x: x, y: expression(x)})
  }
  return generated;
}
