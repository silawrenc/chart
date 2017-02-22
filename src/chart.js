import "plottable/plottable.css";

import Plottable from 'plottable';
import {polynomial, linear } from './regression';

export default chart;

function chart() {
  const scale = {
    x: new Plottable.Scales.Linear(),
    y: new Plottable.Scales.Linear()
  };

  const label = {
    x: new Plottable.Components.AxisLabel("x", "0"),
    y: new Plottable.Components.AxisLabel("y", "0")
  };

  const axis = {
    x: new Plottable.Axes.Numeric(scale.x, "bottom"),
    y: new Plottable.Axes.Numeric(scale.y, "left")
  }

  const plots = new Plottable.Components.Group();
  const table = new Plottable.Components.Table([
    [label.y, axis.y, plots],
    [null, null, axis.x],
    [null, null, label.x]
  ])

  function scatter(dataset, color) {
    return new Plottable.Plots.Scatter()
      .addDataset(dataset)
      .x(d => d.x, scale.x)
      .y(d => d.y, scale.y)
      .attr("fill", color);
  }

  function line(dataset, color) {
    return new Plottable.Plots.Line()
      .addDataset(dataset)
      .x(d => d.x, scale.x)
      .y(d => d.y, scale.y)
      .attr("stroke", color)
      .attr("opacity", 0.6);
  }

  let state = {}

  return {
    add(name, color) {
      const plot = {
        scatter: {
          display: true,
          dataset: new Plottable.Dataset([])
        },
        regression: {
          display: true,
          dataset: new Plottable.Dataset([])
        }
      }

      plot.scatter.graph = scatter(plot.scatter.dataset, color);
      plot.regression.graph = line(plot.regression.dataset, color);

      plots.append(plot.scatter.graph);
      plots.append(plot.regression.graph);
      state[name] = plot;
    },
    render(selector) {
      table.renderTo(selector);
      window.addEventListener("resize", () => table.redraw());
    },
    update(name, data) {
      state[name].scatter.dataset.data(data.data);
      let r = (data.basis === 'polynomial') ? polynomial(data.data) : linear(data.data);
      state[name].regression.dataset.data(r.generated);
      return r;
    },
    toggle(name, isRegression) {
      let target = isRegression ? state[name].regression : state[name].scatter;
      target.display ? plots.remove(target.graph) : plots.append(target.graph);
      target.display = !target.display;
    }
  }
}
