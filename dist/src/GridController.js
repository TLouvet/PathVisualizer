export class GridController {
    reinitializeAll(nodes) {
        nodes.forEach((node) => {
            node.reinitialize();
            node.setNoneState();
        });
    }
}
