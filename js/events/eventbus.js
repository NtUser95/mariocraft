import {Event} from './event';

export class EventBus {
    addEventListener(event, methodListener) {
        if (!(event instanceof Event)) {
            throw new Error('Invalid event type');
        }
    }

    removeEventListener(event, methodListener) {
        if (!(event instanceof Event)) {
            throw new Error('Invalid event type');
        }
    }
}