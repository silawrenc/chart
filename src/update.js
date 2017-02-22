
export default updateBuilder;

function updateBuilder(document, plot) {
  function showAlert() {
    let cl = document.getElementById('alert').classList;
    cl.add('active');
    setTimeout(() => cl.remove('active'), 3000);
  }

  function showSuccess() {
    let cl = document.getElementById('success').classList;
    cl.add('active');
    setTimeout(() => cl.remove('active'), 3000);
  }

  function showLoading(form) {
    form.parentNode.classList.add('loading');
    document.getElementById('chart-container').classList.add('loading');
  }

  function removeLoading(form) {
    form.parentNode.classList.remove('loading');
    document.getElementById('chart-container').classList.remove('loading');
  }

  function update(form, name) {
    showLoading(form)
    let callback = (err, data) => {
      removeLoading(form)
      if (err) {
        return showAlert();
      }
      let {type, rsquared, formula} = plot.update(name, {data: data, basis: form.basis.value});
      let parent = d3.select(form.parentNode)
      parent.select('[data-regression-type]').html(type);
      parent.select('[data-regression-r2]').html(rsquared);
      parent.select('[data-regression-formula]').html(formula);
      return showSuccess();
    }
    let query = [];
    d3.selectAll(form.elements).each(function addToQuery() {
      this.name && query.push(`${this.name}=${this.value}`);
    });
    d3.json('/data?' + query.join('&'), callback);
  }

  return update;
}
