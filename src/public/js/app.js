import DataVisuManager from './dataVisu/DataVisuManager';

class App {
  constructor() {
    this.dataVisuManager = new DataVisuManager();

    this.init();
  }

  init() {
    console.log('initiated');
    this.dataVisuManager.init();
  }
}

// Iniate main app
(() => {
  let app = new App();
})();
