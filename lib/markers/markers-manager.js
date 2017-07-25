"use babel";
import { CompositeDisposable, BufferedProcess } from "atom";

import MarkersStatus from "./markers-status";
import MarkersManagerView from "./markers-manager-view";

export default class MarkersManager {
  constructor(
    master,
    state,
    atomEnv = global.atom,
    config = atomEnv.config,
    workspace = atomEnv.workspace,
    commands = atomEnv.commands
  ) {
    this.master = master;
    this.state = state;
    this.statusBar = null;
    this.atomEnv = atomEnv;
    this.config = config;
    this.workspace = workspace;
    this.commands = commands;
    this.editor = master.editor;
    this.editorDisposables = null;
    this.subscriptions = new CompositeDisposable();

    this.attached_status_bar = null;
    this.settings = {};
    this.view = null;
    this.attached_panel = null;
    this.addCommands();
    this.view = new MarkersManagerView(this);
    this.observeEvents();
    this.displayView();
  }
  addCommands() {
    if (!this.subscriptions) {
      this.subscriptions = new CompositeDisposable();
    }
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "wiki-wiki-wall:setMarker": () => this.setMarker(),
        "wiki-wiki-wall:removeMarker": () => this.removeMarker(),
        "wiki-wiki-wall:clearAllMarkers": () => this.clearAllMarkers()
      })
    );
  }
  clearAllMarkers() {
    console.log("You wanted to remove all markers");
  }
  removeMarker() {
    console.log("You wanted to remove a marker");
  }
  setMarker() {
    let editor = this.getEditor();
    let range = editor.getSelectedBufferRange();
    let content = editor.getTextInBufferRange(range);
    if (content.match(/Variable/)) {
      let marker = editor.markBufferRange(range, { invalidate: "never" });
      let decoration = editor.decorateMarker(marker, {
        type: "line-number",
        class: `line-number-green`
      });
    }
    console.log("You wanted to add a marker", content);
  }
  getMarkerCount() {
    return 4;
  }
  getEditor() {
    return this.workspace.getActiveTextEditor();
  }
  isWWWF() {
    let pane = this.workspace.getActivePaneItem();
    if (
      pane &&
      pane.buffer &&
      pane.buffer.file &&
      pane.buffer.file.path.match(/\.wwwf$/)
    ) {
      return true;
    }
    return false;
  }

  displayView() {
    this.view.update();
    this.attached_panel = this.workspace.addBottomPanel({
      item: this.view.element
    });
  }
  consumeStatusBar(statusBar) {
    this.statusBar = statusBar;

    return this.attachStatusBar();
  }
  attachStatusBar() {
    if (this.attached_status_bar) {
      return;
    }
    if (this.statusBar == null) {
      return;
    }

    this.attached_status_bar = new MarkersStatus(this.master, this.statusBar);
    return true;
    //  return this.attached_status_bar.attach();
  }
  observeEvents() {
    if (!this.subscriptions) {
      this.subscriptions = new CompositeDisposable();
    }
    this.subscriptions.add(
      this.workspace.onDidChangeActivePaneItem(() => {
        this.displayView();
      })
    );
  }

  destroy() {
    this.subscriptions.dispose();
    if (this.attached_status_bar) {
      this.attached_status_bar.destroy();
    }
    if (this.view) {
      this.view.destroy();
    }
    if (this.attached_panel) {
      this.attached_panel.destroy();
    }
  }
  deserialize(state) {
    return {
      markerViewState: this.view.serialize()
    };
  }

  debug(message) {
    if (this.atomEnv.inDevMode()) {
      console.log(message);
    }
  }
}