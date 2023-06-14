export function PQObject(id, priority, data) {
    this.id = id;
    this.priority = priority;
    this.data = data;
}
export function PriorityQueue() {
    this.items = [];
}
PriorityQueue.prototype.enqueue = function(node) {
    if (node.priority == null || node.priority == 0) {
        this.items.push(node);
        return;
    }
    
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].priority == null) {
            this.items.splice(i, 0, node);
            return;
        }

        if (node.priority < this.items[i].priority) {
            // Once the correct location is found it is
            // enqueued
            this.items.splice(i, 0, node);
            return;
        }
    }

    this.items.push(node);
    return;
}
PriorityQueue.prototype.dequeue = function() {
    if (this.isEmpty()) {
        return null;
    }
    return this.items.shift();
}
PriorityQueue.prototype.isEmpty = function() {
    return this.items.length == 0;
}