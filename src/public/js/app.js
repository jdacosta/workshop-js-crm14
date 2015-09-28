import DataVisuManager from './dataVisu/DataVisuManager';

class App {
  constructor() {
    this.dataVisuManager = new DataVisuManager();

    this.init();
  }

  init() {
    this.dataVisuManager.init();
  }
}

// Iniate main app
(() => {
  let app = new App();
})();
