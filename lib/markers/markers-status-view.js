"use babel";
/** @jsx etch.dom */

import etch from "etch";

export default class MarkersStatusView {
  constructor(model) {
    this.model = model;

    etch.initialize(this);
  }

  render() {
    return (
      <div className="wiki-wiki-wall-markers-status-view inline-block">
        {this.model.getText()}
      </div>
    );
  }

  update() {
    return etch.update(this);
  }

  destroy() {
    return etch.destroy(this);
  }
}
