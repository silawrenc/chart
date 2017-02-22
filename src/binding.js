import "../css/chart.css";

import * as d3 from "d3";
import updateBuilder from "./update"
import chart from "./chart";


window.addEventListener('DOMContentLoaded', () => {
  let plot = chart();
  let update = updateBuilder(document, plot);

  plot.render('svg#chart');

  // bind data form toggles
  d3.selectAll('[data-toggle][data-toggle-trigger]').on('click', function() {
    let trigger = this.dataset.toggle;
    d3.select(this.parentNode).selectAll('[data-toggle]').classed('active', function() {
      return this.dataset.toggle === trigger;
    });
  });

  // bind data sources
  d3.selectAll('[data-control]').nodes().map(parent => {
    let name = parent.dataset.control;
    let color = parent.dataset.controlColor;
    parent = d3.select(parent);
    plot.add(name, color);

    //scatter checkbox toggles
    parent.select('input[name="data"][type="checkbox"]')
          .on('change', () => plot.toggle(name));

    //regression checkbox toggles
    parent.select('input[name="regression"][type="checkbox"]')
          .on('change', () => plot.toggle(name, true));


    // bind data submissions
    parent.selectAll('form').on('submit', function(e) {
      d3.event.preventDefault();
      update(this, name);
    });

    // request initial data
    let active = parent.select('form.active').node();
    update(active, name);
  });
});
