export class UniqueQueue<T> {
    private readonly queue: T[] = [];
    private readonly elements = new Set<T>();

    public get length(): number {
        return this.queue.length;
    }

    public enqueue(element: T ): void {
        if (this.elements.has(element))
            return;

        this.queue.push(element);
        this.elements.add(element);
    }

    public dequeue() : T | null {
        const element = this.queue.shift();
        if(!element)
            return null;

        this.elements.delete(element);
        return element;
    }

    public clear() : void {
        this.elements.clear();
        this.queue.splice(0, this.queue.length);
    }
}