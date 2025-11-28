class ComponentLoader {
  static async load(componentName, containerId) {
    try {
      const response = await fetch(`../components/${componentName}.html`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
      } else {
        console.error(`Error: Container element with ID "${containerId}" not found.`);
      }
    } catch (error) {
      console.error(`Error loading component "${componentName}":`, error);
    }
  }
}

export default ComponentLoader;
