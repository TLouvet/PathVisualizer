export class PerformanceComponent {
    startTime;
    endTime;
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
    }
    start() {
        this.startTime = performance.now();
    }
    stop() {
        this.endTime = performance.now();
    }
    getDuration() {
        return this.endTime - this.startTime;
    }
    display() {
        this.stop();
        document.getElementById('exec-time').innerHTML = String(this.getDuration().toFixed(3)) + ' ms';
    }
    reset() {
        this.startTime = 0;
        this.endTime = 0;
    }
}
